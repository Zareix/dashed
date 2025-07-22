export type GatusStatusesResponse = Array<{
	name: string;
	group: string;
	key: string;
	results: Array<{
		status?: number;
		hostname: string;
		duration: number;
		conditionResults: Array<{
			condition: string;
			success: boolean;
		}>;
		success: boolean;
		timestamp: Date;
	}>;
}>;
