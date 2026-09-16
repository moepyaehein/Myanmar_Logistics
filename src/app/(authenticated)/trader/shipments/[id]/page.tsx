import Link from "next/link";
import { getTraderShipment, formatDate } from "@/lib/shipments/queries";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/status-badge";
import { ShipmentMap } from "@/components/tracking/shipment-map";
import { ShipmentTimeline } from "@/components/tracking/shipment-timeline";
import { ShipmentDocuments } from "@/components/shipments/documents";

export default async function ShipmentDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const shipment = await getTraderShipment(id);
  const { saved } = await searchParams;
  const supabase = await createClient();
  const [driver, updates] = await Promise.all([
    supabase.rpc("shipment_driver_name", { p_shipment_id: id }),
    supabase.from("shipment_updates").select("id,status,note,created_at").eq("shipment_id", id).order("created_at", { ascending: false }).order("id").limit(20),
  ]);
  const gate = shipment.gate_statuses;
  return <>
    <Link className="back-link" href="/trader/shipments">← My shipments</Link>
    <div className="page-heading detail-heading"><div><p className="eyebrow">SHIPMENT DETAILS</p><h1>{shipment.shipment_number}</h1><p className="muted">{shipment.origin} → {shipment.destination}</p></div><div className="detail-actions"><StatusBadge status={shipment.status} />{shipment.status === "requested" && <Link className="button button-dark" href={`/trader/shipments/${id}/edit`}>Edit request</Link>}</div></div>
    {(saved === "created" || saved === "updated") && <div className="success-notice" role="status">{saved === "created" ? "Transport request submitted. The operations team can now review it." : "Your transport request has been updated."}</div>}
    <div className="detail-grid"><section className="panel"><div className="panel-heading"><h2>Journey & cargo</h2></div><dl className="shipment-facts"><Fact label="Origin" value={shipment.origin} /><Fact label="Destination" value={shipment.destination} /><Fact label="Pickup date" value={formatDate(shipment.pickup_date)} /><Fact label="Assigned driver" value={driver.error ? "Temporarily unavailable" : driver.data || "Awaiting assignment"} /><Fact label="Cargo type" value={shipment.cargo_type} /><Fact label="Quantity" value={`${shipment.quantity} ${shipment.quantity_unit}`} /><Fact label="Cargo description" value={shipment.cargo_description} wide /><Fact label="Special notes" value={shipment.special_notes || "No special notes."} wide /></dl></section>
      <section className="panel"><div className="panel-heading"><h2>Route & progress</h2></div><div className="detail-progress"><p className="eyebrow">BORDER GATE</p><h3>{gate?.gate_name ?? "Unavailable"} Gate</h3>{gate && <StatusBadge status={gate.status} />}{gate?.reason && <p className="gate-reason">{gate.reason}</p>}<hr /><p className="eyebrow">CURRENT STATUS</p><StatusBadge status={shipment.status} /><p className="progress-explanation">{shipment.status === "requested" ? "Awaiting approval and driver coordination from the operations team." : shipment.status === "delivered" ? "Your shipment has been delivered." : "Your shipment is progressing through its journey."}</p><p className="detail-time">Last updated {formatDate(shipment.updated_at, true)}<br />Created {formatDate(shipment.created_at, true)}<br />All times shown in Myanmar time.</p></div></section></div>
    <ShipmentTimeline shipment={id} status={shipment.status} /><ShipmentDocuments shipment={id} /><ShipmentMap origin={shipment.origin} destination={shipment.destination} gate={gate?.gate_name ?? ""} latitude={shipment.current_lat} longitude={shipment.current_lng} />
    <section className="panel history-panel"><div className="panel-heading"><h2>Recent shipment updates</h2><span className="neutral-chip">Latest 20</span></div>{updates.error ? <p className="dashboard-message" role="alert">Updates are temporarily unavailable. Refresh to try again.</p> : !updates.data?.length ? <p className="dashboard-message">No updates have been recorded yet.</p> : <ol className="shipment-history">{updates.data.map(update => <li key={update.id}><StatusBadge status={update.status} /><div><p>{update.note || "Shipment status updated."}</p><time dateTime={update.created_at}>{formatDate(update.created_at, true)}</time></div></li>)}</ol>}</section>
  </>;
}

function Fact({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={wide ? "span-two" : ""}><dt>{label}</dt><dd>{value}</dd></div>;
}
