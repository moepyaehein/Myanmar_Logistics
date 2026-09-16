import Link from "next/link";

export default function ShipmentNotFound() {
  return <div className="dashboard-message"><h1>Shipment not found.</h1><p>This shipment is unavailable in your workspace.</p><Link href="/trader/shipments" className="text-link">Back to my shipments →</Link></div>;
}
