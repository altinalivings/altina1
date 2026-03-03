import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { hasPermission } from '@/lib/crm/permissions'
import type { UserRole, BookingStatus } from '@/types/crm'

export const dynamic = 'force-dynamic'

// ── GET: List bookings with pagination ──

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role ?? 'agent') as UserRole

    const params = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(params.get('page') || '1', 10))
    const pageSize = Math.min(100, Math.max(1, parseInt(params.get('pageSize') || '25', 10)))
    const status = params.get('status') as BookingStatus | null
    const search = params.get('search')?.trim()
    const sort = params.get('sort') || 'created_at'
    const dir = params.get('dir') === 'asc'
    const propertyId = params.get('property_id')

    let query = supabase
      .from('bookings')
      .select(
        `
        *,
        lead:leads!bookings_lead_id_fkey(id, name, phone, email),
        property:properties!bookings_property_id_fkey(id, name, developer, city),
        unit:units!bookings_unit_id_fkey(id, unit_number, tower, configuration)
      `,
        { count: 'exact' }
      )

    // Role-based visibility
    if (role === 'agent') {
      query = query.eq('sales_agent_id', user.id)
    } else if (role === 'channel_partner') {
      query = query.eq('channel_partner_id', user.id)
    }
    // admin and manager see all bookings

    // Filters
    if (status) {
      query = query.eq('status', status)
    }
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }
    if (search && search.length > 0) {
      query = query.or(
        `buyer_name.ilike.%${search}%,buyer_phone.ilike.%${search}%,booking_number.ilike.%${search}%`
      )
    }

    // Sorting
    const allowedSortCols = [
      'created_at', 'updated_at', 'booking_number', 'buyer_name',
      'agreement_value', 'net_amount', 'total_payable', 'status',
    ]
    const sortCol = allowedSortCols.includes(sort) ? sort : 'created_at'
    query = query.order(sortCol, { ascending: dir })

    // Pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: bookings, error, count } = await query

    if (error) {
      console.error('Bookings list error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data: bookings ?? [],
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (err) {
    console.error('Bookings GET error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── POST: Create a new booking ──

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = (profile?.role ?? 'agent') as UserRole

    if (!hasPermission(role, 'bookings.create')) {
      return NextResponse.json(
        { error: 'You do not have permission to create bookings' },
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validate required fields
    const requiredFields = ['lead_id', 'property_id', 'unit_id', 'buyer_name', 'buyer_phone', 'agreement_value']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    if (typeof body.buyer_name !== 'string' || body.buyer_name.trim().length === 0) {
      return NextResponse.json({ error: 'Buyer name is required' }, { status: 400 })
    }

    const phone = (body.buyer_phone || '').replace(/\D/g, '').slice(-10)
    if (phone.length !== 10) {
      return NextResponse.json({ error: 'Buyer phone must be a valid 10-digit number' }, { status: 400 })
    }

    const agreementValue = Number(body.agreement_value)
    if (isNaN(agreementValue) || agreementValue <= 0) {
      return NextResponse.json({ error: 'Agreement value must be a positive number' }, { status: 400 })
    }

    // Verify lead exists
    const { data: lead, error: leadErr } = await supabase
      .from('leads')
      .select('id')
      .eq('id', body.lead_id)
      .single()

    if (leadErr || !lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 400 })
    }

    // Verify property exists
    const { data: property, error: propErr } = await supabase
      .from('properties')
      .select('id')
      .eq('id', body.property_id)
      .single()

    if (propErr || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 400 })
    }

    // Verify unit exists and is available
    const { data: unit, error: unitErr } = await supabase
      .from('units')
      .select('id, status')
      .eq('id', body.unit_id)
      .single()

    if (unitErr || !unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 400 })
    }

    if (unit.status !== 'available' && unit.status !== 'blocked') {
      return NextResponse.json(
        { error: `Unit is ${unit.status} and cannot be booked` },
        { status: 400 }
      )
    }

    // Calculate amounts
    const discount = Number(body.discount) || 0
    const netAmount = agreementValue - discount
    const stampDuty = body.stamp_duty != null ? Number(body.stamp_duty) : null
    const registrationFee = body.registration_fee != null ? Number(body.registration_fee) : null
    const gstAmount = body.gst_amount != null ? Number(body.gst_amount) : null
    const totalPayable = netAmount + (stampDuty ?? 0) + (registrationFee ?? 0) + (gstAmount ?? 0)

    const bookingData = {
      // booking_number is auto-generated via DB trigger
      lead_id: body.lead_id,
      property_id: body.property_id,
      unit_id: body.unit_id,
      buyer_name: body.buyer_name.trim(),
      buyer_email: body.buyer_email?.trim() || null,
      buyer_phone: phone,
      buyer_pan: body.buyer_pan?.trim().toUpperCase() || null,
      buyer_aadhaar: body.buyer_aadhaar?.trim() || null,
      buyer_address: body.buyer_address?.trim() || null,
      co_applicant_name: body.co_applicant_name?.trim() || null,
      co_applicant_pan: body.co_applicant_pan?.trim().toUpperCase() || null,
      agreement_value: agreementValue,
      discount,
      net_amount: netAmount,
      stamp_duty: stampDuty,
      registration_fee: registrationFee,
      gst_amount: gstAmount,
      total_payable: totalPayable,
      status: 'draft' as BookingStatus,
      sales_agent_id: body.sales_agent_id || user.id,
      channel_partner_id: body.channel_partner_id || null,
      notes: body.notes?.trim() || null,
      created_by: user.id,
    }

    const { data: booking, error: createError } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select('*')
      .single()

    if (createError) {
      console.error('Booking create error:', createError)
      return NextResponse.json({ error: createError.message }, { status: 500 })
    }

    // Update unit status to booked
    await supabase
      .from('units')
      .update({
        status: 'booked',
        booked_by_lead: body.lead_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.unit_id)

    // Update lead stage to booking
    await supabase
      .from('leads')
      .update({
        stage: 'booking',
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.lead_id)

    // Log activity
    await supabase.from('lead_activities').insert({
      lead_id: body.lead_id,
      type: 'payment',
      title: `Booking created: ${booking.booking_number || 'Draft'}`,
      description: `Booking for ${body.buyer_name} — Agreement value: ${agreementValue}`,
      created_by: user.id,
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (err) {
    console.error('Bookings POST error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
