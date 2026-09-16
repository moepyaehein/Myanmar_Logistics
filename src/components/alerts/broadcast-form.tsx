"use client";

import {useActionState} from "react";
import {sendBroadcast,type AlertActionState} from "@/app/(authenticated)/alerts/actions";

export function BroadcastForm(){
  const [state,action,pending]=useActionState<AlertActionState,FormData>(sendBroadcast,{});
  return <section className="panel"><div className="panel-heading"><div><h2>Broadcast to all traders</h2><p className="panel-subtitle">Creates a private notification for every Trader account</p></div></div><form action={action} className="shipment-form broadcast-form"><fieldset disabled={pending}><div className="form-field"><label htmlFor="broadcast-title">Title <span>*</span></label><input id="broadcast-title" name="title" required maxLength={160} placeholder="Operations notice" /></div><div className="form-field"><label htmlFor="broadcast-message">Message <span>*</span></label><textarea id="broadcast-message" name="message" required maxLength={2000} rows={5} placeholder="Share a concise operational update." /></div><button className="button button-dark" type="submit">{pending?"Sending…":"Send broadcast"}</button></fieldset><p role="status" aria-live="polite">{state.message}</p></form></section>;
}
