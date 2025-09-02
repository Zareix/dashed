/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	output: "standalone",

	images: {
		remotePatterns: [
			{
				hostname: "**",
			},
		],
	},

	transpilePackages: ["geist"],

	typescript: {
		ignoreBuildErrors: !!process.env.SKIP_LINT,
	},
	eslint: {
		ignoreDuringBuilds: !!process.env.SKIP_LINT,
	},
};

export default config;
