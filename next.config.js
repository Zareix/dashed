const { OPTIMIZED_IMAGES_DOMAINS } = await import("./src/utils/constants.js");
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
		remotePatterns: OPTIMIZED_IMAGES_DOMAINS.map((domain) => new URL(domain)),
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
