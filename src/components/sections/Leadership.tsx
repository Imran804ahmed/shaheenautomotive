import Image from "next/image";
import { Quotes, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { LeadershipMember } from "@/content/company";
import { cn } from "@/lib/cn";
import { blurProps } from "@/lib/image-meta";

function PlaceholderBadge() {
  return (
    <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-dashed border-brass/50 bg-black/60 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-brass backdrop-blur-sm">
      Placeholder
    </span>
  );
}

/** Portrait in an inset frame. The studio portraits sit on charcoal, so the frame matches it while loading. */
function Portrait({
  member,
  sizes,
  className,
  iconSize,
}: {
  member: LeadershipMember;
  sizes: string;
  className?: string;
  iconSize: number;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#2b2d2f]", className)}>
      {member.photo ? (
        <Image
          src={member.photo}
          alt={member.photoAlt}
          fill
          sizes={sizes}
          {...blurProps(member.photo)}
          className="object-cover object-[center_18%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] motion-reduce:transition-none"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#e9ebed]">
          <UserCircle size={iconSize} weight="thin" className="text-steel" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent" />
      {member.isPlaceholder && <PlaceholderBadge />}
    </div>
  );
}

/** Green rule along the card's bottom edge that draws in on hover. */
function HoverRule() {
  return (
    <span
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 motion-reduce:transition-none"
    />
  );
}

/** Lead card (two sit side by side): framed portrait over name, title, bio and optional quote. */
function FeaturedCard({ member, delay = 0 }: { member: LeadershipMember; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-white p-2 shadow-soft">
        <Portrait
          member={member}
          sizes="(min-width: 768px) 420px, (min-width: 420px) 384px, 95vw"
          iconSize={48}
          className="aspect-[3/4] rounded-[1.35rem]"
        />

        <div className="flex flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 sm:pb-8">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-[1.75rem]">
                {member.name}
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                {member.title}
              </p>
            </div>
            <span className="mt-1 shrink-0 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-accent-strong">
              Leadership
            </span>
          </div>

          {member.bio && <p className="mt-5 text-[15px] leading-relaxed text-fg-muted">{member.bio}</p>}

          {member.quote && (
            <div className="mt-6 flex gap-2.5 border-l-2 border-accent pl-4">
              <Quotes size={16} weight="fill" className="mt-0.5 shrink-0 text-accent/70" />
              <p className="text-sm italic leading-relaxed text-fg-muted">{member.quote}</p>
            </div>
          )}
        </div>

        <HoverRule />
      </article>
    </Reveal>
  );
}

/** Tile used for the board and the management team: framed portrait with name and title beneath. */
function GridCard({ member }: { member: LeadershipMember }) {
  return (
    <RevealItem className="h-full">
      <article className="card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-border bg-white p-1.5 shadow-soft">
        <Portrait
          member={member}
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 45vw"
          iconSize={30}
          className="aspect-[4/5] rounded-[0.9rem]"
        />
        <div className="px-2 pb-3.5 pt-3.5 sm:px-2.5">
          <h4 className="text-sm font-semibold leading-snug text-balance text-fg sm:text-[15px]">{member.name}</h4>
          <p className="mt-1 flex items-start gap-1.5 text-[10px] font-semibold uppercase leading-snug tracking-[0.14em] text-accent">
            <span aria-hidden="true" className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-accent" />
            {member.title}
          </p>
        </div>
        <HoverRule />
      </article>
    </RevealItem>
  );
}

/** Sub-heading for the board / management grids: label, count and a hairline running to the edge. */
function GroupHeading({ title, count }: { title: string; count: number }) {
  return (
    <Reveal className="mx-auto mt-16 max-w-6xl sm:mt-20">
      <div className="flex items-center gap-4">
        <h3 className="shrink-0 font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          {title}
        </h3>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span className="mono-figure shrink-0 text-xs font-semibold text-accent">
          {String(count).padStart(2, "0")}
        </span>
      </div>
    </Reveal>
  );
}

export function Leadership({
  members,
  management = [],
}: {
  members: LeadershipMember[];
  management?: LeadershipMember[];
}) {
  const featured = members.slice(0, 2);
  const rest = members.slice(2);
  if (featured.length === 0) return null;

  return (
    <section className="bg-bg py-section">
      <Container>
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Leadership"
            title="Our leadership."
            body="Four decades of precision manufacturing, guided by hands-on leadership from the shop floor to the boardroom."
          />
        </div>

        <div className="mx-auto mt-10 grid max-w-sm gap-8 sm:mt-14 md:max-w-[52rem] md:grid-cols-2 md:gap-12 lg:gap-16">
          {featured.map((member, i) => (
            <FeaturedCard key={member.slug} member={member} delay={i * 0.08} />
          ))}
        </div>

        {rest.length > 0 && (
          <>
            <GroupHeading title="Board of Directors" count={rest.length} />
            <RevealGroup className="mx-auto mt-6 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
              {rest.map((member) => (
                <GridCard key={member.slug} member={member} />
              ))}
            </RevealGroup>
          </>
        )}

        {management.length > 0 && (
          <>
            <GroupHeading title="Management Team" count={management.length} />
            <RevealGroup className="mx-auto mt-6 grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
              {management.map((member) => (
                <GridCard key={member.slug} member={member} />
              ))}
            </RevealGroup>
          </>
        )}
      </Container>
    </section>
  );
}
