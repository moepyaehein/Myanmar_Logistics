import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Icon } from "@/components/ui/icon";
import { StatusBadge } from "@/components/ui/status-badge";
import { previewGates, previewShipments } from "@/lib/demo-data";

export default function OverviewPage() {
  const active = previewShipments.filter((shipment) => !["requested", "delivered"].includes(shipment.status)).length;
  const requested = previewShipments.filter((shipment) => shipment.status === "requested").length;

  return (
    <AppShell>
      <section id="overview" className="page-heading">
        <div>
          <p className="eyebrow">YOUR OPERATIONS, AT A GLANCE</p>
          <h1>Logistics overview<span>.</span></h1>
          <p className="muted">A clearer view of your cargo, from origin to border.</p>
        </div>
        <Link className="button button-dark" href="/login">Sign in<Icon name="arrow" /></Link>
      </section>
      <div className="preview-notice">
        <span className="notice-icon"><Icon name="layers" /></span>
        <p><strong>The foundation is ready.</strong> This overview uses sample data. Sign in to view your workspace; shipment actions and live tracking are coming next.</p>
        <a href="#roadmap">View roadmap <span aria-hidden="true">↗</span></a>
      </div>
      <section className="stats-grid" aria-label="Sample shipment statistics">
        <Stat label="Total shipments" value={String(previewShipments.length).padStart(2, "0")} detail="Across 2 border routes" icon="box" />
        <Stat label="Active shipments" value={String(active).padStart(2, "0")} detail="In transit & at customs" icon="truck" />
        <Stat label="Awaiting approval" value={String(requested).padStart(2, "0")} detail="Ready for admin review" icon="layers" />
        <Stat label="Open border gates" value={`${previewGates.filter((gate) => gate.status === "open").length} / ${previewGates.length}`} detail="Illustrative gate conditions" icon="route" />
      </section>
      <div className="overview-grid">
        <section className="panel route-panel" aria-labelledby="route-title">
          <div className="panel-heading"><div><p className="eyebrow">CONNECTED JOURNEYS</p><h2 id="route-title">Trade routes</h2></div><span className="neutral-chip">Myanmar</span></div>
          <div className="route-illustration">
            <div className="route-guide">ORIGIN <span>BORDER DESTINATION</span></div>
            {previewShipments.map((shipment) => (
              <div className="route-lane" key={shipment.id}>
                <div className="route-city"><span className="city-dot" /><strong>{shipment.origin}</strong><small>Origin hub</small></div>
                <div className={`route-line ${shipment.status === "requested" ? "secondary-line" : ""}`}>
                  {shipment.status === "in_transit" && <span className="truck-marker"><Icon name="truck" /></span>}
                  {shipment.status === "customs" && <span className="checkpoint-marker"><Icon name="box" /></span>}
                </div>
                <div className="route-city end-city"><span className="city-dot destination-dot" /><strong>{shipment.destination}</strong><small>{shipment.gateId === "muse" ? "China border" : "Thailand border"}</small></div>
              </div>
            ))}
          </div>
          <div className="route-caption"><span><span className="legend-dot" />3 sample journeys · 2 corridors</span><span>Route schematic · Map in Phase 6</span></div>
        </section>
        <section id="gates" className="panel gate-panel" aria-labelledby="gates-title">
          <div className="panel-heading"><div><p className="eyebrow">BORDER CONNECTIONS</p><h2 id="gates-title">Gate overview</h2></div><Icon name="route" /></div>
          {previewGates.map((gate) => (
            <div className="gate-row" key={gate.id}>
              <div className="gate-icon"><Icon name="route" /></div>
              <div><h3>{gate.name} Gate</h3><p>{gate.connection}</p></div>
              <StatusBadge status={gate.status} />
            </div>
          ))}
          <div className="gate-note"><Icon name="bell" /><p>Gate changes will automatically notify traders with affected shipments.<span>Management in Phase 4 · Alerts in Phase 7</span></p></div>
          <p className="sample-footnote">Sample conditions, not live border information.</p>
        </section>
      </div>
      <section id="shipments" className="panel shipments-panel" aria-labelledby="shipments-title">
        <div className="panel-heading"><div><h2 id="shipments-title">Shipment overview</h2><p className="panel-subtitle">Three journeys to bring the demo to life.</p></div><span className="neutral-chip">3 sample shipments</span></div>
        <div className="table-scroll" tabIndex={0} role="region" aria-label="Sample shipments table, scroll horizontally on small screens">
          <table>
            <caption className="sr-only">Static example shipments. No live records or shipment actions are available in Phase 1.</caption>
            <thead><tr><th scope="col">SHIPMENT</th><th scope="col">ROUTE</th><th scope="col">CARGO</th><th scope="col">DRIVER</th><th scope="col">STATUS</th><th scope="col">GATE</th></tr></thead>
            <tbody>
              {previewShipments.map((shipment) => {
                const gate = previewGates.find((item) => item.id === shipment.gateId);
                return (
                  <tr key={shipment.id}>
                    <td><span className="shipment-number">{shipment.shipmentNumber}</span><span className="table-subtext">Demo shipment</span></td>
                    <td><span className="route-cell">{shipment.origin}<span aria-hidden="true">→</span>{shipment.destination}</span></td>
                    <td>{shipment.cargo}<span className="table-subtext">{shipment.quantity}</span></td>
                    <td>{shipment.driver ? <span className="driver-cell"><span className="driver-avatar">AM</span>{shipment.driver}</span> : <span className="muted">Unassigned</span>}</td>
                    <td><StatusBadge status={shipment.status} /></td>
                    <td>{gate ? <StatusBadge status={gate.status} /> : "Unavailable"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span>Showing all 3 sample shipments</span><span>Sign in to view your authorized database records</span></div>
      </section>
      <div className="bottom-grid">
        <section id="alerts" className="panel alerts-panel">
          <div className="panel-heading"><h2>Notifications</h2><span className="neutral-chip">Preview</span></div>
          <div className="empty-state"><span className="empty-icon"><Icon name="bell" /></span><div><h3>Your alerts will appear here</h3><p>Shipment updates and route notices, in one place.<br />Live notifications are planned for Phase 7.</p></div></div>
        </section>
        <section id="roadmap" className="panel roadmap-panel">
          <div className="panel-heading"><h2>A foundation for what’s next</h2><span className="phase-label">02 / 10</span></div>
          <div className="roadmap-items">
            <div><span className="step-circle completed"><Icon name="check" /></span><span>Application foundation<small>Current phase</small></span></div>
            <div><span className="step-circle">02</span><span>Authentication & access<small>Current phase</small></span></div>
            <div><span className="step-circle">03</span><span>Trader shipment workflow<small>Next phase</small></span></div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Stat({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: "box" | "truck" | "layers" | "route" }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><Icon name={icon} /></div><p className="stat-value">{value}</p><p className="stat-detail">{detail}</p></article>;
}
