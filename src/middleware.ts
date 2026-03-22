import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export const runtime = 'experimental-edge'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = {
      supabase: await createClient(),
      response: NextResponse.next({
        request: {
          headers: request.headers,
        },
      }),
    };

    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    await supabase.auth.getSession()

    return response
  } catch {
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
