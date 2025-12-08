import { tryCatch } from "~/lib/try-catch";
import type { WidgetConfig } from "~/lib/widgets";

type KavitaResponse = {
	id: number;
	name: string;
	lastScanned: string;
	type: number;
	coverImage: string;
	folderWatching: boolean;
	includeInDashboard: boolean;
	includeInRecommended: boolean;
	manageCollections: boolean;
	manageReadingLists: boolean;
	includeInSearch: boolean;
	allowScrobbling: boolean;
	folders: string[];
	collapseSeriesRelationships: boolean;
	libraryFileTypes: number[];
	excludePatterns: string[];
	allowMetadataMatching: boolean;
	enableMetadata: boolean;
	removePrefixForSortName: boolean;
	inheritWebLinksFromFirstChapter: boolean;
	defaultLanguage: string;
};

export const getWidgetData = async (config: WidgetConfig<"kavita">) => {
	const jwt = await tryCatch(
		fetch(
			`${config.url}/api/Plugin/authenticate?apiKey=${config.apiKey}&pluginName=jwt`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					apiKey: config.apiKey,
				}),
			},
		).then((res) => {
			if (!res.ok) {
				throw new Error(
					`Failed to authenticate with Kavita: ${res.statusText}`,
				);
			}
			return res.json() as Promise<{ token: string }>;
		}),
	);
	if (jwt.error) {
		throw jwt.error;
	}

	const res = await tryCatch(
		fetch(`${config.url}/api/Library/libraries`, {
			headers: {
				Authorization: `Bearer ${jwt.data.token}`,
				"Content-Type": "application/json",
			},
		}).then((res) => {
			if (!res.ok) {
				throw new Error(`Failed to fetch Kavita data: ${res.statusText}`);
			}
			return res.json() as Promise<KavitaResponse[]>;
		}),
	);
	if (res.error) {
		throw res.error;
	}

	// Return placeholder data structure
	return res.data.map((x) => ({
		id: x.id,
		name: x.name,
		type: x.type,
	}));
};
