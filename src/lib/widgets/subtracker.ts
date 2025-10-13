export type SubtrackerStatsResponse = {
	stats: {
		totalPerMonth: number;
		totalPerYear: number;
		remainingThisMonth: number;
		expectedNextMonth: number;
		totalThisMonth: number;
	};
	currency: {
		code: string;
		symbol: string;
	};
};
