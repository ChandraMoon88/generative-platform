/**
 * PostgreSQL Database Configuration for Production
 * Uses Neon Serverless Postgres
 */

import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

let pool: Pool | null = null;

/**
 * Initialize PostgreSQL connection pool
 */
export function initPostgresPool(): Pool {
  if (!pool) {
    const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
    
    if (!connectionString) {
      throw new Error('Database URL not found in environment variables');
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Neon
      },
      max: 10, // Maximum connections in pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    logger.info('PostgreSQL connection pool initialized');
  }

  return pool;
}

/**
 * Get PostgreSQL pool instance
 */
export function getPool(): Pool {
  if (!pool) {
    return initPostgresPool();
  }
  return pool;
}

/**
 * Initialize database schema
 */
export async function initializeSchema(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(512) NOT NULL,
        salt VARCHAR(512) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'client',
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL
      )
    `);

    // Create app_models table
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_models (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        user_id VARCHAR(255) NOT NULL,
        metadata TEXT,
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        user_id VARCHAR(255) NOT NULL,
        app_model_id VARCHAR(255),
        config TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        created_at BIGINT NOT NULL,
        updated_at BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (app_model_id) REFERENCES app_models(id) ON DELETE SET NULL
      )
    `);

    // Create interactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS interactions (
        id VARCHAR(255) PRIMARY KEY,
        project_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        component_id VARCHAR(255),
        event_type VARCHAR(100) NOT NULL,
        event_data TEXT,
        timestamp BIGINT NOT NULL,
        session_id VARCHAR(255),
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create indexes for performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_interactions_project_id ON interactions(project_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_interactions_timestamp ON interactions(timestamp)');

    await client.query('COMMIT');
    logger.info('Database schema initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Failed to initialize schema', { error });
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Execute a query
 */
export async function query(text: string, params?: any[]) {
  const pool = getPool();
  return pool.query(text, params);
}

/**
 * Get a client from the pool (for transactions)
 */
export async function getClient(): Promise<PoolClient> {
  const pool = getPool();
  return pool.connect();
}

/**
 * Close the pool (cleanup)
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    logger.info('PostgreSQL connection pool closed');
  }
}
