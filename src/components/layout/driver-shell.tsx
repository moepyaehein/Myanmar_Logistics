import Link from "next/link";
import { signOut } from "@/app/login/actions";
import { Icon } from "@/components/ui/icon";
export function DriverShell({name,children}:{name:string;children:React.ReactNode}) {
  return <div className="driver-workspace"><a href="#main-content" className="skip-link">Skip to content</a><header className="driver-header"><Link href="/driver/dashboard" className="brand"><span className="brand-mark"><Icon name="layers" /></span><span>MYANMAR<span className="brand-subtitle">DRIVER WORKSPACE</span></span></Link><form action={signOut}><button className="button signout-button">Sign out</button></form></header><div className="driver-greeting"><span>{name}</span><Link href="/driver/dashboard" className="text-link">My assignments</Link></div><main id="main-content" className="driver-content">{children}</main><footer className="footer"><span>Myanmar Trading · Driver workspace</span><span>Myanmar · UTC+6:30</span></footer></div>;
}
