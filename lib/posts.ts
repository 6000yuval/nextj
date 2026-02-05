import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { REMOVED_POST_SLUGS } from "@/lib/removed-posts";

export type TopicSlug =
  | "foundations"
  | "prompting"
  | "productivity"
  | "business"
  | "safety";

export type Author = {
  slug: string;
  name: string;
  bio: string;
  image?: string;
  social: Array<{ label: string; url: string }>;
};

export type Topic = {
  slug: TopicSlug;
  title: string;
  description: string;
  intro: string;
  pillarPostSlugs: string[];
};

export type PostFrontmatter = {
  title: string;
  description: string;
  slug: string;
  topic: TopicSlug;
  tags: string[];
  author: string;
  datePublished: string;
  dateModified: string;
  featuredImage: string;
  draft: boolean;
  readingTimeMinutes?: number;
};

export type Post = PostFrontmatter & {
  content: string;
};

export const INDEX_TAG_PAGES = false;
export const POSTS_PER_PAGE = 12;

export const TOPICS: Topic[] = [
  {
    slug: "foundations",
    title: "יסודות והבנה",
    description: "מושגי יסוד בבינה מלאכותית והבנת מודלים בצורה פשוטה.",
    intro:
      "בעמוד הזה תמצאו את כל מאמרי היסוד שיעזרו להבין איך AI עובד, איפה הוא חזק, ואיפה צריך זהירות.",
    pillarPostSlugs: ["how-chatgpt-works-simple", "what-ai-really-does"],
  },
  {
    slug: "prompting",
    title: "פרומפטים ושאלות",
    description: "איך לנסח בקשות כדי לקבל תשובות איכותיות ויעילות.",
    intro:
      "טכניקות פרומפטינג פרקטיות, דוגמאות ניסוח, ושיטות לשיפור דיוק התשובות לאורך זמן.",
    pillarPostSlugs: ["how-to-ask-good-question", "persona-technique"],
  },
  {
    slug: "productivity",
    title: "פרודוקטיביות וכלים",
    description: "תהליכי עבודה, אוטומציה, וחיסכון בזמן עם AI.",
    intro:
      "מאמרים שמתרגמים AI לעבודה יומיומית: משימות חוזרות, תהליכים חכמים, וצוותים יעילים יותר.",
    pillarPostSlugs: ["ai-workflows", "save-10-hours-a-week"],
  },
  {
    slug: "business",
    title: "עסקים ותפעול",
    description: "יישומי AI במכירות, שיווק, כספים ותמיכת לקוחות.",
    intro:
      "מדריכים וטקטיקות לשימוש עסקי ב-AI, עם דגש על השפעה מדידה ותוצאות בפועל.",
    pillarPostSlugs: ["ai-sales-marketing-ops", "ai-finance-ops-fpa"],
  },
  {
    slug: "safety",
    title: "סיכונים ואתיקה",
    description: "פרטיות, אמינות, הטיות ונהלי עבודה בטוחים עם AI.",
    intro:
      "כל מה שצריך לדעת כדי להפעיל AI באחריות: מגבלות, פרטיות, וזיהוי טעויות נפוצות.",
    pillarPostSlugs: ["privacy-safety-guide", "is-ai-dangerous"],
  },
];

export const AUTHORS: Author[] = [
  {
    slug: "yuval-cohen",
    name: "יובל כהן",
    bio: "כותב ומוביל מוצר בתחום ה-AI. מתמקד בהנגשה פרקטית של טכנולוגיה לצוותים ועסקים.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    social: [
      { label: "LinkedIn", url: "https://www.linkedin.com" },
      { label: "X", url: "https://x.com" },
    ],
  },
];

const postsDirectory = path.join(process.cwd(), "content", "posts");

const REQUIRED_FIELDS: Array<keyof PostFrontmatter> = [
  "title",
  "description",
  "slug",
  "topic",
  "tags",
  "author",
  "datePublished",
  "dateModified",
  "featuredImage",
  "draft",
];

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const isValidDate = (value: string) => !Number.isNaN(new Date(value).getTime());

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const validatePost = (
  frontmatter: Record<string, unknown>,
  fileName: string,
  content: string,
): PostFrontmatter => {
  for (const field of REQUIRED_FIELDS) {
    assert(frontmatter[field] !== undefined, `${fileName}: missing required field '${field}'.`);
  }

  const post = frontmatter as PostFrontmatter;

  assert(typeof post.title === "string" && post.title.trim().length > 0, `${fileName}: invalid 'title'.`);
  assert(
    typeof post.description === "string" && post.description.trim().length > 0,
    `${fileName}: invalid 'description'.`,
  );
  assert(typeof post.slug === "string" && slugPattern.test(post.slug), `${fileName}: slug must be lowercase-hyphenated.`);
  assert(TOPICS.some((topic) => topic.slug === post.topic), `${fileName}: invalid 'topic'.`);
  assert(Array.isArray(post.tags) && post.tags.length > 0, `${fileName}: 'tags' must be a non-empty array.`);
  assert(post.tags.every((tag) => slugPattern.test(tag)), `${fileName}: all tags must be lowercase-hyphenated.`);
  assert(AUTHORS.some((author) => author.slug === post.author), `${fileName}: unknown author '${post.author}'.`);
  assert(typeof post.datePublished === "string" && isValidDate(post.datePublished), `${fileName}: invalid 'datePublished'.`);
  assert(typeof post.dateModified === "string" && isValidDate(post.dateModified), `${fileName}: invalid 'dateModified'.`);
  assert(typeof post.featuredImage === "string" && post.featuredImage.startsWith("http"), `${fileName}: invalid 'featuredImage'.`);
  assert(typeof post.draft === "boolean", `${fileName}: 'draft' must be boolean.`);

  const headingLevel4OrDeeper = /^#{4,}\s/m.test(content);
  if (headingLevel4OrDeeper) {
    // eslint-disable-next-line no-console
    console.warn(`${fileName}: contains heading level deeper than H3; consider normalizing to H2/H3.`);
  }

  const expectedSlug = fileName.replace(/\.mdx$/, "");
  assert(post.slug === expectedSlug, `${fileName}: slug must match file name '${expectedSlug}'.`);

  return post;
};

const parsePostFile = (fileName: string): Post => {
  const fullPath = path.join(postsDirectory, fileName);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  const validated = validatePost(data as Record<string, unknown>, fileName, content);

  return {
    ...validated,
    readingTimeMinutes:
      typeof validated.readingTimeMinutes === "number" ? validated.readingTimeMinutes : 6,
    content,
  };
};

export const buildPostPath = (post: Pick<Post, "topic" | "slug">) => `/${post.topic}/${post.slug}`;

export const getAllPosts = () => {
  if (!fs.existsSync(postsDirectory)) return [] as Post[];

  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map(parsePostFile)
    .sort(
      (a, b) =>
        new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
    );
};

export const getAllIndexablePosts = () => getAllPosts().filter((post) => !post.draft);

export const getPostByTopicAndSlug = (topic: string, slug: string) => {
  return getAllPosts().find((post) => post.topic === topic && post.slug === slug) ?? null;
};

export const getPostBySlug = (slug: string) =>
  getAllPosts().find((post) => post.slug === slug) ?? null;

export const getTopicBySlug = (topicSlug: string) =>
  TOPICS.find((topic) => topic.slug === topicSlug) ?? null;

export const getAuthorBySlug = (authorSlug: string) =>
  AUTHORS.find((author) => author.slug === authorSlug) ?? null;

export const getPostsByTopic = (topicSlug: string) =>
  getAllIndexablePosts().filter((post) => post.topic === topicSlug);

export const getTopicPillarPosts = (topicSlug: string) => {
  const topic = getTopicBySlug(topicSlug);
  if (!topic) return [];

  const posts = getAllIndexablePosts();
  return topic.pillarPostSlugs
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is Post => Boolean(post));
};

export const paginatePosts = (posts: Post[], page: number, perPage = POSTS_PER_PAGE) => {
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;

  return {
    currentPage,
    totalPages,
    items: posts.slice(start, start + perPage),
  };
};

export const getPostsByAuthor = (authorSlug: string) =>
  getAllIndexablePosts().filter((post) => post.author === authorSlug);

export const getPostsByTag = (tagSlug: string) =>
  getAllIndexablePosts().filter((post) => post.tags.includes(tagSlug));

export const getAllTags = () => {
  const tags = new Set<string>();
  for (const post of getAllIndexablePosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort();
};

export const getRelatedPosts = (post: Post, limit = 3) => {
  return getAllIndexablePosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag)).length;
      const sameTopicBonus = candidate.topic === post.topic ? 2 : 0;
      return {
        post: candidate,
        score: sharedTags + sameTopicBonus,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
};

export const getTopicNextPrevious = (post: Post) => {
  const topicPosts = getPostsByTopic(post.topic);
  const index = topicPosts.findIndex((entry) => entry.slug === post.slug);
  if (index === -1) {
    return { next: null, previous: null };
  }

  return {
    next: topicPosts[index - 1] ?? null,
    previous: topicPosts[index + 1] ?? null,
  };
};

export const extractToc = (content: string) => {
  const markdownHeadings = [...content.matchAll(/^(##|###)\s+(.+)$/gm)].map((match) => ({
    level: match[1] === "##" ? 2 : 3,
    text: match[2].trim(),
  }));

  return markdownHeadings.map((heading) => ({
    ...heading,
    id: heading.text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .trim()
      .replace(/\s+/g, "-"),
  }));
};

export const extractFaqItems = (content: string) => {
  const detailsBlocks = [...content.matchAll(/<details[\s\S]*?<summary[^>]*>(.*?)<\/summary>[\s\S]*?<p[^>]*>(.*?)<\/p>[\s\S]*?<\/details>/g)];
  return detailsBlocks.map((block) => ({
    question: block[1].replace(/<[^>]+>/g, "").trim(),
    answer: block[2].replace(/<[^>]+>/g, "").trim(),
  }));
};

export const isRemovedPostSlug = (slug: string) => REMOVED_POST_SLUGS.has(slug);
