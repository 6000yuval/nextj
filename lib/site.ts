const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export const SITE_NAME = "סטודיו בינה מלאכותית";
export const SITE_DESCRIPTION =
  "בלוג בעברית על בינה מלאכותית, פיתוח וכלים מעשיים לצוותים מודרניים.";
export const SITE_LOCALE = "he_IL";
export const SITE_DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80";

export const getSiteUrl = () => {
  const siteUrl = process.env.SITE_URL?.trim();
  if (siteUrl) {
    return normalizeUrl(siteUrl);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const normalized = vercelUrl.replace(/^https?:\/\//, "");
    return normalizeUrl(`https://${normalized}`);
  }

  return "http://localhost:3000";
};

export const buildUrl = (path: string) => {
  return new URL(path, getSiteUrl()).toString();
};

export const canonicalOrPath = (path: string) => buildUrl(path);

export const SITE_ORGANIZATION = {
  name: SITE_NAME,
  url: getSiteUrl(),
  logo: buildUrl("/favicon.ico"),
};