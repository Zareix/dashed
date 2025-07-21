export type NextDNSStatusResponse = {
	data: Array<{
		status: "default" | "blocked" | "allowed";
		queries: number;
	}>;
};
