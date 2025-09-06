import { writeFile } from "node:fs/promises";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { env } from "~/env";

if (!(await Bun.file(env.DATABASE_PATH).exists())) {
	console.log("Database file created");
	await writeFile(env.DATABASE_PATH, "");
}

console.log("Migrating database...");

const db = drizzle(env.DATABASE_PATH);
db.run("PRAGMA journal_mode = WAL;");
db.run("PRAGMA foreign_keys = ON;");

migrate(db, { migrationsFolder: "./drizzle" });

console.log("Database migrated");
