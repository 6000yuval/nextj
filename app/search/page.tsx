import { buildPageMetadata } from "@/lib/seo";

export const generateMetadata = async () =>
  buildPageMetadata({
    title: "חיפוש פנימי",
    description: "עמוד חיפוש פנימי באתר.",
    path: "/search",
    noindex: true,
  });

export default function SearchPage() {
  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">חיפוש פנימי</h1>
        <p className="mt-3 text-ink-700">העמוד מיועד לחיפוש פנימי בלבד ולכן מסומן NOINDEX.</p>
      </section>
    </main>
  );
}
