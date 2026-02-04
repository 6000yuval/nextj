const normalizeUrl = (url: string) => url.replace(/\/$/, "");

export const SITE_NAME = "סטודיו בינה מלאכותית";
export const SITE_DESCRIPTION =
  "בלוג בעברית על בינה מלאכותית, פיתוח וכלים מעשיים לצוותים מודרניים.";

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

  return null;
};

export const buildUrl = (path: string) => {
  const base = getSiteUrl();
  if (!base) {
    return path;
  }

  return new URL(path, base).toString();
};

export const canonicalOrPath = (path: string) => {
  const base = getSiteUrl();
  if (!base) {
    return path;
  }
  return new URL(path, base).toString();
};