import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/PublicShell";
import { getContent } from "@/lib/server/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings: siteConfig, brand } = await getContent();
  return {
    metadataBase: new URL(siteConfig.baseUrl),
    title: {
      default: `${siteConfig.companyLegalName} | Jack, Sheet Metal, Rod & Pipe Component Manufacturer`,
      template: `%s | ${siteConfig.siteName}`,
    },
    description:
      "Shaheen Automotive (Pvt.) Ltd. designs and manufactures jack assemblies, sheet metal, bent rod and formed pipe components for automotive and home appliance OEMs in Pakistan, since 1983.",
    keywords: [
      "sheet metal stamping Pakistan",
      "pipe bending manufacturer Pakistan",
      "automotive OEM parts manufacturer",
      "Shaheen Automotive",
      "Shaheen Engineering Works",
      "sheet metal parts manufacturer",
    ],
    icons: {
      icon: brand.mark,
      apple: brand.mark,
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.siteName,
      title: `${siteConfig.companyLegalName} | Jack, Sheet Metal, Rod & Pipe Component Manufacturer`,
      description:
        "Shaheen Automotive (Pvt.) Ltd. designs and manufactures jack assemblies, sheet metal, bent rod and formed pipe components for the automotive and home appliance industries.",
      images: ["/images/facility/hydraulic-press-operator.jpeg"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.companyLegalName} | Jack, Sheet Metal, Rod & Pipe Component Manufacturer`,
      description:
        "Shaheen Automotive (Pvt.) Ltd. designs and manufactures jack assemblies, sheet metal, bent rod and formed pipe components for the automotive and home appliance industries.",
    },
  };
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
