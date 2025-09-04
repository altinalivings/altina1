import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function PrivanaRedirect() {
  redirect("/projects/privana");
  return null;
}
