import { permanentRedirect, notFound } from "next/navigation";

import { buildPostPath, getAllIndexablePosts, getPostBySlug, isRemovedPostSlug } from "@/lib/posts";

type LegacyPostPageProps = {
  params: { slug: string };
};

export const dynamicParams = false;
export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = async () =>
  getAllIndexablePosts().map((post) => ({ slug: post.slug }));

export default function LegacyPostPage({ params }: LegacyPostPageProps) {
  if (isRemovedPostSlug(params.slug)) {
    notFound();
  }

  const post = getPostBySlug(params.slug);
  if (!post || post.draft) {
    notFound();
  }

  permanentRedirect(buildPostPath(post));
}
