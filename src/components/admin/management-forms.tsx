"use client";

import { useActionState } from "react";
import { useDraftSnapshot } from "@/lib/tracking/use-draft-snapshot";
import { manageShipment, changeGate, type AdminFormState } from "@/app/(authenticated)/admin/actions";
import { SHIPMENT_STATUSES, SHIPMENT_STATUS_LABELS, type ShipmentStatus, type GateStatus } from "@/types/domain";

export function ShipmentManagement(props: {
  id:string; updatedAt:string; status:ShipmentStatus; driverId:string|null; drivers:{id:string;full_name:string}[]; assignmentLocked:boolean;
}) {
  const {value:{id,updatedAt,status,driverId,drivers,assignmentLocked},capture}=useDraftSnapshot(props);
  const [state,action,pending] = useActionState<AdminFormState,FormData>(manageShipment,{});
  return <section className="panel"><div className="panel-heading"><h2>Manage shipment</h2></div><form key={updatedAt} action={action} className="shipment-form admin-management-form" onInputCapture={capture} onChangeCapture={capture} onClickCapture={capture} onSubmitCapture={capture}>
    <input type="hidden" name="record_id" value={id} /><input type="hidden" name="revision" value={updatedAt} />
    <fieldset disabled={pending}><legend>Driver assignment</legend>{assignmentLocked ? <p>Driver assignment is locked after pickup.</p> : <><div className="form-field"><label htmlFor="driver">Assigned driver</label><select id="driver" name="driver" defaultValue={driverId ?? ""}><option value="">Choose a driver</option>{drivers.map(driver=><option key={driver.id} value={driver.id}>{driver.full_name}</option>)}</select></div><button className="button signout-button" name="operation" value="assign" disabled={!drivers.length}>Save assignment</button></>}</fieldset>
    {status === "requested" ? <fieldset disabled={pending}><legend>Request approval</legend><p>Assign a driver before approving transport.</p><button className="button button-dark" name="operation" value="approve" disabled={!driverId}>Approve shipment</button></fieldset> : <fieldset disabled={pending}><legend>Status correction</legend><div className="form-grid"><div className="form-field"><label htmlFor="admin-status">Correct status</label><select id="admin-status" name="status" defaultValue={status}>{SHIPMENT_STATUSES.filter(value=>value!=="requested").map(value=><option key={value} value={value}>{SHIPMENT_STATUS_LABELS[value]}</option>)}</select></div><div className="form-field"><label htmlFor="correction-note">Reason for correction</label><textarea id="correction-note" name="note" maxLength={1800} rows={3} /></div></div><button name="operation" value="status" className="button button-dark">Update status</button></fieldset>}
    <div role="status" aria-live="polite">{pending ? "Saving…" : state.message}</div>{state.message && <a href={`/admin/shipments/${id}`} className="text-link">Reload latest shipment</a>}
  </form></section>;
}

export function GateForm(props: { id:string; updatedAt:string; status:GateStatus; reason:string }) {
  const {value:{id,updatedAt,status,reason},capture}=useDraftSnapshot(props);
  const [state,action,pending] = useActionState<AdminFormState,FormData>(changeGate,{});
  return <form key={updatedAt} action={action} className="shipment-form gate-management-form" onInputCapture={capture} onChangeCapture={capture} onClickCapture={capture} onSubmitCapture={capture}><input type="hidden" name="record_id" value={id} /><input type="hidden" name="revision" value={updatedAt} /><fieldset disabled={pending}><legend>Update gate condition</legend><div className="form-field"><label htmlFor={`${id}-status`}>Status</label><select id={`${id}-status`} name="status" defaultValue={status}><option value="open">Open</option><option value="delayed">Delayed</option><option value="closed">Closed</option></select></div><div className="form-field"><label htmlFor={`${id}-reason`}>Reason / note</label><textarea id={`${id}-reason`} name="reason" defaultValue={reason} maxLength={1000} rows={3} /><small>Required for Delayed or Closed.</small></div><button className="button button-dark" type="submit">{pending ? "Saving…" : "Save gate status"}</button></fieldset><p role="status">{state.message}</p>{state.message && <a href="/admin/gates" className="text-link">Reload latest gates</a>}</form>;
}
