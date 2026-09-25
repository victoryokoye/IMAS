import fs from "node:fs";
import pg from "pg";
import "dotenv/config";

const { Client } = pg;

const client = new Client({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(new URL("./ca.pem", import.meta.url)).toString(),
  },
});

try {
  await client.connect();

  const result = await client.query("SELECT VERSION()");

  console.log("Connected to PostgreSQL:");
  console.log(result.rows[0].version);
} catch (error) {
  console.error("Database connection failed:", error);
} finally {
  await client.end();
}
