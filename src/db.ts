import { Pool, QueryResult } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  return pool.query(text, params);
}

export { pool };
