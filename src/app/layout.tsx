import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Thulasi Textiles | Authentic Indian Handlooms",
  description: "Exquisite artisan-crafted sarees, heritage wear, and home linens.",
};

import { Toaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <NextTopLoader
          color="#2dd4bf"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2dd4bf,0 0 5px #2dd4bf"
        />
        <Toaster richColors position="top-center" closeButton />
        {children}
      </body>
    </html>
  );
}
