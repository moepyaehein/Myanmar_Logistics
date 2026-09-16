import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { StatusBadge } from "@/components/ui/status-badge";
import { SHIPMENT_STATUSES, SHIPMENT_STATUS_LABELS, type ShipmentStatus } from "@/types/domain";

export async function AdminShipmentList({ page=1,status,compact=false }: { page?:number;status?:ShipmentStatus;compact?:boolean }) {
  await requireRole("admin");
  const supabase=await createClient(); const size=compact ? 8 : 20;
  let query=supabase.from("shipments").select("id,shipment_number,origin,destination,status,driver_id,gate_statuses(gate_name,status)",{count:"exact"}).order("created_at",{ascending:false}).order("id");
  if(status) query=query.eq("status",status);
  const {data,error,count}=await query.range((page-1)*size,page*size-1);
  const link=(value:number)=>`/admin/shipments?page=${value}${status ? `&status=${status}` : ""}`;
  return <section className="panel"><div className="panel-heading"><div><h2>All shipments</h2><p className="panel-subtitle">{error ? "Records unavailable" : `${count ?? 0} shipments`}</p></div>{compact ? <Link href="/admin/shipments" className="text-link">View all →</Link> : <form action="/admin/shipments" className="shipment-filter"><label className="sr-only" htmlFor="admin-filter">Filter status</label><select name="status" id="admin-filter" defaultValue={status ?? ""}><option value="">All statuses</option>{SHIPMENT_STATUSES.map(value=><option key={value} value={value}>{SHIPMENT_STATUS_LABELS[value]}</option>)}</select><button className="button signout-button">Filter</button></form>}</div>
    {error ? <p className="dashboard-message" role="alert">Could not load shipments. Refresh to retry.</p> : !data?.length ? <div className="dashboard-message"><h3>No matching shipments</h3><Link href="/admin/shipments" className="text-link">Show all shipments</Link></div> : <div className="table-scroll" tabIndex={0} role="region" aria-label="All shipments"><table><thead><tr><th>SHIPMENT / ROUTE</th><th>STATUS</th><th>DRIVER</th><th>GATE</th></tr></thead><tbody>{data.map(row=><tr key={row.id}><td><Link className="shipment-number text-link" href={`/admin/shipments/${row.id}`}>{row.shipment_number}</Link><span className="table-subtext">{row.origin} → {row.destination}</span></td><td><StatusBadge status={row.status} /></td><td>{row.driver_id ? "Assigned" : "Needs assignment"}</td><td>{row.gate_statuses?.gate_name}<span className="table-subtext">{row.gate_statuses && <StatusBadge status={row.gate_statuses.status} />}</span></td></tr>)}</tbody></table></div>}
    {!compact && !error && <div className="table-footer"><span>Page {page} of {Math.max(1,Math.ceil((count ?? 0)/size))}</span><nav className="pagination" aria-label="Shipment pages">{page>1 && <Link href={link(page-1)}>← Previous</Link>}{page*size<(count ?? 0) && <Link href={link(page+1)}>Next →</Link>}</nav></div>}
  </section>;
}
