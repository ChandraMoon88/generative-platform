/**
 * Database Initialization
 * Sets up SQLite database with required tables
 */

import Database from 'better-sqlite3';
import { logger } from '../utils/logger';

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  const dbPath = process.env.DATABASE_PATH || 'data/generative-platform.db';
  
  // Ensure data directory exists
  const { mkdirSync, existsSync } = await import('fs');
  const { dirname } = await import('path');
  const dir = dirname(dbPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  
  // Create tables
  createTables();
  
  logger.info(`Database initialized at ${dbPath}`);
}

function createTables(): void {
  // Events table - stores raw events
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      user_id TEXT,
      type TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      data TEXT NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    )
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_events_session ON events(session_id);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
  `);
  
  // Sessions table - groups related events
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      start_time INTEGER NOT NULL,
      end_time INTEGER,
      event_count INTEGER DEFAULT 0,
      metadata TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    )
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_start ON sessions(start_time);
  `);
  
  // Recognized patterns table
  db.exec(`
    CREATE TABLE IF NOT EXISTS patterns (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      type TEXT NOT NULL,
      confidence REAL NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      event_ids TEXT NOT NULL,
      metadata TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      FOREIGN KEY (session_id) REFERENCES sessions(id)
    )
  `);
  
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_patterns_session ON patterns(session_id);
    CREATE INDEX IF NOT EXISTS idx_patterns_type ON patterns(type);
  `);
  
  // Application models table
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_models (
      id TEXT PRIMARY KEY,
      version TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      data TEXT NOT NULL,
      pattern_ids TEXT,
      confidence REAL,
      created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    )
  `);
  
  // Pattern definitions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS pattern_definitions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL,
      rules TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (strftime('%s', 'now') * 1000),
      updated_at INTEGER DEFAULT (strftime('%s', 'now') * 1000)
    )
  `);
  
  // Insert default pattern definitions
  insertDefaultPatternDefinitions();
}

function insertDefaultPatternDefinitions(): void {
  const definitions = [
    {
      id: 'crud_create',
      name: 'CRUD Create',
      description: 'User creates a new entity',
      type: 'crud_create',
      rules: JSON.stringify({
        sequence: [
          { type: 'navigation', to: { pattern: '*/new' } },
          { type: 'form', formAction: 'start' },
          { type: 'form', formAction: 'field_change', minOccurrences: 1 },
          { type: 'form', formAction: 'submit' },
          { type: 'state_change', changeType: 'set' }
        ],
        timeout: 300000, // 5 minutes
      }),
    },
    {
      id: 'crud_read',
      name: 'CRUD Read',
      description: 'User views entity details',
      type: 'crud_read',
      rules: JSON.stringify({
        sequence: [
          { type: 'interaction', interactionType: 'click', metadata: { semanticAction: { pattern: 'crud_read' } } }
        ],
        timeout: 10000,
      }),
    },
    {
      id: 'crud_update',
      name: 'CRUD Update',
      description: 'User updates an existing entity',
      type: 'crud_update',
      rules: JSON.stringify({
        sequence: [
          { type: 'navigation', to: { pattern: '*/edit' } },
          { type: 'form', formAction: 'start' },
          { type: 'form', formAction: 'field_change', minOccurrences: 1 },
          { type: 'form', formAction: 'submit' },
          { type: 'state_change', changeType: 'update' }
        ],
        timeout: 300000,
      }),
    },
    {
      id: 'crud_delete',
      name: 'CRUD Delete',
      description: 'User deletes an entity',
      type: 'crud_delete',
      rules: JSON.stringify({
        sequence: [
          { type: 'interaction', interactionType: 'click', metadata: { semanticAction: { pattern: 'crud_delete' } } },
          { type: 'state_change', changeType: 'delete' }
        ],
        timeout: 30000,
      }),
    },
    {
      id: 'list_view',
      name: 'List View',
      description: 'User views a list of entities',
      type: 'list_view',
      rules: JSON.stringify({
        sequence: [
          { type: 'interaction', interactionType: 'scroll', metadata: { semanticAction: { pattern: 'list_view' } } }
        ],
        timeout: 60000,
      }),
    },
    {
      id: 'filter',
      name: 'Filter',
      description: 'User filters a list',
      type: 'filter',
      rules: JSON.stringify({
        sequence: [
          { type: 'interaction', metadata: { semanticAction: { pattern: 'filter' } } }
        ],
        timeout: 30000,
      }),
    },
    {
      id: 'sort',
      name: 'Sort',
      description: 'User sorts a list',
      type: 'sort',
      rules: JSON.stringify({
        sequence: [
          { type: 'interaction', metadata: { semanticAction: { pattern: 'sort' } } }
        ],
        timeout: 10000,
      }),
    },
    {
      id: 'workflow',
      name: 'Workflow',
      description: 'User completes a multi-step workflow',
      type: 'workflow_step',
      rules: JSON.stringify({
        sequence: [
          { type: 'workflow', action: 'start' },
          { type: 'workflow', action: 'step', minOccurrences: 1 },
          { type: 'workflow', action: 'complete' }
        ],
        timeout: 600000, // 10 minutes
      }),
    },
  ];
  
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO pattern_definitions (id, name, description, type, rules)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  for (const def of definitions) {
    stmt.run(def.id, def.name, def.description, def.type, def.rules);
  }
}

export function closeDatabase(): void {
  if (db) {
    db.close();
  }
}
