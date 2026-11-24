import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getContent } from "@/lib/server/content";
import type { HomeImages } from "@/lib/server/homepage-images";

export async function PublicShell({ children, images }: { children: React.ReactNode; images?: HomeImages }) {
  const { settings, brand, productCategories } = await getContent();
  const products = productCategories.filter((item) => item.visible);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.companyLegalName,
    url: settings.baseUrl,
    logo: new URL(brand.logoFull, settings.baseUrl).href,
    email: settings.contact.email,
    telephone: settings.contact.phoneHref.slice(4),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg">Skip to content</a>
      <Header siteConfig={settings} products={products} logo={images?.["header-logo"]?.src || brand.logoFull} logoLabel={images?.["header-logo"]?.alt} />
      <main id="main-content" className="flex-1 overflow-x-clip">{children}</main>
      <Footer images={images} />
    </>
  );
}
