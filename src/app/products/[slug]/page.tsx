import type { Metadata } from "next";
import Image from "next/image";
import { blurProps } from "@/lib/image-meta";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/sections/PageHeader";
import { productCategories, categoryPhotos, productPrograms } from "@/content/company";

type RouteParams = { slug: string };

export function generateStaticParams() {
  return productCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = productCategories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.summary,
    alternates: { canonical: `/products/${category.slug}` },
  };
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const category = productCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const photos = categoryPhotos[category.slug];

  return (
    <>
      <PageHeader
        eyebrow="Products"
        title={category.title}
        intro={category.summary}
        image={category.heroImage}
        flat={Boolean(category.heroImage)}
      >
        <Reveal delay={0.12} className="mt-8 flex flex-wrap gap-2">
          {category.processTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-fg-inverted-muted backdrop-blur"
            >
              {tag}
            </span>
          ))}
        </Reveal>
        <Reveal delay={0.16} className="mt-8">
          <Button href={`/contact?category=${category.slug}`} variant="brass">
            Contact Us About This Category
          </Button>
        </Reveal>
      </PageHeader>

      <section className="bg-bg py-section-sm">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Component examples
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              Photographed components from our OEM production programmes and shop floor, grouped here by product family.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <Reveal key={photo.src} className="overflow-hidden rounded-sm border border-border bg-bg-elevated shadow-soft">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    {...blurProps(photo.src)}
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="rounded-section bg-bg-elevated py-section-sm shadow-soft">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Named parts referenced in our company profile
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">
              These part names are drawn directly from SAPL&apos;s company profile across our OEM programmes. Exact
              part-to-photograph pairing has not been re-confirmed since the profile was produced, so names are
              listed independently of the photographs above.
            </p>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:gap-6 md:grid-cols-3">
            {productPrograms.map((program) => (
              <Reveal key={program.oemSlug}>
                <div className="rounded-sm border border-border bg-bg p-6">
                  <div className="-ml-3 flex h-12 items-center">
                    <Image src={program.logo} alt={program.oemName} width={480} height={200} sizes="115px" className="h-12 w-auto" />
                  </div>
                  <ul className="mt-4 space-y-2">
                    {program.namedParts.map((part) => (
                      <li key={part} className="text-sm text-fg-muted">
                        {part}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
