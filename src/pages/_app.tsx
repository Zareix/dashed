import type { AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import { Toaster } from "sonner";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});
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
			<Head>
				<title>Dashed</title>
				<meta name="description" content="Dashed" />
			</Head>
			<Component {...pageProps} />
			<Toaster
				toastOptions={{
					className:
						"bg-background/80 backdrop-blur border-border text-foreground",
				}}
			/>
		</>
	);
};

export default api.withTRPC(MyApp);
