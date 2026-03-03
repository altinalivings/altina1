import { NextResponse, type NextRequest } from 'next/server'
import { createMiddlewareSupabase } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /crm/* routes
  if (!pathname.startsWith('/crm')) {
    return NextResponse.next()
  }

  // If Supabase env vars are missing, let login page through to show proper error
  // Public CRM routes that don't require auth
  const isPublicRoute = pathname === '/crm/login' || pathname === '/crm/reset-password' || pathname === '/crm/api/users/forgot-password'

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    if (isPublicRoute) return NextResponse.next()
    return NextResponse.redirect(new URL('/crm/login', request.url))
  }

  try {
    // Allow public (unauthenticated) routes through
    if (pathname === '/crm/api/users/forgot-password') {
      return NextResponse.next()
    }

    // Allow login and reset-password pages through
    if (pathname === '/crm/login' || pathname === '/crm/reset-password') {
      const { supabase, response } = createMiddlewareSupabase(request)
      const { data: { user } } = await supabase.auth.getUser()
      // If already authenticated and on login page, redirect to dashboard
      if (user && pathname === '/crm/login') {
        return NextResponse.redirect(new URL('/crm/dashboard', request.url))
      }
      return response
    }

    // All other /crm/* routes require auth
    const { supabase, response } = createMiddlewareSupabase(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/crm/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user account is active
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', user.id)
      .single()

    if (profile && !profile.is_active) {
      // Sign out the inactive user and redirect to login
      await supabase.auth.signOut()
      const loginUrl = new URL('/crm/login', request.url)
      loginUrl.searchParams.set('deactivated', '1')
      return NextResponse.redirect(loginUrl)
    }

    return response
  } catch {
    // On any auth error, allow public routes through (never redirect loop)
    if (isPublicRoute) return NextResponse.next()
    return NextResponse.redirect(new URL('/crm/login', request.url))
  }
}

export const config = {
  matcher: ['/crm/:path*'],
}
