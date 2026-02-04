export type Category = {
  id: string;
  title: string;
  description: string;
  color: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "basics",
    title: "הבסיס: מנגנון הפעולה",
    description:
      "הבנת אופן הפעולה הטכני של מודלי שפה וההבדל בינם לבין מנועי חיפוש.",
    color: "bg-slate-100",
  },
  {
    id: "skills",
    title: "מיומנות (הנדסת פרומפט)",
    description: "כיצד לנסח קלט (Prompt) בצורה שתמקסם את איכות הפלט.",
    color: "bg-yellow-100",
  },
  {
    id: "thinking",
    title: "עיבוד וניתוח",
    description: "שימוש במערכת לצורך פירוק בעיות, סיעור מוחות וניתוח לוגי.",
    color: "bg-orange-100",
  },
  {
    id: "reliability",
    title: "בדיקה ואמינות",
    description: "זיהוי מידע שגוי, אימות עובדות והצלבת מקורות.",
    color: "bg-blue-100",
  },
  {
    id: "personal",
    title: "שימוש אישי",
    description: "יישומים יומיומיים: ניסוח טקסטים, ארגון מידע ולימוד.",
    color: "bg-purple-100",
  },
  {
    id: "work",
    title: "עבודה ולימודים",
    description: "כתיבה עסקית, סיכום מסמכים וניתוח נתונים.",
    color: "bg-amber-100",
  },
  {
    id: "automation",
    title: "מערכות ואוטומציה",
    description: "שילוב מודלי שפה בתהליכים אוטומטיים.",
    color: "bg-red-100",
  },
  {
    id: "safety",
    title: "בטיחות ופרטיות",
    description: "שמירה על מידע אישי ומגבלות השימוש.",
    color: "bg-emerald-100",
  },
  {
    id: "master",
    title: "מדריכי עומק",
    description: "סקירות מקיפות על מתודולוגיות עבודה מתקדמות.",
    color: "bg-indigo-100",
  },
];

export const getCategoryById = (id: string) =>
  CATEGORIES.find((category) => category.id === id) ?? null;