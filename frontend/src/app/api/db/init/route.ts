import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function GET(request: NextRequest) {
  try {
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
      await client.query('CREATE INDEX IF NOT EXISTS idx_interactions_session_id ON interactions(session_id)');

      await client.query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Database schema initialized successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Schema initialization error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to initialize database schema',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
