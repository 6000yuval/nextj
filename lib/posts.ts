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