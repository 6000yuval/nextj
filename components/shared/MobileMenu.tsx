"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "בית" },
  { href: "/posts", label: "מאמרים" },
  { href: "/about", label: "אודות" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((prev: boolean) => !prev)}
        className="flex items-center gap-2 rounded-full border border-sand-100 bg-white px-4 py-2 text-sm font-semibold text-ink-700"
      >
        תפריט
        <span aria-hidden className="text-lg">
          {open ? "✕" : "☰"}
        </span>
      </button>
      {open ? (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 mt-3 rounded-2xl border border-sand-100 bg-white p-4 shadow-lg"
        >
          <nav className="flex flex-col gap-3 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-ink-700 hover:bg-sand-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}