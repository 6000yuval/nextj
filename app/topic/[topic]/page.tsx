import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LocalSearch from "@/components/shared/LocalSearch";
import {
  POSTS_PER_PAGE,
  TOPICS,
  buildPostPath,
  getPostsByTopic,
  getTopicBySlug,
  getTopicPillarPosts,
  paginatePosts,
} from "@/lib/posts";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

type TopicPageProps = {
  params: { topic: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () =>
  TOPICS.map((topic) => ({ topic: topic.slug }));

export const generateMetadata = async ({ params }: TopicPageProps) => {
  const topic = getTopicBySlug(params.topic);
  if (!topic) {
    return buildPageMetadata({
      title: "נושא לא נמצא",
      description: "הנושא המבוקש לא קיים.",
      path: `/topic/${params.topic}`,
      noindex: true,
    });
  }

  return buildPageMetadata({
    title: `${topic.title} | מדריכים ומאמרים`,
    description: topic.description,
    path: `/topic/${topic.slug}`,
  });
};

export default function TopicPage({ params }: TopicPageProps) {
  const topic = getTopicBySlug(params.topic);
  if (!topic) {
    notFound();
  }

  const posts = getPostsByTopic(topic.slug);
  const paginated = paginatePosts(posts, 1, POSTS_PER_PAGE);
  const pillarPosts = getTopicPillarPosts(topic.slug);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "בית", path: "/" },
    { name: topic.title, path: `/topic/${topic.slug}` },
  ]);

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">נושא</p>
          <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">{topic.title}</h1>
          <p className="reading-width text-ink-700">{topic.intro}</p>
          <p className="text-sm text-ink-500">{posts.length} מאמרים</p>
        </div>
      </section>

      {pillarPosts.length > 0 ? (
        <section className="container pb-8">
          <h2 className="text-xl font-semibold text-ink-900">מאמרי מפתח בנושא</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {pillarPosts.map((post) => (
              <Link
                key={post.slug}
                href={buildPostPath(post)}
                className="rounded-2xl border border-sand-100 bg-white p-5"
              >
                <p className="text-xs text-ink-500">{post.datePublished}</p>
                <h3 className="mt-2 text-lg font-semibold text-ink-900">{post.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container pb-20">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
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

            {paginated.totalPages > 1 ? (
              <nav className="flex justify-between text-sm font-semibold text-accent-500" aria-label="pagination">
                <span />
                <Link href={`/topic/${topic.slug}/page/2`}>לעמוד הבא</Link>
              </nav>
            ) : null}
          </div>

          <div className="space-y-6">
            <LocalSearch
              posts={posts.map(({ slug, topic: postTopic, title, description, tags }) => ({
                slug,
                topic: postTopic,
                title,
                description,
                tags,
              }))}
            />
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </main>
  );
}
