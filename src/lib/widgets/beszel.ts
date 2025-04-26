export type BeszelAuthResponse = {
	token: string;
};

export type BeszelSystemResponse = {
	items: Array<{
		id: string;
		name: string;
		host: string;
		port: number;
		info: {
			b: number;
			c: number;
			cpu: number;
			dp: number;
			dt: number;
			h: string;
			k: string;
			m: string;
			mp: number;
			t: number;
			u: number;
			v: string;
		};
		status: string;
	}>;
};
