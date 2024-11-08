import { type AppType } from 'next/app'
import { Inter } from 'next/font/google'

import { api } from '~/utils/api'

import '~/styles/globals.css'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${inter.variable};
        }
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <Toaster />
    </>
  )
}

export default api.withTRPC(MyApp)
