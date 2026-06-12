import { redirect } from "next/navigation";

// The site root always shows the marketing landing page first. The actual app
// (the "Today" dashboard) lives at /today.
export default function RootPage() {
  redirect("/welcome");
}
