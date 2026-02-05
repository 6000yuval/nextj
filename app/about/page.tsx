import Image from "next/image";

import { buildPageMetadata } from "@/lib/seo";
import { buildUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const generateMetadata = async () =>
  buildPageMetadata({
    title: "אודות הבלוג: מי אנחנו ומה החזון",
    description: "הכירו את מחבר הבלוג והגישה שלנו לתוכן AI פרקטי בעברית.",
    path: "/about",
  });

export default function AboutPage() {
  const canonical = buildUrl("/about");

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "יובל כהן",
    url: canonical,
    description: SITE_DESCRIPTION,
    worksFor: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">
              מי אנחנו
            </h1>
            <p className="reading-width text-ink-700">
              סטודיו בינה מלאכותית הוא בית לתוכן מעשי בעברית על AI, פיתוח וכלים
              לצוותים מודרניים. אנחנו משלבים מחקר, הנדסה וחשיבה מוצרית כדי לעזור
              לכם ליישם פתרונות אמיתיים.
            </p>
            <div className="space-y-3 text-ink-700">
              <p>
                אני יובל כהן, מוביל מוצר ו‑AI. המטרה שלי היא להפוך ידע מורכב
                למהלכים ברורים שאפשר להטמיע כבר השבוע.
              </p>
              <p>
                אם אתם רוצים לשתף פעולה או לקבל ייעוץ, אפשר ליצור קשר ישירות דרך
                המייל שמופיע בניוזלטר.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand-100 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80"
              alt="דיוקן מקצועי של מוביל הבלוג"
              fill
              sizes="(min-width: 1024px) 35vw, 80vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </main>
  );
}