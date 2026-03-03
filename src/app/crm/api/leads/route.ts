import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import type { LeadStage, LeadSource, LeadQuality } from '@/types/crm'

export const dynamic = 'force-dynamic'

// ── GET: List leads with pagination, filtering, sorting ──

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile for role-based filtering
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, team_id')
      .eq('id', user.id)
      .single()

    const params = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(params.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get('pageSize') || '25', 10)))
    const stage = params.get('stage') as LeadStage | null
    const source = params.get('source') as LeadSource | null
    const quality = params.get('quality') as LeadQuality | null
    const assignedTo = params.get('assigned_to')
    const search = params.get('search')?.trim()
    const sort = params.get('sort') || 'created_at'
    const dir = params.get('dir') === 'asc' ? true : false // ascending if 'asc'
    const isActive = params.get('is_active')
    const projectId = params.get('project_id')

    // Build query
    let query = supabase
      .from('leads')
      .select(
        '*, assigned_user:profiles!leads_assigned_to_fkey(id, full_name, email, avatar_url)',
        { count: 'exact' }
      )

    // Role-based visibility
    if (profile?.role === 'agent') {
      query = query.eq('assigned_to', user.id)
    } else if (profile?.role === 'channel_partner') {
      query = query.eq('channel_partner_id', user.id)
    }
    // admin and manager see all

    // Filters
    if (stage) {
      query = query.eq('stage', stage)
    }
    if (source) {
      query = query.eq('source', source)
    }
    if (quality) {
      query = query.eq('quality', quality)
    }
    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }
    if (projectId) {
      query = query.eq('project_id', projectId)
    }
    if (isActive !== null && isActive !== undefined && isActive !== '') {
      query = query.eq('is_active', isActive === 'true')
    }
    if (search && search.length > 0) {
      // Search by name, email, or phone
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
      )
    }

    // Sorting
    const allowedSortCols = [
      'created_at', 'updated_at', 'name', 'stage', 'quality',
      'source', 'score', 'next_follow_up', 'last_contacted_at',
    ]
    const sortCol = allowedSortCols.includes(sort) ? sort : 'created_at'
    query = query.order(sortCol, { ascending: dir })

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: leads, error, count } = await query

    if (error) {
      console.error('Leads list error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: leads ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (err) {
    console.error('Leads GET error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── POST: Create a new lead ──

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    if (!body.phone || typeof body.phone !== 'string' || body.phone.trim().length < 10) {
      return NextResponse.json({ error: 'Valid phone number is required (min 10 digits)' }, { status: 400 })
    }

    // Sanitize phone
    const phone = body.phone.replace(/\D/g, '').slice(-10)
    if (phone.length !== 10) {
      return NextResponse.json({ error: 'Phone must be a valid 10-digit Indian number' }, { status: 400 })
    }

    // Check for duplicate phone
    const { data: existing } = await supabase
      .from('leads')
      .select('id, name')
      .eq('phone', phone)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: `A lead with this phone already exists: ${existing.name}`, existingId: existing.id },
        { status: 409 }
      )
    }

    // Build lead record
    const leadData = {
      name: body.name.trim(),
      phone,
      email: body.email?.trim() || null,
      alternate_phone: body.alternate_phone?.trim() || null,
      stage: (body.stage as LeadStage) || 'new',
      quality: (body.quality as LeadQuality) || 'warm',
      source: (body.source as LeadSource) || 'website',
      source_detail: body.source_detail?.trim() || null,
      budget_min: body.budget_min ? Number(body.budget_min) : null,
      budget_max: body.budget_max ? Number(body.budget_max) : null,
      preferred_location: body.preferred_location?.trim() || null,
      preferred_config: body.preferred_config?.trim() || null,
      property_type: body.property_type?.trim() || null,
      assigned_to: body.assigned_to || null,
      assigned_at: body.assigned_to ? new Date().toISOString() : null,
      assigned_by: body.assigned_to ? user.id : null,
      channel_partner_id: body.channel_partner_id || null,
      project_id: body.project_id || null,
      project_name: body.project_name?.trim() || null,
      utm_source: body.utm_source || null,
      utm_medium: body.utm_medium || null,
      utm_campaign: body.utm_campaign || null,
      utm_term: body.utm_term || null,
      utm_content: body.utm_content || null,
      gclid: body.gclid || null,
      fbclid: body.fbclid || null,
      msclkid: body.msclkid || null,
      landing_page: body.landing_page || null,
      referrer: body.referrer || null,
      session_id: body.session_id || null,
      ga_cid: body.ga_cid || null,
      device_type: body.device_type || null,
      notes: body.notes?.trim() || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      form_mode: body.form_mode || null,
      is_active: true,
      created_by: user.id,
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .insert(leadData)
      .select('*')
      .single()

    if (error) {
      console.error('Lead create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Create initial activity
    await supabase.from('lead_activities').insert({
      lead_id: lead.id,
      type: 'system',
      title: 'Lead created',
      description: `Lead created via CRM by ${user.email}`,
      created_by: user.id,
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (err) {
    console.error('Leads POST error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
