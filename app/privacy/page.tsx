import { buildPageMetadata } from "@/lib/seo";

export const generateMetadata = async () =>
  buildPageMetadata({
    title: "מדיניות פרטיות",
    description: "איך אנחנו מתייחסים לנתונים, פרטיות ועוגיות באתר.",
    path: "/privacy",
  });

export default function PrivacyPage() {
  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">מדיניות פרטיות</h1>
        <div className="reading-width mt-6 space-y-4 text-ink-700">
          <p>
            האתר אוסף נתונים בסיסיים לשיפור ביצועים וחוויית שימוש. איננו מוכרים מידע אישי לצדדים שלישיים.
          </p>
          <p>
            אם תבחרו להירשם לניוזלטר, המייל שלכם ישמש לשליחת עדכונים בלבד. ניתן להסיר הרשמה בכל עת.
          </p>
          <p>
            לשאלות פרטיות ניתן לפנות דרך ערוץ יצירת הקשר באתר.
          </p>
        </div>
      </section>
    </main>
  );
}
