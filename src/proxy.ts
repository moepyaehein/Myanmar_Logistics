import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  try {
    const { url, key } = getSupabaseConfig();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          response.headers.set("Cache-Control", "private, no-store");
        },
      },
    });
    await supabase.auth.getClaims();
  } catch {
    // Page/data guards remain authoritative and fail closed on unavailable Auth.
  }
  return response;
}

export const config = {
  matcher: ["/login", "/signup", "/auth/:path*", "/account/:path*", "/admin/:path*", "/trader/:path*", "/driver/:path*", "/documents/:path*"],
};
