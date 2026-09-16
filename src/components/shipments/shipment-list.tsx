import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/shipments/queries";
import { StatusBadge } from "@/components/ui/status-badge";
import { SHIPMENT_STATUSES, SHIPMENT_STATUS_LABELS, type ShipmentStatus } from "@/types/domain";

export async function ShipmentList({ page = 1, status, compact = false }: { page?: number; status?: ShipmentStatus; compact?: boolean }) {
  const profile = await requireRole("trader");
  const size = compact ? 5 : 20;
  const supabase = await createClient();
  let query = supabase.from("shipments")
    .select("id,shipment_number,origin,destination,cargo_type,quantity,quantity_unit,status,updated_at,gate_statuses(gate_name,status)", { count: "exact" })
    .eq("trader_id", profile.id).order("created_at", { ascending: false }).order("id");
  if (status) query = query.eq("status", status);
  const { data, error, count } = await query.range((page - 1) * size, page * size - 1);
  const link = (target: number) => `/trader/shipments?page=${target}${status ? `&status=${status}` : ""}`;

  return <section className="panel trader-shipments">
    <div className="panel-heading"><div><h2>{compact ? "Recent shipments" : "Your shipments"}</h2><p className="panel-subtitle">{error ? "Records unavailable" : `${count ?? 0} shipment${count === 1 ? "" : "s"}${status ? ` · ${SHIPMENT_STATUS_LABELS[status]}` : ""}`}</p></div>{compact ? <Link className="text-link" href="/trader/shipments">View all →</Link> : <form className="shipment-filter" action="/trader/shipments"><label className="sr-only" htmlFor="status-filter">Filter by status</label><select id="status-filter" name="status" defaultValue={status ?? ""}><option value="">All statuses</option>{SHIPMENT_STATUSES.map(value => <option key={value} value={value}>{SHIPMENT_STATUS_LABELS[value]}</option>)}</select><button type="submit" className="button signout-button">Filter</button></form>}</div>
    {error ? <div className="dashboard-message" role="alert"><h3>We couldn’t load your shipments.</h3><p>Refresh the page to try again.</p></div> : !data?.length ? <div className="dashboard-message"><h3>{status || page > 1 ? "No matching shipments" : "Your first journey starts here"}</h3><p>{status || page > 1 ? "Choose a different status or return to the first page." : "Create a transport request to get your cargo moving."}</p><Link className="text-link" href={status || page > 1 ? "/trader/shipments" : "/trader/shipments/new"}>{status || page > 1 ? "Show all shipments" : "Create a request"} →</Link></div> : <div className="table-scroll" tabIndex={0} role="region" aria-label="Your shipments"><table><thead><tr><th scope="col">SHIPMENT / ROUTE</th><th scope="col">CARGO</th><th scope="col">STATUS</th><th scope="col">BORDER GATE</th><th scope="col">LAST UPDATED</th></tr></thead><tbody>{data.map(shipment => <tr key={shipment.id}><td><Link className="shipment-number text-link" href={`/trader/shipments/${shipment.id}`}>{shipment.shipment_number}</Link><span className="table-subtext">{shipment.origin} → {shipment.destination}</span></td><td>{shipment.cargo_type}<span className="table-subtext">{shipment.quantity} {shipment.quantity_unit}</span></td><td><StatusBadge status={shipment.status} /></td><td>{shipment.gate_statuses?.gate_name ?? "Unavailable"}<span className="table-subtext">{shipment.gate_statuses && <StatusBadge status={shipment.gate_statuses.status} />}</span></td><td>{formatDate(shipment.updated_at, true)}</td></tr>)}</tbody></table></div>}
    {!compact && !error && <div className="table-footer"><span>Page {page} of {Math.max(1, Math.ceil((count ?? 0) / size))}</span><nav aria-label="Shipment pages" className="pagination">{page > 1 && <Link href={link(page - 1)}>← Previous</Link>}{page * size < (count ?? 0) && <Link href={link(page + 1)}>Next →</Link>}</nav></div>}
  </section>;
}
