import Link from "next/link";

import { SITE_NAME } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-sand-100 bg-white">
      <div className="container flex flex-col gap-6 py-10 text-sm text-ink-600 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-ink-900">{SITE_NAME}</p>
          <p>כל הזכויות שמורות © {new Date().getFullYear()}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="hover:text-ink-900">
            בית
          </Link>
          <Link href="/topic/foundations" className="hover:text-ink-900">
            נושאים
          </Link>
          <Link href="/about" className="hover:text-ink-900">
            אודות
          </Link>
          <Link href="/privacy" className="hover:text-ink-900">
            פרטיות
          </Link>
          <Link href="/feed.xml" className="hover:text-ink-900">
            Feed
          </Link>
        </div>
      </div>
    </footer>
  );
}