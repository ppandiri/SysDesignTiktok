const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: Neither POSTGRES_URL nor DATABASE_URL found in process.env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  console.log("Starting database migration...");
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT
      );
    `);

    // Create accounts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        provider VARCHAR(255) NOT NULL,
        "providerAccountId" VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        access_token TEXT,
        expires_at BIGINT,
        token_type VARCHAR(255),
        scope TEXT,
        id_token TEXT,
        session_state TEXT,
        PRIMARY KEY (provider, "providerAccountId")
      );
    `);

    // Create sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      );
    `);

    // Create verification_tokens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );
    `);

    // Create user_progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await client.query('COMMIT');
    console.log("Migration completed successfully!");
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
