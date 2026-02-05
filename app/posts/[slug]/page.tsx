import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { renderMdx } from "@/lib/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { buildUrl, canonicalOrPath } from "@/lib/site";

type PostPageProps = {
  params: { slug: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () => {
  return getAllPosts().map((post) => ({ slug: post.slug }));
};

export const generateMetadata = ({ params }: PostPageProps): Metadata => {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return {};
  }

  const canonical = canonicalOrPath(`/posts/${post.slug}`);

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      images: [{ url: post.coverImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const content = await renderMdx(post.content);
  const canonical = buildUrl(`/posts/${post.slug}`);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    image: [post.coverImage],
    mainEntityOfPage: canonical,
  };

  return (
    <main className="bg-sand-50">
      <article className="container py-12 sm:py-16">
        <header className="space-y-6">
          <p className="text-xs font-semibold text-ink-500">{post.date}</p>
          <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="reading-width text-ink-700">{post.description}</p>
          <div className="flex flex-wrap gap-3 text-xs text-ink-500">
            <span>מאת {post.author}</span>
            <span>•</span>
            <span>{post.readingTimeMinutes} דקות קריאה</span>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 70vw, 95vw"
              className="object-cover"
            />
          </div>
        </header>
        <div className="article-content mt-10 space-y-6">{content}</div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </main>
  );
}
