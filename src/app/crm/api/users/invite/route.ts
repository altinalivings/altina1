import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  // Verify the caller is an admin
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: callerProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (callerProfile?.role !== 'admin') {
    return NextResponse.json({ error: 'Only admins can invite users' }, { status: 403 })
  }

  const body = await req.json()
  const { email, full_name, phone, role } = body

  if (!email || !full_name || !role) {
    return NextResponse.json({ error: 'Email, name, and role are required' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Use inviteUserByEmail — this sends an actual invite email with a magic link
  // The user clicks the link and sets their own password
  const { data: newUser, error: inviteError } = await adminClient.auth.admin.inviteUserByEmail(
    email,
    { data: { full_name, phone } }
  )

  if (inviteError) {
    // If user already exists, give a clear message
    if (inviteError.message?.includes('already been registered')) {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 400 })
    }
    return NextResponse.json({ error: inviteError.message }, { status: 400 })
  }

  // Update profile with role and details (handle_new_user trigger creates the profile row)
  if (newUser?.user) {
    // Small delay to let the trigger create the profile row first
    await new Promise(resolve => setTimeout(resolve, 500))

    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ role, full_name, phone, is_active: true })
      .eq('id', newUser.user.id)

    if (profileError) {
      // Profile row might not exist yet if trigger is slow — try upsert
      const { error: upsertError } = await adminClient
        .from('profiles')
        .upsert({
          id: newUser.user.id,
          email,
          role,
          full_name,
          phone,
          is_active: true,
        })
      if (upsertError) {
        console.error('Failed to set profile:', upsertError)
      }
    }
  }

  return NextResponse.json({
    success: true,
    user_id: newUser?.user?.id,
    message: `Invite sent to ${email}. They will receive an email to set their password.`,
  })
}
