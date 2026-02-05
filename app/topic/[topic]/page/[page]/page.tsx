import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import {
  POSTS_PER_PAGE,
  TOPICS,
  buildPostPath,
  getPostsByTopic,
  getTopicBySlug,
  paginatePosts,
} from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

type TopicPaginationPageProps = {
  params: { topic: string; page: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () => {
  const params: Array<{ topic: string; page: string }> = [];

  for (const topic of TOPICS) {
    const posts = getPostsByTopic(topic.slug);
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ topic: topic.slug, page: String(page) });
    }
  }

  return params;
};

export const generateMetadata = async ({ params }: TopicPaginationPageProps) => {
  const topic = getTopicBySlug(params.topic);
  const page = Number(params.page);
  if (!topic || Number.isNaN(page) || page < 2) {
    return buildPageMetadata({
      title: "עמוד לא נמצא",
      description: "העמוד המבוקש אינו קיים.",
      path: `/topic/${params.topic}/page/${params.page}`,
      noindex: true,
    });
  }

  return buildPageMetadata({
    title: `${topic.title} - עמוד ${page}`,
    description: topic.description,
    path: `/topic/${topic.slug}/page/${page}`,
  });
};

export default function TopicPaginationPage({ params }: TopicPaginationPageProps) {
  const topic = getTopicBySlug(params.topic);
  const page = Number(params.page);

  if (!topic || Number.isNaN(page) || page < 1) {
    notFound();
  }

  if (page === 1) {
    permanentRedirect(`/topic/${topic.slug}`);
  }

  const posts = getPostsByTopic(topic.slug);
  const paginated = paginatePosts(posts, page, POSTS_PER_PAGE);

  if (page > paginated.totalPages) {
    notFound();
  }

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">
          {topic.title} — עמוד {paginated.currentPage}
        </h1>
      </section>

      <section className="container pb-20">
        <div className="space-y-8">
          {paginated.items.map((post) => (
            <article
              key={post.slug}
              className="overflow-hidden rounded-3xl border border-sand-100 bg-white shadow-sm"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 p-6">
                <p className="text-xs text-ink-500">{post.datePublished}</p>
                <h2 className="text-2xl font-semibold text-ink-900">{post.title}</h2>
                <p className="text-sm text-ink-700">{post.description}</p>
                <Link
                  href={buildPostPath(post)}
                  className="inline-flex text-sm font-semibold text-accent-500"
                >
                  לקריאת המאמר
                </Link>
              </div>
            </article>
          ))}

          <nav className="flex justify-between text-sm font-semibold text-accent-500" aria-label="pagination">
            {paginated.currentPage > 1 ? (
              <Link
                href={
                  paginated.currentPage - 1 === 1
                    ? `/topic/${topic.slug}`
                    : `/topic/${topic.slug}/page/${paginated.currentPage - 1}`
                }
              >
                לעמוד הקודם
              </Link>
            ) : (
              <span />
            )}

            {paginated.currentPage < paginated.totalPages ? (
              <Link href={`/topic/${topic.slug}/page/${paginated.currentPage + 1}`}>
                לעמוד הבא
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}
