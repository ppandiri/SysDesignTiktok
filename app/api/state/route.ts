import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool } from "pg";

export const dynamic = "force-dynamic";

const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

let pool: Pool | null = null;
if (connectionString && !connectionString.includes("[SENSITIVE]")) {
  try {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  } catch (e) {
    console.warn("Failed to initialize Pool in /api/state:", e);
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!pool) {
      return NextResponse.json({ state: null });
    }

    const userId = session.user.id;
    const client = await pool.connect();
    try {
      const res = await client.query(
        "SELECT state, updated_at FROM user_progress WHERE user_id = $1",
        [userId]
      );
      if (res.rows.length === 0) {
        return NextResponse.json({ state: null });
      }
      return NextResponse.json({
        state: res.rows[0].state,
        updated_at: res.rows[0].updated_at,
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("GET /api/state error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!pool) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const state = body.state || body;

    if (!state) {
      return NextResponse.json({ error: "Missing state in body" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO user_progress (user_id, state, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (user_id) DO UPDATE
         SET state = EXCLUDED.state, updated_at = NOW()`,
        [userId, JSON.stringify(state)]
      );
      return NextResponse.json({ success: true });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("PUT /api/state error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
