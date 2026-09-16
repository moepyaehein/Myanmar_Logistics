import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { signOut } from "@/app/login/actions";

export function AdminShell({ name, children }: { name: string; children: React.ReactNode }) {
  return <div className="app-shell"><a href="#main-content" className="skip-link">Skip to content</a>
    <aside className="sidebar trader-sidebar"><Link href="/admin/dashboard" className="brand"><span className="brand-mark"><Icon name="layers" /></span><span>MYANMAR<span className="brand-subtitle">TRADING & LOGISTICS</span></span></Link><div className="workspace-label">ADMIN WORKSPACE</div>
      <nav className="main-nav" aria-label="Admin navigation"><Link href="/admin/dashboard"><Icon name="grid" />Dashboard</Link><Link href="/admin/shipments"><Icon name="box" />All shipments</Link><Link href="/admin/gates"><Icon name="route" />Border gates</Link><Link href="/admin/alerts"><Icon name="bell" />Alerts</Link></nav>
    </aside><div className="workspace"><header className="topbar"><span className="breadcrumb">Myanmar Trading <span>/</span> Admin</span><div className="topbar-right"><span className="trader-name">{name}</span><form action={signOut}><button type="submit" className="button signout-button">Sign out</button></form></div></header><main className="main-content" id="main-content">{children}</main><footer className="footer"><span>Myanmar Trading · Operations workspace</span><span>Myanmar · UTC+6:30</span></footer></div></div>;
}
