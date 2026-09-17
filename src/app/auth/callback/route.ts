import {NextResponse,type NextRequest} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {ROLE_HOME,isUserRole} from "@/lib/auth/roles";

export async function GET(request:NextRequest){
  const code=request.nextUrl.searchParams.get("code");
  // Fixed local destinations: the callback never honors an external next URL.
  let destination="/login?notice=confirmation-error";
  if(code) {
    try {
      const client=await createClient();
      const {data,error}=await client.auth.exchangeCodeForSession(code);
      if(!error&&data.user){
        const {data:profile}=await client.from("profiles").select("role").eq("id",data.user.id).maybeSingle();
        destination=profile&&isUserRole(profile.role)?ROLE_HOME[profile.role]:"/account/setup";
      }
    } catch { /* Expired links and network failures return to a retryable login. */ }
  }
  const response=NextResponse.redirect(new URL(destination,request.url));
  response.headers.set("Cache-Control","private, no-store");
  response.headers.set("Referrer-Policy","no-referrer");
  return response;
}
