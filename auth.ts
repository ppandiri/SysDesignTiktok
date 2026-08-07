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
