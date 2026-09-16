import Link from "next/link";
export default function NotFound() { return <section className="panel dashboard-message"><h1>Shipment not found</h1><p>This shipment is unavailable.</p><Link href="/admin/shipments" className="text-link">Return to shipments</Link></section>; }
