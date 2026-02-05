"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type LocalSearchProps = {
  posts: Array<{
    slug: string;
    topic: string;
    title: string;
    description: string;
    tags?: string[];
  }>;
};

export default function LocalSearch({ posts }: LocalSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return posts.filter((post) => {
      const haystack = `${post.title} ${post.description} ${post.tags?.join(" ") ?? ""}`;
      return haystack.includes(trimmed);
    });
  }, [posts, query]);

  return (
    <div className="rounded-2xl border border-sand-100 bg-white p-6 shadow-sm">
      <label className="text-sm font-semibold text-ink-700" htmlFor="local-search">
        חיפוש מהיר במאמרים
      </label>
      <input
        id="local-search"
        type="search"
        value={query}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setQuery(event.target.value)
        }
        placeholder="למשל: תהליכים, AI, צוותים"
        className="mt-3 w-full rounded-xl border border-sand-100 bg-sand-50 px-4 py-2 text-sm text-ink-700 outline-none focus:border-accent-500"
      />
      {query.trim() ? (
        <div className="mt-4 space-y-2 text-sm text-ink-700">
          {results.length ? (
            results.map((post) => (
              <Link
                key={post.slug}
                href={`/${post.topic}/${post.slug}`}
                className="block rounded-lg border border-sand-100 px-3 py-2 hover:bg-sand-50"
              >
                {post.title}
              </Link>
            ))
          ) : (
            <p>לא נמצאו תוצאות כרגע.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}