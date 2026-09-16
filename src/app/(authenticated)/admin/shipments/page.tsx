import { requireRole } from "@/lib/auth/session";
import { AdminShipmentList } from "@/components/admin/shipment-list";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/types/domain";

export default async function Page({searchParams}:{searchParams:Promise<{status?:string;page?:string}>}) {
  await requireRole("admin"); const params=await searchParams; const number=Number(params.page);
  const page=Number.isSafeInteger(number)&&number>0&&number<=10000 ? number : 1;
  const status=SHIPMENT_STATUSES.includes(params.status as ShipmentStatus) ? params.status as ShipmentStatus : undefined;
  return <><div className="page-heading"><div><p className="eyebrow">OPERATIONS</p><h1>Shipments<span>.</span></h1><p className="muted">Review requests, coordinate drivers and manage progress.</p></div></div><AdminShipmentList page={page} status={status} /></>;
}
