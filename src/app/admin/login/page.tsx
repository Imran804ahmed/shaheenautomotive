import { redirect } from "next/navigation";
import { getAdministrator } from "@/lib/server/auth";
import { AuthPanel } from "../auth-panel";

export default async function Login({ searchParams }: { searchParams: Promise<{ reset?: string }> }) {
  if (await getAdministrator()) redirect("/admin/dashboard");
  return <AuthPanel mode="login" reset={(await searchParams).reset === "1"} />;
}
