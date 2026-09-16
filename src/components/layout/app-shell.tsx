import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="Myanmar Trading overview"><span className="brand-mark"><Icon name="layers" /></span><span>MYANMAR<span className="brand-subtitle">TRADING & LOGISTICS</span></span></Link>
        <div className="workspace-label">OPERATIONS WORKSPACE</div>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href="/#overview"><Icon name="grid" />Overview</Link>
          <Link href="/#shipments"><Icon name="box" />Shipments<span className="nav-count">3</span></Link>
          <Link href="/#gates"><Icon name="route" />Border gates</Link>
          <Link href="/#alerts"><Icon name="bell" />Alerts</Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="foundation-card"><span className="tiny-label">BUILT FOR MYANMAR</span><p>Every shipment.<br />A clearer journey.</p><span>Assignment 5 · AI Engineering</span></div>
          <Link href="/login" className="profile-link"><span className="avatar">MT</span><span>Demo workspace<small>Design preview</small></span><Icon name="arrow" /></Link>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Foundation preview</strong></div><div className="topbar-right"><span className="preview-pill">Sample data</span><span className="timezone">Myanmar · UTC+6:30</span></div></header>
        <main id="main-content" className="main-content">{children}</main>
        <footer className="footer"><span>Myanmar Trading · Logistics Monitoring</span><span>Phase 1 / 10 — Foundation</span></footer>
      </div>
    </div>
  );
}
