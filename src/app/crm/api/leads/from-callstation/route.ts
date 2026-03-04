import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * POST /crm/api/leads/from-callstation
 *
 * Receives leads from CalleyApp (CallStation) when a contact is marked
 * with disposition "Interested". Uses API key auth (not session).
 *
 * Deduplicates by phone number — if lead already exists, adds an activity note instead.
 * Assigns to the CRM agent matching the CalleyApp caller's email.
 */
export async function POST(req: NextRequest) {
  try {
    // ── Auth: Verify API key ──
    const apiKey = req.headers.get('x-api-key')
    const expectedKey = process.env.CALLSTATION_API_KEY

    if (!expectedKey || !apiKey || apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      phone,
      email,
      notes,
      disposition,
      feedback,
      caller_email,
      campaign_name,
      call_duration,
      source: callSource,
    } = body

    // ── Validate required fields ──
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10)
    if (cleanPhone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }

    const adminClient = createAdminClient()

    // ── Look up CRM agent by caller email ──
    let assignedTo: string | null = null
    if (caller_email) {
      const { data: agent } = await adminClient
        .from('profiles')
        .select('id')
        .eq('email', caller_email)
        .eq('is_active', true)
        .single()

      if (agent) {
        assignedTo = agent.id
      }
    }

    // If no agent found, try to find an admin to assign to
    if (!assignedTo) {
      const { data: admin } = await adminClient
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .eq('is_active', true)
        .limit(1)
        .single()

      if (admin) {
        assignedTo = admin.id
      }
    }

    // ── Build call context note ──
    const callNote = [
      `Synced from CallStation — Disposition: ${disposition || 'Interested'}`,
      campaign_name ? `Campaign: ${campaign_name}` : null,
      call_duration ? `Call duration: ${call_duration}s` : null,
      callSource ? `Source: ${callSource}` : null,
      feedback?.length ? `Feedback: ${feedback.join(', ')}` : null,
      notes ? `Agent notes: ${notes}` : null,
    ].filter(Boolean).join('\n')

    // ── Check for existing lead (dedup by phone) ──
    const { data: existing } = await adminClient
      .from('leads')
      .select('id, name, assigned_to')
      .eq('phone', cleanPhone)
      .eq('is_active', true)
      .limit(1)
      .maybeSingle()

    if (existing) {
      // Lead exists — add activity note instead of duplicating
      await adminClient.from('lead_activities').insert({
        lead_id: existing.id,
        type: 'call',
        title: 'CallStation: Contact marked as Interested',
        description: callNote,
        created_by: assignedTo || existing.assigned_to,
        metadata: {
          source: 'callstation',
          disposition: disposition || 'Interested',
          campaign_name,
          call_duration,
          feedback,
        },
      })

      return NextResponse.json({
        success: true,
        action: 'updated',
        lead_id: existing.id,
        message: `Activity added to existing lead: ${existing.name}`,
      })
    }

    // ── Create new lead ──
    const { data: lead, error } = await adminClient
      .from('leads')
      .insert({
        name: name || `CallStation Lead (${cleanPhone})`,
        phone: cleanPhone,
        email: email || null,
        stage: 'contacted',
        quality: 'warm',
        source: 'cold_call',
        source_detail: campaign_name ? `CallStation: ${campaign_name}` : 'CallStation',
        assigned_to: assignedTo,
        assigned_at: assignedTo ? new Date().toISOString() : null,
        notes: callNote,
        tags: ['callstation'],
        is_active: true,
      })
      .select('id, name')
      .single()

    if (error) {
      console.error('[from-callstation] Lead create error:', error)
      return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
    }

    // ── Create initial activity ──
    await adminClient.from('lead_activities').insert({
      lead_id: lead.id,
      type: 'system',
      title: 'Lead synced from CallStation',
      description: callNote,
      created_by: assignedTo,
      metadata: {
        source: 'callstation',
        disposition: disposition || 'Interested',
        campaign_name,
        call_duration,
        feedback,
      },
    })

    return NextResponse.json({
      success: true,
      action: 'created',
      lead_id: lead.id,
      message: `New lead created: ${lead.name}`,
    }, { status: 201 })
  } catch (err) {
    console.error('[from-callstation] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
