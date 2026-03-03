import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // Look up the user by email in profiles to check is_active
    const { data: profile } = await adminClient
      .from('profiles')
      .select('id, is_active')
      .eq('email', email)
      .single()

    // If no profile found, return generic success (don't reveal whether email exists)
    if (!profile) {
      return NextResponse.json({ success: true, status: 'sent' })
    }

    // If user is deactivated, tell them
    if (!profile.is_active) {
      return NextResponse.json({
        success: false,
        status: 'deactivated',
        error: 'Your account has been deactivated. Please contact your administrator.',
      }, { status: 403 })
    }

    // User is active — send password reset email via admin client
    const origin = req.headers.get('origin') || req.nextUrl.origin
    const redirectTo = `${origin}/crm/reset-password`
    console.log('[forgot-password] Sending reset email to:', email, '| redirectTo:', redirectTo)

    const { data: resetData, error: resetError } = await adminClient.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (resetError) {
      console.error('[forgot-password] Reset email error:', resetError.message, resetError)
      return NextResponse.json({ error: 'Failed to send reset link. Please try again.' }, { status: 500 })
    }

    console.log('[forgot-password] Reset email response:', resetData)
    return NextResponse.json({ success: true, status: 'sent' })
  } catch (err) {
    console.error('Forgot password route error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
