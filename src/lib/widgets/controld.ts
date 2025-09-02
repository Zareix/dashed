export type ControlDStatusResponse = {
	success: boolean;
	body: {
		endTs: number;
		startTs: number;
		granularity: string;
		tz: string;
		queries: Array<{
			ts: string;
			count: Count;
		}>;
	};
};

export type Count = {
	"0": number; // Blocked
	"1": number; // Allowed
	"3": number; // Redirected
	"-1"?: number;
};
