import Link from "next/link";
export default function NotFound() { return <section className="panel dashboard-message"><h1>Assignment not found</h1><p>This shipment is not assigned to you or is unavailable.</p><Link href="/driver/dashboard" className="text-link">Return to assignments</Link></section>; }
