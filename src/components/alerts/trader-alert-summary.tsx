import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
import {formatDate} from "@/lib/shipments/queries";

export async function TraderAlertSummary(){
  const supabase=await createClient();const {data,error}=await supabase.from("alerts").select("id,title,message,is_read,created_at").order("created_at",{ascending:false}).limit(3);
  return <section className="panel alert-summary"><div className="panel-heading"><div><h2>Recent alerts</h2><p className="panel-subtitle">Gate disruptions and operations notices</p></div><Link href="/trader/alerts" className="text-link">View all →</Link></div>{error?<p className="dashboard-message" role="alert">Alerts are temporarily unavailable.</p>:!data.length?<p className="dashboard-message">No alerts yet.</p>:<ul className="alert-list">{data.map(alert=><li key={alert.id} className={alert.is_read?"":"alert-unread"}><span className="alert-state" aria-label={alert.is_read?"Read":"Unread"} /><div><strong>{alert.title}</strong><p>{alert.message}</p><time dateTime={alert.created_at}>{formatDate(alert.created_at,true)}</time></div></li>)}</ul>}</section>;
}
