import { AUTHORIZED_DOMAINS } from '~/utils/constants.js'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.js')

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',

  images: {
    remotePatterns: AUTHORIZED_DOMAINS.map((x) => ({
      protocol: 'https',
      hostname: x,
    })),
  },
  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },

  experimental: {
    instrumentationHook: true,
  },
}

export default config
