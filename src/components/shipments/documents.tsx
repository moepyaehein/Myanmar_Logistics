import { requireProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/shipments/queries";

export async function ShipmentDocuments({shipment}:{shipment:string}) {
  await requireProfile();const supabase=await createClient();
  const {data,error}=await supabase.from("documents").select("id,original_name,document_type,size_bytes,created_at").eq("shipment_id",shipment).order("created_at",{ascending:false}).limit(50);
  return <section className="panel"><div className="panel-heading"><h2>Shipment evidence</h2><span className="neutral-chip">Private · Latest 50</span></div>{error ? <p className="dashboard-message" role="alert">Could not load evidence. Refresh to retry.</p> : !data.length ? <p className="dashboard-message">No evidence uploaded yet.</p> : <ul className="document-list">{data.map(file=><li key={file.id}><div><a className="text-link" href={`/documents/${file.id}/download`}>{file.original_name}</a><small>{file.document_type.replaceAll("_"," ")} · {(file.size_bytes/1024).toFixed(1)} KiB · {formatDate(file.created_at,true)}</small></div><span>Download ↓</span></li>)}</ul>}</section>;
}
