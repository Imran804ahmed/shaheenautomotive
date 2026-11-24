import { PublicShell } from "@/components/layout/PublicShell";
import { getHomepageImages } from "@/lib/server/homepage-images";

export { generateMetadata } from "../(public)/layout";
export const dynamic = "force-dynamic";

export default async function HomeLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell images={await getHomepageImages()}>{children}</PublicShell>;
}
