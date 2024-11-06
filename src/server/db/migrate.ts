import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { env } from "~/env";
import { writeFile } from "node:fs/promises";

if (!(await Bun.file(env.DATABASE_PATH).exists())) {
  console.log("Database file created");
  await writeFile(env.DATABASE_PATH, "");
}

console.log("Migrating database...");

const sqlite = new Database(env.DATABASE_PATH);
const db = drizzle(sqlite);
migrate(db, { migrationsFolder: "./drizzle" });

console.log("Database migrated");
