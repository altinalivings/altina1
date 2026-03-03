import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/crm/permissions'
import type { UserRole, LeadStage } from '@/types/crm'

export const dynamic = 'force-dynamic'

type RouteContext = { params: { id: string } }

// ── GET: Single lead with joined data ──

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .select(`
        *,
        assigned_user:profiles!leads_assigned_to_fkey(id, full_name, email, phone, avatar_url, role),
        channel_partner:profiles!leads_channel_partner_id_fkey(id, full_name, email, phone, avatar_url)
      `)
      .eq('id', params.id)
      .single()

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      )
    }

    // Role-based access check
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role ?? 'agent') as UserRole

    if (role === 'agent' && lead.assigned_to !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (role === 'channel_partner' && lead.channel_partner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(lead)
  } catch (err) {
    console.error('Lead GET error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── PATCH: Update lead fields ──

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for permission checks
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role ?? 'agent') as UserRole

    // Get existing lead
    const { data: existingLead, error: fetchError } = await supabase
      .from('leads')
      .select('id, stage, assigned_to, channel_partner_id')
      .eq('id', params.id)
      .single()

    if (fetchError || !existingLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Agents can only edit their own leads
    if (role === 'agent' && existingLead.assigned_to !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (role === 'channel_partner') {
      return NextResponse.json({ error: 'Channel partners cannot update leads' }, { status: 403 })
    }

    const body = await request.json()

    // Whitelist of updatable fields
    const allowedFields = [
      'name', 'email', 'phone', 'alternate_phone', 'stage', 'quality',
      'score', 'source', 'source_detail', 'budget_min', 'budget_max',
      'preferred_location', 'preferred_config', 'property_type',
      'assigned_to', 'channel_partner_id', 'project_id', 'project_name',
      'last_contacted_at', 'next_follow_up', 'is_active',
      'lost_reason', 'notes', 'tags',
    ]

    const updateData: Record<string, unknown> = {}
    for (const key of allowedFields) {
      if (key in body) {
        updateData[key] = body[key]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    // If assigning, record assignment metadata
    if ('assigned_to' in updateData && updateData.assigned_to !== existingLead.assigned_to) {
      if (!hasPermission(role, 'leads.assign')) {
        return NextResponse.json({ error: 'No permission to assign leads' }, { status: 403 })
      }
      updateData.assigned_at = new Date().toISOString()
      updateData.assigned_by = user.id
    }

    updateData.updated_at = new Date().toISOString()

    const { data: updatedLead, error: updateError } = await supabase
      .from('leads')
      .update(updateData)
      .eq('id', params.id)
      .select('*')
      .single()

    if (updateError) {
      console.error('Lead update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Log stage change activity
    if ('stage' in updateData && updateData.stage !== existingLead.stage) {
      await supabase.from('lead_activities').insert({
        lead_id: params.id,
        type: 'stage_change',
        title: `Stage changed to ${updateData.stage}`,
        old_stage: existingLead.stage,
        new_stage: updateData.stage as LeadStage,
        created_by: user.id,
      })
    }

    // Log assignment change
    if ('assigned_to' in updateData && updateData.assigned_to !== existingLead.assigned_to) {
      await supabase.from('lead_activities').insert({
        lead_id: params.id,
        type: 'assignment',
        title: 'Lead reassigned',
        description: `Assigned by ${user.email}`,
        created_by: user.id,
      })
    }

    return NextResponse.json(updatedLead)
  } catch (err) {
    console.error('Lead PATCH error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── DELETE: Delete lead (admin only) ──

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role ?? 'agent') as UserRole

    if (!hasPermission(role, 'leads.delete')) {
      return NextResponse.json(
        { error: 'Only admins can delete leads' },
        { status: 403 }
      )
    }

    // Soft delete: mark as inactive instead of hard delete
    const { error: deleteError } = await supabase
      .from('leads')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', params.id)

    if (deleteError) {
      console.error('Lead delete error:', deleteError)
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Log deletion activity
    await supabase.from('lead_activities').insert({
      lead_id: params.id,
      type: 'system',
      title: 'Lead deleted (soft)',
      description: `Deleted by ${user.email}`,
      created_by: user.id,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead DELETE error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
