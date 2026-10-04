import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          )
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()

  // Admin pages: the user must be connected AND admin.
  // Also checked in the (admin) layout, the pages and the server actions.
  if (request.nextUrl.pathname === '/admin' || request.nextUrl.pathname.startsWith('/admin/')) {
    if (!data?.claims) {
      return redirectTo(request, '/auth/login', supabaseResponse)
    }
    const { data: isAdmin } = await supabase.rpc('is_admin')
    if (isAdmin !== true) {
      return redirectTo(request, '/', supabaseResponse)
    }
  }

  return supabaseResponse
}

// Redirect, keeping the refreshed session cookies.
function redirectTo(request: NextRequest, pathname: string, supabaseResponse: NextResponse) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  const response = NextResponse.redirect(url)
  supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie))
  return response
}
