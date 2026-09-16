import Link from "next/link";
import { redirect } from "next/navigation";
import { getIdentity, getProfile } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";
import { signOut } from "@/app/login/actions";

export default async function AccountSetupPage() {
  if (!(await getIdentity())) redirect("/login");
  const profile = await getProfile();
  if (profile) redirect(ROLE_HOME[profile.role]);
  return <main className="state-page">
    <p className="eyebrow">ACCOUNT ACCESS</p>
    <h1>Your workspace isn’t ready yet.</h1>
    <p className="muted">You are signed in, but we couldn’t load your account profile. Contact your administrator or try again shortly.</p>
    <Link className="button button-dark" href="/account/setup">Check again</Link>
    <form action={signOut}><button className="button" type="submit">Sign out</button></form>
  </main>;
}
