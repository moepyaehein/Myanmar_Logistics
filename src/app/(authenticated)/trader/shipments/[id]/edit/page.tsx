import Link from "next/link";
import { RequestForm } from "@/components/shipments/request-form";
import { getRequestGates, getTraderShipment } from "@/lib/shipments/queries";
import { myanmarToday, type RequestFields } from "@/lib/shipments/validation";

export default async function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const shipment = await getTraderShipment(id);
  if (shipment.status !== "requested") return <div className="dashboard-message"><h1>This shipment can’t be edited.</h1><p>Requests can only be edited while awaiting approval.</p><Link href={`/trader/shipments/${id}`} className="text-link">Back to shipment →</Link></div>;
  const gates = await getRequestGates();
  const initial: RequestFields = { origin: shipment.origin, destination: shipment.destination, cargo_type: shipment.cargo_type,
    cargo_description: shipment.cargo_description, quantity: String(shipment.quantity), quantity_unit: shipment.quantity_unit as RequestFields["quantity_unit"],
    pickup_date: shipment.pickup_date, route_gate_id: shipment.route_gate_id, special_notes: shipment.special_notes };
  return <div className="request-page"><Link className="back-link" href={`/trader/shipments/${id}`}>← Shipment details</Link><div className="page-heading"><div><p className="eyebrow">{shipment.shipment_number}</p><h1>Edit transport request<span>.</span></h1><p className="muted">Update the details before the operations team approves your request.</p></div></div><section className="panel"><RequestForm gates={gates} today={myanmarToday()} initial={initial} edit={{ id, updatedAt: shipment.updated_at }} /></section></div>;
}
