import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { REMOVED_POST_SLUGS } from "@/lib/removed-posts";

const extractSlug = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "posts") return parts[1];
  if (parts.length === 2) return parts[1];
  return null;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const slug = extractSlug(pathname);

  if (slug && REMOVED_POST_SLUGS.has(slug)) {
    return new NextResponse("Gone", { status: 410 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/posts/:slug*", "/:topic/:slug*"],
};
