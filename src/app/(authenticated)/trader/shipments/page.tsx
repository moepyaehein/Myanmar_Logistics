import Link from "next/link";
import { ShipmentList } from "@/components/shipments/shipment-list";
import { SHIPMENT_STATUSES, type ShipmentStatus } from "@/types/domain";
import { requireRole } from "@/lib/auth/session";

export default async function ShipmentsPage({ searchParams }: { searchParams: Promise<{ page?: string; status?: string }> }) {
  await requireRole("trader");
  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 && parsedPage <= 10000 ? parsedPage : 1;
  const status = SHIPMENT_STATUSES.includes(params.status as ShipmentStatus) ? params.status as ShipmentStatus : undefined;
  return <><div className="page-heading"><div><p className="eyebrow">YOUR CARGO, IN VIEW</p><h1>My shipments<span>.</span></h1><p className="muted">Follow your requests from pickup to destination.</p></div><Link className="button button-dark" href="/trader/shipments/new">New transport request →</Link></div><ShipmentList page={page} status={status} /></>;
}
