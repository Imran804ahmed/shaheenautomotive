import { AuthPanel } from "../auth-panel";

export default async function Reset({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return <AuthPanel mode="reset" token={typeof token === "string" ? token : ""} />;
}
