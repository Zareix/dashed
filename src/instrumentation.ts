import { refreshIndexPage } from "~/utils/api";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		await import("./server/db/migrate");
		refreshIndexPage();
	}
}
