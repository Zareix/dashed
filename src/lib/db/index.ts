import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import * as schema from "~/lib/db/schema";

const globalForDb = globalThis as unknown as {
	client: Database | undefined;
};

export const client =
	globalForDb.client ?? new Database(process.env.DATABASE_PATH);
if (process.env.NODE_ENV !== "production") globalForDb.client = client;
client.run("PRAGMA journal_mode = WAL;");
client.run("PRAGMA foreign_keys = ON;");

const db = drizzle(client, { schema });

console.log("Migrating database...");
migrate(db, { migrationsFolder: "./drizzle" });
console.log("Database migrated");

export { db };

export const runTransaction = async <T>(
	database: typeof db,
	callback: () => Promise<T>,
): Promise<T> => {
	database.run("BEGIN");

	try {
		const result = await callback();
		database.run("COMMIT");
		return result;
	} catch (error) {
		database.run("ROLLBACK");
		throw error;
	}
};
