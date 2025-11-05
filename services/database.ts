import { createClient, Client } from '@libsql/client';

let dbClient: Client | null = null;

/**
 * Initialize database connection
 * Uses environment variables: VITE_TURSO_URL and VITE_TURSO_AUTH_TOKEN
 */
export async function initializeDatabase(): Promise<Client> {
  if (dbClient) {
    return dbClient;
  }

  const url = import.meta.env.VITE_TURSO_URL;
  const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error(
      'Missing TURSO database credentials. Please set VITE_TURSO_URL and VITE_TURSO_AUTH_TOKEN in .env.local'
    );
  }

  dbClient = createClient({ url, authToken });

  // Test connection
  try {
    await dbClient.execute('SELECT 1');
    console.log('✓ Database connection established');
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    dbClient = null;
    throw error;
  }

  return dbClient;
}

/**
 * Get the database client
 */
export function getDatabase(): Client {
  if (!dbClient) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return dbClient;
}

/**
 * Create database tables if they don't exist
 */
export async function setupDatabaseTables(): Promise<void> {
  const db = getDatabase();

  try {
    // Create ItemTemplates table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ItemTemplates (
        id TEXT PRIMARY KEY,
        assetCode TEXT NOT NULL,
        name TEXT NOT NULL,
        brand TEXT,
        model TEXT,
        type TEXT,
        color TEXT,
        dimensions TEXT,
        other TEXT,
        origin TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create InventoryItems table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS InventoryItems (
        id TEXT PRIMARY KEY,
        posision INTEGER NOT NULL,
        templateId TEXT NOT NULL,
        location TEXT,
        serial TEXT,
        situation TEXT,
        conservationState TEXT,
        observations TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (templateId) REFERENCES ItemTemplates(id)
      )
    `);

    // Create Locations table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Locations (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✓ Database tables initialized');
  } catch (error) {
    console.error('✗ Error setting up database tables:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbClient) {
    dbClient = null;
    console.log('✓ Database connection closed');
  }
}