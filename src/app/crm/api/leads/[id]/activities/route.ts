import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { ActivityType, UserRole } from '@/types/crm'

export const dynamic = 'force-dynamic'

type RouteContext = { params: { id: string } }

const VALID_ACTIVITY_TYPES: ActivityType[] = [
  'note', 'call', 'email', 'whatsapp', 'meeting',
  'site_visit', 'follow_up', 'stage_change',
  'assignment', 'document', 'payment', 'system',
]

// ── GET: List activities for a lead ──

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const leadId = params.id

    // Verify lead exists and user has access
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, assigned_to, channel_partner_id')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
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

    // Pagination
    const searchParams = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)))
    const typeFilter = searchParams.get('type') as ActivityType | null

    let query = supabase
      .from('lead_activities')
      .select(
        'id, lead_id, type, title, description, metadata, old_stage, new_stage, call_duration, call_outcome, follow_up_date, is_completed, completed_at, created_by, created_at, creator:profiles!lead_activities_created_by_fkey(id, full_name, avatar_url)',
        { count: 'exact' }
      )
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (typeFilter && VALID_ACTIVITY_TYPES.includes(typeFilter)) {
      query = query.eq('type', typeFilter)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: activities, error, count } = await query

    if (error) {
      console.error('Activities list error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: activities ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (err) {
    console.error('Activities GET error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── POST: Create activity ──

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const leadId = params.id

    // Verify lead exists
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('id, assigned_to')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Role-based: agents can only log activities for their own leads
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role ?? 'agent') as UserRole

    if (role === 'agent' && lead.assigned_to !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (role === 'channel_partner') {
      return NextResponse.json({ error: 'Channel partners cannot add activities' }, { status: 403 })
    }

    const body = await request.json()

    // Validate
    if (!body.type || !VALID_ACTIVITY_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid activity type. Must be one of: ${VALID_ACTIVITY_TYPES.join(', ')}` },
        { status: 400 }
      )
    }
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }
    if (body.title.length > 500) {
      return NextResponse.json({ error: 'Title too long (max 500 chars)' }, { status: 400 })
    }
    if (body.description && body.description.length > 5000) {
      return NextResponse.json({ error: 'Description too long (max 5000 chars)' }, { status: 400 })
    }

    const activityData = {
      lead_id: leadId,
      type: body.type as ActivityType,
      title: body.title.trim(),
      description: body.description?.trim() || null,
      metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
      old_stage: body.old_stage || null,
      new_stage: body.new_stage || null,
      call_duration: body.call_duration ? Number(body.call_duration) : null,
      call_outcome: body.call_outcome?.trim() || null,
      follow_up_date: body.follow_up_date || null,
      is_completed: body.is_completed ?? false,
      created_by: user.id,
    }

    const { data: activity, error: createError } = await supabase
      .from('lead_activities')
      .insert(activityData)
      .select('id, lead_id, type, title, description, metadata, old_stage, new_stage, call_duration, call_outcome, follow_up_date, is_completed, completed_at, created_by, created_at')
      .single()

    if (createError) {
      console.error('Activity create error:', createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Update lead's last_contacted_at for communication types
    const contactTypes: ActivityType[] = ['call', 'email', 'whatsapp', 'meeting']
    if (contactTypes.includes(body.type as ActivityType)) {
      await supabase
        .from('leads')
        .update({
          last_contacted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId)
    }

    // If follow_up_date is set, update lead's next_follow_up
    if (body.follow_up_date) {
      await supabase
        .from('leads')
        .update({
          next_follow_up: body.follow_up_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', leadId)
    }

    return NextResponse.json(activity, { status: 201 })
  } catch (err) {
    console.error('Activities POST error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
