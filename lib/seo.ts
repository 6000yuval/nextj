import type { Metadata } from "next";

import {
  SITE_DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  buildUrl,
} from "@/lib/site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
}: SeoInput): Metadata => {
  const canonical = buildUrl(path);
  const socialImage = image ?? SITE_DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type,
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: socialImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
};

export const buildBreadcrumbSchema = (
  items: Array<{ name: string; path: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildUrl(item.path),
  })),
});

export const buildArticleSchema = (input: {
  headline: string;
  description: string;
  authorName: string;
  datePublished: string;
  dateModified: string;
  image: string;
  urlPath: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: input.headline,
  description: input.description,
  author: {
    "@type": "Person",
    name: input.authorName,
  },
  datePublished: input.datePublished,
  dateModified: input.dateModified,
  image: [input.image],
  mainEntityOfPage: buildUrl(input.urlPath),
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
  },
  url: buildUrl(input.urlPath),
});

export const buildFaqSchema = (
  items: Array<{ question: string; answer: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
});

export const DEFAULT_META = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
};
