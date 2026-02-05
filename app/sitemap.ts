import type { MetadataRoute } from "next";

import { BLOG_CATEGORIES, getAllPosts } from "@/lib/posts";
import { buildUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  const staticRoutes = ["/", "/posts", "/about"].map((route) => ({
    url: buildUrl(route),
    lastModified: now,
  }));

  const categoryRoutes = BLOG_CATEGORIES.map((category) => ({
    url: buildUrl(`/posts/category/${category.id}`),
    lastModified: now,
  }));

  const postRoutes = posts.map((post) => ({
    url: buildUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}
