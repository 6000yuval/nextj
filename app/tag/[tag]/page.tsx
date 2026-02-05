import Link from "next/link";

import { INDEX_TAG_PAGES, buildPostPath, getPostsByTag } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

type TagPageProps = {
  params: { tag: string };
};

export const dynamic = "force-static";
export const revalidate = false;

export const generateMetadata = async ({ params }: TagPageProps) =>
  buildPageMetadata({
    title: `תגית: ${params.tag}`,
    description: `מאמרים עם התגית ${params.tag}`,
    path: `/tag/${params.tag}`,
    noindex: !INDEX_TAG_PAGES,
  });

export default function TagPage({ params }: TagPageProps) {
  const posts = getPostsByTag(params.tag);

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">#{params.tag}</h1>
        <p className="mt-3 text-sm text-ink-600">
          דף תגית. כברירת מחדל מסומן NOINDEX כדי למנוע דפי thin content.
        </p>
        <div className="mt-8 space-y-3">
          {posts.map((post) => (
            <Link key={post.slug} href={buildPostPath(post)} className="block rounded-xl border border-sand-100 bg-white p-4">
              <h2 className="font-semibold text-ink-900">{post.title}</h2>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
