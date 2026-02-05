import Link from "next/link";

import NavLink from "@/components/shared/NavLink";
import MobileMenu from "@/components/shared/MobileMenu";
import { SITE_NAME } from "@/lib/site";

export default function Header() {
  return (
    <header className="border-b border-sand-100 bg-white">
      <div className="container flex items-center justify-between py-5">
        <Link href="/" className="text-lg font-bold text-ink-900">
          {SITE_NAME}
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink href="/">בית</NavLink>
          <NavLink href="/topic/foundations">נושאים</NavLink>
          <NavLink href="/about">אודות</NavLink>
          <NavLink href="/privacy">פרטיות</NavLink>
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}