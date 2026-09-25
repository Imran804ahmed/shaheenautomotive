import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
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
      <PageHeader eyebrow="Products" title={category.title} intro={category.summary}>
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
            Request a quote for this category
          </Button>
        </Reveal>
      </PageHeader>

      <section className="bg-bg py-16 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Component examples
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              Photographed components from our Toyota Indus Motor, Pak Suzuki and Yamaha production programmes, grouped here by manufacturing process.
            </p>
          </Reveal>
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
            {photos.map((photo) => (
              <Reveal key={photo.src} className="break-inside-avoid overflow-hidden rounded-sm border border-border bg-bg-elevated shadow-soft">
                <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="rounded-[2.5rem] bg-bg-elevated py-16 shadow-soft sm:rounded-[3.5rem] sm:py-24">
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
                  <div className="flex h-8 items-center">
                    <Image src={program.logo} alt={program.oemName} width={96} height={32} className="h-6 w-auto object-contain" />
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

      <CtaBanner
        heading={`Have a ${category.shortTitle.toLowerCase()} part to quote?`}
        body="Send the drawing or specification and target volume. We'll confirm feasibility against our current tooling and press capacity."
      />
    </>
  );
}
