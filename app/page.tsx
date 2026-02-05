import Image from "next/image";
import Link from "next/link";

import LocalSearch from "@/components/shared/LocalSearch";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { buildPostPath, getAllIndexablePosts, TOPICS } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

const heroFeatures = [
  "תובנות פרקטיות על מודלים ושימושים",
  "מדריכים לפיתוח מוצרים מבוססי AI",
  "כלים וזרימות עבודה לצוותים חכמים",
];

export const generateMetadata = async () =>
  buildPageMetadata({
    title: "בלוג AI בעברית: מדריכים, פרומפטים ותהליכי עבודה",
    description:
      "מדריכים פרקטיים בעברית על בינה מלאכותית: יסודות, פרומפטים, אוטומציה ויישומים עסקיים.",
    path: "/",
  });

export const dynamic = "force-static";
export const revalidate = false;

export default function HomePage() {
  const posts = getAllIndexablePosts();
  const topicCounts = TOPICS.map((topic) => ({
    ...topic,
    count: posts.filter((post) => post.topic === topic.slug).length,
  }));

  return (
    <main className="min-h-screen bg-sand-50 text-ink-900">
      <section className="container py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ink-500">
              סטודיו AI • פיתוח • כלים
            </p>
            <h1 className="text-4xl font-bold leading-tight text-ink-900 sm:text-5xl">
              ידע בעברית על בינה מלאכותית, פיתוח וכלים שמזיזים מוצר קדימה.
            </h1>
            <p className="reading-width text-lg text-ink-700">
              כאן תמצאו מאמרים שמפרקים מושגים מורכבים למהלכים ברורים, עם דגש על
              ביצועים, חוויית משתמש ויישום מעשי בצוותים מודרניים.
            </p>
            <ul className="space-y-3 text-ink-700">
              {heroFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-accent-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-sand-100 shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
              alt="רובוטים במעבדה חדשנית"
              fill
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="container pb-16">
        <div className="space-y-6">
          <div>
            <h2 className="section-heading">קטגוריות מובילות</h2>
            <p className="mt-2 text-ink-700">
              בחרו תחום עניין וקבלו את כל המאמרים הרלוונטיים במקום אחד.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            {topicCounts.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topic/${topic.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-sand-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
                    {topic.count} מאמרים
                  </p>
                  <h3 className="text-xl font-semibold text-ink-900">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-ink-700">{topic.description}</p>
                </div>
                <span className="mt-6 text-sm font-semibold text-accent-500">
                  להצגת המאמרים
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container pb-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-12">
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="section-heading">מאמרים אחרונים</h2>
                <p className="mt-2 text-ink-700">
                  סקירה עדכנית של התכנים החדשים ביותר אצלנו בבלוג.
                </p>
              </div>
              <div className="space-y-4">
                {posts.slice(0, 3).map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-2xl border border-sand-100 p-5"
                  >
                    <p className="text-xs text-ink-500">{post.datePublished}</p>
                    <h3 className="mt-2 text-lg font-semibold text-ink-900">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-700">
                      {post.description}
                    </p>
                    <Link
                      href={buildPostPath(post)}
                      className="mt-4 inline-flex text-sm font-semibold text-accent-500"
                    >
                      לקריאת המאמר
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <LocalSearch
              posts={posts.map(({ slug, topic, title, description, tags }) => ({
                slug,
                topic,
                title,
                description,
                tags,
              }))}
            />
            <NewsletterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
