import Link from "next/link";
import { RequestForm } from "@/components/shipments/request-form";
import { getRequestGates } from "@/lib/shipments/queries";
import { myanmarToday } from "@/lib/shipments/validation";

export default async function NewShipmentPage() {
  const gates = await getRequestGates();
  return <div className="request-page"><Link className="back-link" href="/trader/shipments">← My shipments</Link><div className="page-heading"><div><p className="eyebrow">LET’S PLAN YOUR NEXT JOURNEY</p><h1>New transport request<span>.</span></h1><p className="muted">Tell us what you’re moving and where it needs to go.</p></div></div><section className="panel"><RequestForm gates={gates} today={myanmarToday()} /></section></div>;
}
