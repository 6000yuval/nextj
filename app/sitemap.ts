import type { MetadataRoute } from "next";

import { getAllPosts } from "@/lib/posts";
import { buildUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  const staticRoutes = ["/", "/posts", "/about"].map((route) => ({
    url: buildUrl(route),
    lastModified: now,
  }));

  const postRoutes = posts.map((post) => ({
    url: buildUrl(`/posts/${post.slug}`),
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...postRoutes];
}