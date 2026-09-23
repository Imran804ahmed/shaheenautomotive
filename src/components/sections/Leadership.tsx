import Image from "next/image";
import { Quotes, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tilt } from "@/components/ui/Tilt";
import { Gear } from "@/components/ui/Gear";
import type { LeadershipMember } from "@/content/company";
import { cn } from "@/lib/cn";

function PlaceholderBadge() {
  return (
    <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-dashed border-brass/50 bg-bg-inverted/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-brass backdrop-blur-sm">
      Placeholder
    </span>
  );
}

/** The lead card: editorial split layout, large portrait, full bio, optional quote, brass "featured" ring and 3D tilt. */
function FeaturedCard({ member }: { member: LeadershipMember }) {
  return (
    <Reveal from="scale">
      <div className="group relative mx-auto max-w-4xl">
        {/* soft brass halo behind the card, blooms in on hover — same device as the CTA banner glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_30%_20%,rgb(227_166_58/0.22),transparent_70%)] opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100"
        />

        <Tilt max={4}>
          <div className="card-lift relative flex flex-col overflow-hidden rounded-[2rem] border border-brass/30 bg-white/[0.05] shadow-deep ring-1 ring-brass/20 sm:min-h-[26rem] sm:flex-row">
            <Gear className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 opacity-[0.08] sm:h-80 sm:w-80" />

            <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden sm:aspect-auto sm:w-[42%]">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.photoAlt}
                  fill
                  sizes="(min-width: 640px) 40vw, 90vw"
                  className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(60%_60%_at_50%_20%,rgb(227_166_58/0.14),transparent_70%)] px-6 text-center">
                  <UserCircle size={44} weight="thin" className="text-fg-inverted-muted" />
                  <p className="text-xs leading-relaxed text-fg-inverted-muted">
                    Photo placeholder — add the {member.title.toLowerCase()}&rsquo;s portrait
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-inverted/60 via-transparent to-transparent sm:hidden" />
              <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-transparent via-transparent to-bg-inverted/50 sm:block" />
              {member.isPlaceholder && <PlaceholderBadge />}
              <span className="spot-glow" aria-hidden="true" />
            </div>

            <div className="relative flex flex-1 flex-col justify-center p-7 sm:p-10 lg:p-12">
              <Quotes
                weight="fill"
                className="pointer-events-none absolute -top-2 right-6 h-28 w-28 text-brass/[0.07] sm:h-36 sm:w-36"
                aria-hidden="true"
              />
              <p className="relative inline-flex w-fit items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                <span className="h-px w-8 bg-brass" />
                Leadership
              </p>
              <h3 className="relative mt-4 text-3xl font-semibold tracking-tight text-fg-inverted sm:text-4xl">
                {member.name}
              </h3>
              <p className="relative mt-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brass">
                {member.title}
              </p>
              <p className="relative mt-5 max-w-md text-base leading-relaxed text-fg-inverted-muted">
                {member.bio}
              </p>

              {member.quote && (
                <div className="relative mt-6 flex gap-2.5 border-l-2 border-brass/40 pl-4">
                  <Quotes size={16} weight="fill" className="mt-0.5 shrink-0 text-brass/70" />
                  <p className="max-w-md text-sm italic leading-relaxed text-fg-inverted-muted">{member.quote}</p>
                </div>
              )}
            </div>
          </div>
        </Tilt>
      </div>
    </Reveal>
  );
}

/** Normal-weight tile used for every director after the featured one: photo with name/title caption overlaid on a scrim. */
function GridCard({ member }: { member: LeadershipMember }) {
  return (
    <RevealItem>
      <div className="group h-full">
        <div className="card-lift relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border-inverted bg-white/[0.03]">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.photoAlt}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(60%_60%_at_50%_20%,rgb(227_166_58/0.12),transparent_70%)] px-3 text-center">
              <UserCircle size={30} weight="thin" className="text-fg-inverted-muted" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-bg-inverted via-bg-inverted/55 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

          {member.isPlaceholder && <PlaceholderBadge />}

          <div className="absolute inset-x-0 bottom-0 p-3.5 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5 sm:p-4">
            <h4 className="truncate text-sm font-semibold text-fg-inverted">{member.name}</h4>
            <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-brass">
              {member.title}
            </p>
          </div>

          <span className="spot-glow" aria-hidden="true" />
        </div>
      </div>
    </RevealItem>
  );
}

export function Leadership({ members }: { members: LeadershipMember[] }) {
  const [featured, ...rest] = members;
  if (!featured) return null;

  return (
    <section className="surface-ink rounded-[2.5rem] py-20 shadow-deep sm:rounded-[3.5rem] sm:py-28">
      <Container>
        <SectionHeading
          onDark
          eyebrow="Leadership"
          title="Our leadership."
          body="Four decades of precision manufacturing, guided by hands-on leadership from the shop floor to the boardroom."
        />

        <div className="mt-14">
          <FeaturedCard member={featured} />
        </div>

        {rest.length > 0 && (
          <>
            <Reveal className="mt-16 sm:mt-20">
              <p className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-fg-inverted-muted">
                <span className="h-px w-8 bg-border-inverted" />
                Board of directors
              </p>
            </Reveal>

            <RevealGroup
              className={cn(
                "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5"
              )}
            >
              {rest.map((member) => (
                <GridCard key={member.slug} member={member} />
              ))}
            </RevealGroup>
          </>
        )}
      </Container>
    </section>
  );
}
