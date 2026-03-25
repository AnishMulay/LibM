import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Create a base response to allow cookie mutation by @supabase/ssr
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Instantiate Supabase client that can read/write session cookies
  const supabase = createMiddlewareClient(request, response)

  // IMPORTANT: Always call getUser() (not getSession()) for reliable auth check.
  // getSession() reads from cookie only and can be spoofed.
  // getUser() validates the JWT with Supabase servers — authoritative.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Authenticated user hitting /login → redirect to home
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Unauthenticated user hitting any protected route → redirect to /login
  if (!user && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Pass through: unauthenticated → /login, or authenticated → any other route
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets in /public
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
