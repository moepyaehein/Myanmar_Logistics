import {requireRole} from "@/lib/auth/session";
import {createClient} from "@/lib/supabase/server";
import {formatDate} from "@/lib/shipments/queries";
import {BroadcastForm} from "@/components/alerts/broadcast-form";

export default async function Page({searchParams}:{searchParams:Promise<{sent?:string}>}){
  await requireRole("admin");const {sent}=await searchParams,supabase=await createClient();
  const [alerts,traders]=await Promise.all([supabase.from("alerts").select("*").order("created_at",{ascending:false}).limit(50),supabase.from("profiles").select("id,full_name,email").eq("role","trader")]);
  if(alerts.error||traders.error)throw new Error("Could not load alert management. Refresh to retry.");
  const names=new Map(traders.data.map(row=>[row.id,row]));
  return <><div className="page-heading"><div><p className="eyebrow">COMMUNICATIONS</p><h1>Alerts<span>.</span></h1><p className="muted">Notify Traders about network-wide operations. Gate disruption alerts are automatic.</p></div><span className="neutral-chip">{traders.data.length} traders</span></div>{sent&&<p className="success-notice" role="status">Broadcast sent to {sent} trader{sent==="1"?"":"s"}.</p>}<div className="alerts-admin-grid"><BroadcastForm/><section className="panel"><div className="panel-heading"><div><h2>Recent alert deliveries</h2><p className="panel-subtitle">Latest 50 recipient records</p></div></div>{!alerts.data.length?<p className="dashboard-message">No alerts have been delivered yet.</p>:<ul className="alert-list admin-alert-list">{alerts.data.map(alert=>{const trader=names.get(alert.trader_id);return <li key={alert.id}><span className="alert-state"/><div><strong>{alert.title}</strong><p>{alert.message}</p><small>{trader?.full_name??"Trader"} · {trader?.email??alert.trader_id}</small><time dateTime={alert.created_at}>{formatDate(alert.created_at,true)}</time></div></li>})}</ul>}</section></div></>;
}
