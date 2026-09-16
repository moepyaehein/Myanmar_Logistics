"use client";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main className="state-page">
      <p className="eyebrow">SOMETHING WENT WRONG</p>
      <h1>We couldn’t load this view.</h1>
      <p className="muted">Please try again to reload the workspace.</p>
      <button className="button button-dark" onClick={retry}>Try again</button>
    </main>
  );
}
