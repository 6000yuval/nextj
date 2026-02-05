import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  coverImage: string;
  author: string;
  readingTimeMinutes: number;
  tags?: string[];
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
};

export type BlogCategory = {
  id: string;
  title: string;
  description: string;
  keywords: string[];
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "foundations",
    title: "יסודות והבנה",
    description: "הסברים פשוטים על איך הדברים עובדים ומה עומד מאחורי ה-AI.",
    keywords: [
      "יסודות",
      "הבנה",
      "הסבר",
      "פשוט",
      "מה זה",
      "איך עובד",
      "מודלים",
      "מנגנון",
      "llm",
      "fundamentals",
      "basics",
      "explain",
      "how",
      "what",
    ],
  },
  {
    id: "prompting",
    title: "פרומפטים ושאלות",
    description: "איך לנסח שאלות, פרומפטים וטכניקות כדי לקבל תשובות טובות.",
    keywords: [
      "פרומפט",
      "שאל",
      "שאלה",
      "ניסוח",
      "טון",
      "persona",
      "prompt",
      "question",
      "ask",
      "chain-of-thought",
    ],
  },
  {
    id: "productivity",
    title: "פרודוקטיביות וכלים",
    description: "תהליכי עבודה, חסכון בזמן וכלים שעוזרים לבצע מהר יותר.",
    keywords: [
      "פרודוקטיביות",
      "כלים",
      "workflow",
      "תהליך",
      "חיסכון",
      "זמן",
      "צוותים",
      "עבודה",
      "אוטומציה",
      "automation",
      "teams",
    ],
  },
  {
    id: "business",
    title: "עסקים ותפעול",
    description: "שימושים עסקיים ב-AI: מכירות, שיווק, כספים ותפעול.",
    keywords: [
      "עסק",
      "מכירות",
      "שיווק",
      "כספים",
      "תפעול",
      "finance",
      "sales",
      "marketing",
      "ops",
      "fpa",
      "customer",
      "support",
      "pipeline",
    ],
  },
  {
    id: "safety",
    title: "סיכונים ואתיקה",
    description: "פרטיות, אמינות, הטיות וסיכונים שחשוב להכיר.",
    keywords: [
      "סכנה",
      "בטיחות",
      "פרטיות",
      "אתיקה",
      "אמינות",
      "סיכונים",
      "שקר",
      "bias",
      "alignment",
      "deepfake",
      "safety",
      "ethics",
      "risk",
    ],
  },
];

const normalizeText = (value: string) => value.toLowerCase();

export const getPostCategoryId = (post: PostFrontmatter) => {
  const haystack = normalizeText(`${post.title} ${post.description}`);
  let bestId = BLOG_CATEGORIES[0].id;
  let bestScore = -1;

  for (const category of BLOG_CATEGORIES) {
    const score = category.keywords.reduce((total, keyword) => {
      return haystack.includes(keyword) ? total + 1 : total;
    }, 0);
    if (score > bestScore) {
      bestScore = score;
      bestId = category.id;
    }
  }

  return bestId;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

const parsePost = (slug: string) => {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    ...(data as PostFrontmatter),
    slug,
    content,
  } satisfies Post;
};

export const getAllPosts = () => {
  if (!fs.existsSync(postsDirectory)) {
    return [] as Post[];
  }

  const slugs = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));

  return slugs
    .map(parsePost)
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
};

export const getPostBySlug = (slug: string) => {
  try {
    return parsePost(slug);
  } catch {
    return null;
  }
};
