import Link from "next/link";
import {requireRole} from "@/lib/auth/session";
import {createClient} from "@/lib/supabase/server";
import {formatDate} from "@/lib/shipments/queries";
import {setAlertRead} from "@/app/(authenticated)/alerts/actions";

export default async function Page({searchParams}:{searchParams:Promise<{error?:string}>}){
  const profile=await requireRole("trader"),{error:actionError}=await searchParams,supabase=await createClient();
  const {data,error}=await supabase.from("alerts").select("*").eq("trader_id",profile.id).order("created_at",{ascending:false}).limit(100);
  if(error)throw new Error("Could not load alerts. Refresh to retry.");
  const unread=data.filter(alert=>!alert.is_read).length;
  return <><div className="page-heading"><div><p className="eyebrow">NOTIFICATIONS</p><h1>Your alerts<span>.</span></h1><p className="muted">Gate disruptions and messages from the operations team.</p></div><span className="neutral-chip">{unread} unread</span></div>{actionError&&<p className="auth-error" role="alert">{actionError==="missing"?"That alert is no longer available.":actionError==="invalid"?"The alert reference was invalid.":"Could not update the alert. Try again."}</p>}{!data.length?<section className="panel dashboard-message"><h2>No alerts yet</h2><p>Route disruptions and operations broadcasts will appear here automatically.</p></section>:<ol className="alerts-page-list">{data.map(alert=><li className={`panel alert-card ${alert.is_read?"":"alert-unread"}`} key={alert.id}><div className="alert-card-head"><div><span className="alert-kind">{alert.gate_id?"Route disruption":alert.shipment_id?"Shipment update":"Operations broadcast"}</span><h2>{alert.title}</h2></div><span className="neutral-chip">{alert.is_read?"Read":"New"}</span></div><p>{alert.message}</p><div className="alert-card-footer"><time dateTime={alert.created_at}>{formatDate(alert.created_at,true)}</time><div>{alert.shipment_id&&<Link className="text-link" href={`/trader/shipments/${alert.shipment_id}`}>View shipment</Link>}<form action={setAlertRead} className="alert-read-form"><input type="hidden" name="id" value={alert.id}/><input type="hidden" name="read" value={String(!alert.is_read)}/><button className="button signout-button" type="submit">Mark {alert.is_read?"unread":"read"}</button></form></div></div></li>)}</ol>}</>;
}
