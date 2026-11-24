import { redirect } from "next/navigation";
import { requireAdministrator } from "@/lib/server/auth";

export default async function Admin() {
  await requireAdministrator();
  redirect("/admin/dashboard");
}
