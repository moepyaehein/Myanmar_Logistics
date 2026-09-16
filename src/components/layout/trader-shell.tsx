import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { signOut } from "@/app/login/actions";

export function TraderShell({ name, unreadAlerts, children }: { name: string; unreadAlerts:number; children: React.ReactNode }) {
  return <div className="app-shell">
    <a href="#main-content" className="skip-link">Skip to content</a>
    <aside className="sidebar trader-sidebar">
      <Link href="/trader/dashboard" className="brand"><span className="brand-mark"><Icon name="layers" /></span><span>MYANMAR<span className="brand-subtitle">TRADING & LOGISTICS</span></span></Link>
      <div className="workspace-label">TRADER WORKSPACE</div>
      <nav className="main-nav" aria-label="Trader navigation"><Link href="/trader/dashboard"><Icon name="grid" />Dashboard</Link><Link href="/trader/shipments"><Icon name="box" />My shipments</Link><Link href="/trader/shipments/new"><Icon name="route" />New request</Link><Link href="/trader/alerts"><Icon name="bell" />Alerts{unreadAlerts>0&&<span className="nav-count" aria-label={`${unreadAlerts} unread alerts`}>{unreadAlerts>99?"99+":unreadAlerts}</span>}</Link></nav>
      <div className="sidebar-bottom"><div className="foundation-card"><span className="tiny-label">YOUR CARGO, CONNECTED</span><p>From request<br />to destination.</p></div></div>
    </aside>
    <div className="workspace">
      <header className="topbar"><span className="breadcrumb">Myanmar Trading <span>/</span> Trader</span><div className="topbar-right"><span className="trader-name">{name}</span><form action={signOut}><button type="submit" className="button signout-button">Sign out</button></form></div></header>
      <main className="main-content" id="main-content">{children}</main>
      <footer className="footer"><span>Myanmar Trading · Your shipment workspace</span><span>Myanmar · UTC+6:30</span></footer>
    </div>
  </div>;
}
