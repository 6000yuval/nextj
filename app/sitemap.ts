import type { MetadataRoute } from "next";

import {
  AUTHORS,
  INDEX_TAG_PAGES,
  POSTS_PER_PAGE,
  TOPICS,
  buildPostPath,
  getAllIndexablePosts,
  getPostsByTopic,
  getAllTags,
} from "@/lib/posts";
import { buildUrl } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllIndexablePosts();
  const now = new Date();

  const staticRoutes = ["/", "/about", "/privacy"].map((route) => ({
    url: buildUrl(route),
    lastModified: now,
  }));

  const topicRoutes = TOPICS.map((topic) => ({
    url: buildUrl(`/topic/${topic.slug}`),
    lastModified: now,
  }));

  const topicPaginationRoutes = TOPICS.flatMap((topic) => {
    const totalPages = Math.ceil(getPostsByTopic(topic.slug).length / POSTS_PER_PAGE);
    if (totalPages <= 1) return [];

    return Array.from({ length: totalPages - 1 }, (_, index) => ({
      url: buildUrl(`/topic/${topic.slug}/page/${index + 2}`),
      lastModified: now,
    }));
  });

  const authorRoutes = AUTHORS.map((author) => ({
    url: buildUrl(`/author/${author.slug}`),
    lastModified: now,
  }));

  const postRoutes = posts.map((post) => ({
    url: buildUrl(buildPostPath(post)),
    lastModified: new Date(post.dateModified),
  }));

  const tagRoutes = INDEX_TAG_PAGES
    ? getAllTags().map((tag) => ({
        url: buildUrl(`/tag/${tag}`),
        lastModified: now,
      }))
    : [];

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...topicPaginationRoutes,
    ...authorRoutes,
    ...postRoutes,
    ...tagRoutes,
  ];
}
