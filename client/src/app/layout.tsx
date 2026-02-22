import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "../components/ClientLayoutWrapper";
import { ThemeProvider } from "../context/ThemeContext";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Leo Royal Hotel",
  description: "Experience luxury and comfort in the heart of the city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <NextTopLoader
          color="#3B82F6"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #3B82F6,0 0 5px #3B82F6"
          zIndex={1600}
        />
        <ThemeProvider>
          <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
