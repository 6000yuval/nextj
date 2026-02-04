"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("sent");
      }}
      className="flex flex-col gap-4 rounded-2xl border border-sand-100 bg-white p-6 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-semibold text-ink-900">ניוזלטר חודשי</h3>
        <p className="mt-2 text-sm text-ink-700">
          עדכונים על מאמרים חדשים, מדריכים וטיפים ל‑AI.
        </p>
      </div>
      <label className="text-sm font-semibold text-ink-700" htmlFor="newsletter-email">
        אימייל לקבלת עדכונים
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder="name@example.com"
        className="w-full rounded-xl border border-sand-100 bg-sand-50 px-4 py-2 text-sm text-ink-700 outline-none focus:border-accent-500"
      />
      <button
        type="submit"
        className="rounded-xl bg-accent-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {status === "sent" ? "תודה! נשלח מייל בקרוב" : "אני רוצה להצטרף"}
      </button>
    </form>
  );
}