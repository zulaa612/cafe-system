import nextEnv from "@next/env";
import postgres from "postgres";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error("DATABASE_URL missing");
}

const parsed = new URL(url);

console.log("Database host:", parsed.hostname);
console.log("Database user:", parsed.username);
console.log("Database name:", parsed.pathname);

const sql = postgres(url, { prepare: false });

try {
  const info = await sql`
    SELECT current_database() AS database_name,
           current_schema() AS schema_name
  `;

  const columns = await sql`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
    ORDER BY ordinal_position
  `;

  const migrations = await sql`
    SELECT id, created_at
    FROM drizzle.__drizzle_migrations
    ORDER BY created_at
  `;

  console.log("Connection:", info);
  console.log("Orders columns:", columns);
  console.log("Migrations:", migrations);
} finally {
  await sql.end();
}
