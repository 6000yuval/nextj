import type { ReactNode } from "react";

type CalloutProps = {
  children: ReactNode;
  title?: string;
};

export default function Callout({ children, title }: CalloutProps) {
  return (
    <aside className="rounded-2xl border border-sand-100 bg-sand-50 p-6 text-ink-700">
      {title ? <h3 className="mb-2 text-lg font-semibold">{title}</h3> : null}
      <div className="space-y-3 text-base">{children}</div>
    </aside>
  );
}