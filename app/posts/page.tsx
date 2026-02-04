import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import LocalSearch from "@/components/shared/LocalSearch";
import { canonicalOrPath } from "@/lib/site";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "מאמרים",
  description: "כל המאמרים והעדכונים בנושא בינה מלאכותית, פיתוח וכלים.",
  alternates: {
    canonical: canonicalOrPath("/posts"),
  },
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">מאמרים</h1>
          <p className="reading-width text-ink-700">
            עומק, פרקטיקה ויישום. כאן תמצאו את כל המאמרים שלנו על AI, פיתוח
            וכלים מתקדמים.
          </p>
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
            <div className="rounded-2xl border border-sand-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-ink-900">הצטרפו לזרם</h3>
              <p className="mt-2 text-sm text-ink-700">
                הירשמו לקבלת עדכונים על פוסטים חדשים וכלים מומלצים.
              </p>
              <Link
                href="/"
                className="mt-4 inline-flex text-sm font-semibold text-accent-500"
              >
                חזרה לעמוד הבית
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}