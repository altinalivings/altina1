import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/crm/permissions'
import { syncProjectsToSupabase } from '@/lib/crm/sync-projects'
import type { UserRole } from '@/types/crm'

export const dynamic = 'force-dynamic'

// ── POST: Sync website projects to Supabase properties table ──
// Only admin and manager roles can trigger this.

export async function POST() {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for role check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 403 })
    }

    const role = profile.role as UserRole

    if (!hasPermission(role, 'properties.sync')) {
      return NextResponse.json(
        { error: 'Only admins and managers can sync properties' },
        { status: 403 }
      )
    }

    const results = await syncProjectsToSupabase()

    // Log the sync action
    // Log sync action — non-critical, fire and forget
    void Promise.resolve(supabase.from('lead_activities').insert({
      lead_id: null as unknown as string,
      type: 'system',
      title: 'Property sync completed',
      description: `Synced ${results.total} projects: ${results.updated} updated, ${results.errors} errors. Triggered by ${user.email}`,
      created_by: user.id,
    }))

    return NextResponse.json({
      success: true,
      results,
      message: `Synced ${results.total} projects. Updated: ${results.updated}, Errors: ${results.errors}`,
    })
  } catch (err) {
    console.error('Property sync error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
