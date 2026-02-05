import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { renderMdx } from "@/lib/mdx";
import {
  buildPostPath,
  extractFaqItems,
  extractToc,
  getAllIndexablePosts,
  getAuthorBySlug,
  getPostByTopicAndSlug,
  getRelatedPosts,
  getTopicBySlug,
  getTopicNextPrevious,
  isRemovedPostSlug,
} from "@/lib/posts";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildPageMetadata,
} from "@/lib/seo";

type PostPageProps = {
  params: { topic: string; slug: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () =>
  getAllIndexablePosts().map((post) => ({
    topic: post.topic,
    slug: post.slug,
  }));

export const generateMetadata = async ({ params }: PostPageProps) => {
  const post = getPostByTopicAndSlug(params.topic, params.slug);
  if (!post || post.draft) {
    return buildPageMetadata({
      title: "תוכן לא נמצא",
      description: "העמוד המבוקש אינו זמין.",
      path: `/${params.topic}/${params.slug}`,
      noindex: true,
    });
  }

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: buildPostPath(post),
    image: post.featuredImage,
    type: "article",
  });
};

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostByTopicAndSlug(params.topic, params.slug);

  if (!post || post.draft || isRemovedPostSlug(params.slug)) {
    notFound();
  }

  const topic = getTopicBySlug(post.topic);
  const author = getAuthorBySlug(post.author);
  const content = await renderMdx(post.content);
  const toc = extractToc(post.content);
  const relatedPosts = getRelatedPosts(post, 3);
  const { next, previous } = getTopicNextPrevious(post);
  const faqItems = extractFaqItems(post.content);

  const breadcrumbItems = [
    { name: "בית", path: "/" },
    { name: topic?.title ?? post.topic, path: `/topic/${post.topic}` },
    { name: post.title, path: buildPostPath(post) },
  ];

  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbItems);
  const articleSchema = buildArticleSchema({
    headline: post.title,
    description: post.description,
    authorName: author?.name ?? post.author,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    image: post.featuredImage,
    urlPath: buildPostPath(post),
  });

  return (
    <main className="bg-sand-50">
      <article className="container py-12 sm:py-16">
        <nav aria-label="פירורי לחם" className="mb-6 text-sm text-ink-500">
          <ol className="flex flex-wrap gap-2">
            {breadcrumbItems.map((item, index) => (
              <li key={item.path} className="flex items-center gap-2">
                <Link href={item.path} className="hover:text-ink-900">
                  {item.name}
                </Link>
                {index < breadcrumbItems.length - 1 ? <span>›</span> : null}
              </li>
            ))}
          </ol>
        </nav>

        <header className="space-y-5">
          <Link
            href={`/topic/${post.topic}`}
            className="inline-flex rounded-full bg-sand-100 px-4 py-1 text-xs font-semibold text-ink-700"
          >
            {topic?.title ?? post.topic}
          </Link>
          <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">{post.title}</h1>
          <p className="reading-width text-lg text-ink-700">{post.description}</p>
          <p className="text-sm text-ink-500">
            פורסם: {post.datePublished} • עודכן לאחרונה: {post.dateModified}
          </p>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 70vw, 95vw"
              className="object-cover"
            />
          </div>
        </header>

        {toc.length >= 3 ? (
          <aside className="mt-10 rounded-2xl border border-sand-100 bg-white p-5">
            <h2 className="text-lg font-semibold text-ink-900">תוכן העניינים</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-700">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? "mr-4" : ""}>
                  <a href={`#${item.id}`} className="hover:text-ink-900">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}

        <div className="article-content mt-10 space-y-6">{content}</div>

        {faqItems.length > 0 ? (
          <section className="mt-12 rounded-2xl border border-sand-100 bg-white p-6">
            <h2 className="text-xl font-semibold text-ink-900">שאלות נפוצות</h2>
            <p className="mt-2 text-sm text-ink-600">
              FAQ זוהה בתוכן ונוסף גם כ-structured data למנועי חיפוש.
            </p>
          </section>
        ) : null}

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {previous ? (
            <Link
              href={buildPostPath(previous)}
              className="rounded-2xl border border-sand-100 bg-white p-5"
            >
              <p className="text-xs text-ink-500">המאמר הקודם בנושא</p>
              <p className="mt-2 font-semibold text-ink-900">{previous.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={buildPostPath(next)}
              className="rounded-2xl border border-sand-100 bg-white p-5 text-right"
            >
              <p className="text-xs text-ink-500">המאמר הבא בנושא</p>
              <p className="mt-2 font-semibold text-ink-900">{next.title}</p>
            </Link>
          ) : null}
        </section>

        {author ? (
          <section className="mt-12 rounded-2xl border border-sand-100 bg-white p-6">
            <h2 className="text-xl font-semibold text-ink-900">על הכותב</h2>
            <p className="mt-2 text-sm text-ink-700">{author.bio}</p>
            <Link
              href={`/author/${author.slug}`}
              className="mt-3 inline-flex text-sm font-semibold text-accent-500"
            >
              לכל המאמרים של {author.name}
            </Link>
          </section>
        ) : null}

        {relatedPosts.length > 0 ? (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-ink-900">מאמרים קשורים</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={buildPostPath(related)}
                  className="rounded-2xl border border-sand-100 bg-white p-5"
                >
                  <p className="text-xs text-ink-500">{related.datePublished}</p>
                  <h3 className="mt-2 font-semibold text-ink-900">{related.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqItems.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(faqItems)) }}
        />
      ) : null}
    </main>
  );
}
