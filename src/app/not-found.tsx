import Link from "next/link";

export default function NotFound() {
  return <main className="state-page"><p className="eyebrow">404 · PAGE NOT FOUND</p><h1>This route isn’t here yet.</h1><p className="muted">The Phase 1 overview is ready to explore.</p><Link href="/" className="button button-dark">Back to overview</Link></main>;
}
