import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import PostgresAdapter from "@auth/pg-adapter";
import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let adapter = undefined;
if (connectionString && !connectionString.includes("[SENSITIVE]")) {
  try {
    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });

    // Auto-create required Auth.js tables in background
    pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        "emailVerified" TIMESTAMPTZ,
        image TEXT
      );
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
        CONSTRAINT accounts_provider_providerAccountId_unique UNIQUE(provider, "providerAccountId")
      );
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
        "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires TIMESTAMPTZ NOT NULL
      );
      CREATE TABLE IF NOT EXISTS verification_tokens (
        identifier VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires TIMESTAMPTZ NOT NULL,
        PRIMARY KEY (identifier, token)
      );
      CREATE TABLE IF NOT EXISTS user_progress (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        state JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `).catch(err => console.warn("Table auto-creation notice:", err.message));

    adapter = PostgresAdapter(pool);
  } catch (e) {
    console.warn("Failed to initialize PostgresAdapter:", e);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.AUTH_SECRET || "fallback_auth_secret_key_minimum_32_characters_long",
  trustHost: true,
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
