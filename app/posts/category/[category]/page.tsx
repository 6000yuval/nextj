import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import LocalSearch from "@/components/shared/LocalSearch";
import { BLOG_CATEGORIES, getAllPosts, getPostCategoryId } from "@/lib/posts";
import { canonicalOrPath } from "@/lib/site";

type CategoryPageProps = {
  params: { category: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () => {
  return BLOG_CATEGORIES.map((category) => ({ category: category.id }));
};

export const generateMetadata = ({
  params,
}: CategoryPageProps): Metadata => {
  const category = BLOG_CATEGORIES.find(
    (entry) => entry.id === params.category,
  );
  if (!category) {
    return {};
  }

  return {
    title: `${category.title} | מאמרים`,
    description: category.description,
    alternates: {
      canonical: canonicalOrPath(`/posts/category/${category.id}`),
    },
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = BLOG_CATEGORIES.find(
    (entry) => entry.id === params.category,
  );
  if (!category) {
    notFound();
  }

  const posts = getAllPosts().filter(
    (post) => getPostCategoryId(post) === category.id,
  );

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
            קטגוריה
          </p>
          <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">
            {category.title}
          </h1>
          <p className="reading-width text-ink-700">{category.description}</p>
          <p className="text-sm text-ink-500">{posts.length} מאמרים</p>
          <Link
            href="/posts"
            className="inline-flex text-sm font-semibold text-accent-500"
          >
            חזרה לכל המאמרים
          </Link>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="overflow-hidden rounded-3xl border border-sand-100 bg-white shadow-sm"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-xs text-ink-500">{post.date}</p>
                  <h2 className="text-2xl font-semibold text-ink-900">
                    {post.title}
                  </h2>
                  <p className="text-sm text-ink-700">{post.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-ink-500">
                    {post.tags?.map((tag) => (
                      <span key={tag} className="rounded-full bg-sand-50 px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex text-sm font-semibold text-accent-500"
                  >
                    לקריאת המאמר
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="space-y-6">
            <LocalSearch
              posts={posts.map(({ slug, title, description, tags }) => ({
                slug,
                title,
                description,
                tags,
              }))}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
