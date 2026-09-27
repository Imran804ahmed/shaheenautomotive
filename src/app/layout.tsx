import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/content/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display face: Archivo with its width axis, set wide for headlines.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.companyLegalName} | Sheet Metal, Pipe & Rod Component Manufacturer`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description:
    "Shaheen Automotive (Pvt.) Ltd. designs and manufactures sheet metal, formed pipe and bent rod components for automotive and home appliance OEMs in Pakistan, since 1983.",
  keywords: [
    "sheet metal stamping Pakistan",
    "pipe bending manufacturer Pakistan",
    "automotive OEM parts manufacturer",
    "Shaheen Automotive",
    "Shaheen Engineering Works",
    "sheet metal parts manufacturer",
  ],
  icons: {
    icon: "/images/brand/sapl-mark.png",
    apple: "/images/brand/sapl-mark.png",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.siteName,
    title: `${siteConfig.companyLegalName} | Sheet Metal, Pipe & Rod Component Manufacturer`,
    description:
      "Sheet metal, formed pipe and bent rod components for automotive and home appliance OEMs, manufacturing in Pakistan since 1983.",
    images: ["/images/facility/floor/press-shop-hall.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.companyLegalName} | Sheet Metal, Pipe & Rod Component Manufacturer`,
    description:
      "Sheet metal, formed pipe and bent rod components for automotive and home appliance OEMs, manufacturing in Pakistan since 1983.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
