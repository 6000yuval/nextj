import fs from "fs";
import path from "path";
import matter from "gray-matter";

const repoRoot = process.cwd();
const postsDirectory = path.join(repoRoot, "content", "posts");
const publicDirectory = path.join(repoRoot, "public");

const normalizeUrl = (url) => url.replace(/\/$/, "");
const siteUrl = process.env.SITE_URL ? normalizeUrl(process.env.SITE_URL) : "";

const buildUrl = (relativePath) => {
  if (!siteUrl) return relativePath;
  return new URL(relativePath, siteUrl).toString();
};

const escapeXml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const readPosts = () => {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);
      return { slug, ...data };
    })
    .filter((post) => post.title && post.description && post.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const posts = readPosts();
const items = posts
  .map((post) => {
    const url = buildUrl(`/posts/${post.slug}`);
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${new Date(post.date).toUTCString()}</pubDate>
        <description>${escapeXml(post.description)}</description>
      </item>`;
  })
  .join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(process.env.SITE_NAME ?? "AI Blog")}</title>
    <link>${buildUrl("/")}</link>
    <description>${escapeXml(process.env.SITE_DESCRIPTION ?? "")}</description>
    ${items}
  </channel>
</rss>`;

if (!fs.existsSync(publicDirectory)) {
  fs.mkdirSync(publicDirectory, { recursive: true });
}

fs.writeFileSync(path.join(publicDirectory, "rss.xml"), rss, "utf8");

if (!siteUrl) {
  // eslint-disable-next-line no-console
  console.warn(
    "RSS generated without SITE_URL. Set SITE_URL for absolute links.",
  );
}
