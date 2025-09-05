import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { TRPCReactProvider } from "~/trpc/react";

import "~/styles/globals.css";
import type { Metadata, Viewport } from "next";

const geist = Geist({
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Dashed",
	description: "A dashboard for your Homelab.",
	icons: {
		icon: "/favicon.ico",
	},
	robots: {
		index: false,
		follow: false,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "hsl(0 0% 100%)" },
		{ media: "(prefers-color-scheme: dark)", color: "hsl(222.2 84% 4.9%)" },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={geist.className}>
				<TRPCReactProvider>
					<main className="flex min-h-screen flex-col items-center p-2 pb-16">
						{children}
					</main>
				</TRPCReactProvider>
				<Toaster
					toastOptions={{
						className:
							"bg-background/80 backdrop-blur-sm border-border text-foreground",
					}}
				/>
			</body>
		</html>
	);
}
