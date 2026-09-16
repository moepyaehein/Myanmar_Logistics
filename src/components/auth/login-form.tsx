"use client";

import { useActionState, useState } from "react";
import { login } from "@/app/login/actions";
import type { LoginState } from "@/lib/auth/validation";
import { Icon } from "@/components/ui/icon";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="login-form">
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" autoComplete="username" required maxLength={320}
        value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"
        aria-invalid={!!state.errors?.email} aria-describedby={state.errors?.email ? "email-error" : undefined} />
      {state.errors?.email && <p id="email-error" className="field-error">{state.errors.email[0]}</p>}
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required maxLength={128}
        aria-invalid={!!state.errors?.password} aria-describedby={state.errors?.password ? "password-error" : undefined} />
      {state.errors?.password && <p id="password-error" className="field-error">{state.errors.password[0]}</p>}
      <div aria-live="polite" aria-atomic="true">
        {state.message && <p className="auth-error" role="alert">{state.message}</p>}
      </div>
      <button type="submit" className="button button-dark" disabled={pending}>
        {pending ? "Signing in…" : "Sign in to your workspace"}<Icon name="arrow" />
      </button>
      <fieldset className="demo-choices" disabled={pending}>
        <legend>Demo account shortcuts</legend>
        {(["admin", "trader", "driver"] as const).map((role) => (
          <button key={role} type="button" onClick={() => setEmail(`${role}@demo.com`)}>{role}</button>
        ))}
      </fieldset>
      <p className="login-footnote">Your account determines your role. Demo accounts become available after project setup.</p>
    </form>
  );
}
