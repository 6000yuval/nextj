import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AUTHORS, buildPostPath, getAuthorBySlug, getPostsByAuthor } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

type AuthorPageProps = {
  params: { author: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () => {
  return AUTHORS.map((author) => ({ author: author.slug }));
};

export const generateMetadata = async ({ params }: AuthorPageProps) => {
  const author = getAuthorBySlug(params.author);
  if (!author) {
    return buildPageMetadata({
      title: "מחבר לא נמצא",
      description: "עמוד המחבר המבוקש לא קיים.",
      path: `/author/${params.author}`,
      noindex: true,
    });
  }

  return buildPageMetadata({
    title: `${author.name} | מחבר`,
    description: author.bio,
    path: `/author/${author.slug}`,
    image: author.image,
  });
};

export default function AuthorPage({ params }: AuthorPageProps) {
  const author = getAuthorBySlug(params.author);
  if (!author) {
    notFound();
  }

  const posts = getPostsByAuthor(author.slug);

  return (
    <main className="bg-sand-50">
      <section className="container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand-100">
            {author.image ? (
              <Image
                src={author.image}
                alt={author.name}
                fill
                sizes="220px"
                className="object-cover"
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink-900 sm:text-4xl">{author.name}</h1>
            <p className="mt-3 reading-width text-ink-700">{author.bio}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-accent-500">
              {author.social.map((social) => (
                <a key={social.url} href={social.url} target="_blank" rel="noreferrer">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <h2 className="text-2xl font-semibold text-ink-900">מאמרים של {author.name}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-sand-100 bg-white p-5">
              <p className="text-xs text-ink-500">{post.datePublished}</p>
              <h3 className="mt-2 text-lg font-semibold text-ink-900">{post.title}</h3>
              <p className="mt-2 text-sm text-ink-700">{post.description}</p>
              <Link
                href={buildPostPath(post)}
                className="mt-3 inline-flex text-sm font-semibold text-accent-500"
              >
                לקריאת המאמר
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
