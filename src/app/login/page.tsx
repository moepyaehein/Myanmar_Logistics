import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { LoginForm } from "@/components/auth/login-form";
import { getProfile } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/roles";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  const profile = await getProfile();
  if (profile) redirect(ROLE_HOME[profile.role]);
  return (
    <main className="access-page">
      <Link href="/" className="back-link">← Back to overview</Link>
      <div className="access-card">
        <span className="brand-mark"><Icon name="layers" /></span>
        <p className="eyebrow">YOUR JOURNEY, CONNECTED</p>
        <h1>Welcome back.</h1>
        <p className="muted">Sign in to follow your cargo, coordinate your team, or share progress from the road.</p>
        <LoginForm />
      </div>
    </main>
  );
}
