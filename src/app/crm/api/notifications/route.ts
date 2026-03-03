import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// ── GET: List notifications for current user ──
// Unread notifications come first, then sorted by created_at DESC.

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = request.nextUrl.searchParams
    const page = Math.max(1, parseInt(params.get('page') || '1', 10))
    const pageSize = Math.min(50, Math.max(1, parseInt(params.get('pageSize') || '20', 10)))
    const unreadOnly = params.get('unread') === 'true'

    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('is_read', { ascending: true }) // unread first
      .order('created_at', { ascending: false })

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data: notifications, error, count } = await query

    if (error) {
      console.error('Notifications list error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also get unread count for badge
    const { count: unreadCount } = await supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false)

    return NextResponse.json({
      data: notifications ?? [],
      unreadCount: unreadCount ?? 0,
      pagination: {
        page,
        pageSize,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
      },
    })
  } catch (err) {
    console.error('Notifications GET error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// ── PATCH: Mark notification(s) as read ──
// Body: { id: string } for single, or { ids: string[] } for multiple, or { all: true } for all.

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const now = new Date().toISOString()

    // Mark all as read
    if (body.all === true) {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .eq('user_id', user.id)
        .eq('is_read', false)

      if (updateError) {
        console.error('Mark all read error:', updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'All notifications marked as read' })
    }

    // Mark specific notification(s) as read
    const ids: string[] = []

    if (body.id && typeof body.id === 'string') {
      ids.push(body.id)
    }

    if (Array.isArray(body.ids)) {
      for (const id of body.ids) {
        if (typeof id === 'string' && id.length > 0) {
          ids.push(id)
        }
      }
    }

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'Provide id, ids[], or all:true' },
        { status: 400 }
      )
    }

    // Cap to 100 IDs per request
    if (ids.length > 100) {
      return NextResponse.json(
        { error: 'Maximum 100 notification IDs per request' },
        { status: 400 }
      )
    }

    const { data: updated, error: updateError } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: now })
      .eq('user_id', user.id)
      .in('id', ids)
      .select('id, is_read, read_at')

    if (updateError) {
      console.error('Mark read error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      updated: updated?.length ?? 0,
    })
  } catch (err) {
    console.error('Notifications PATCH error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
