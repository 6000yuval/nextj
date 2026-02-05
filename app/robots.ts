import type { MetadataRoute } from "next";

import { buildUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/search", "/admin", "/internal", "/*?*"],
      },
    ],
    sitemap: buildUrl("/sitemap.xml"),
    host: buildUrl("/"),
  };
}