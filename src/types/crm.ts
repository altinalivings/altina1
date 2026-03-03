import type { ReactNode } from 'react'

// ===== Role & Auth =====
export type UserRole = 'admin' | 'manager' | 'agent' | 'channel_partner'

export type Profile = {
  id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  deactivation_reason: string | null
  team_id: string | null
  manager_id: string | null
  created_at: string
  updated_at: string
}

// ===== Lead =====
export type LeadStage =
  | 'new' | 'contacted' | 'qualified'
  | 'site_visit_scheduled' | 'site_visit_done'
  | 'negotiation' | 'booking' | 'won' | 'lost' | 'junk'

export type LeadSource =
  | 'website' | 'google_ads' | 'facebook' | 'instagram' | 'linkedin'
  | 'referral' | 'walk_in' | 'cold_call' | 'channel_partner'
  | 'property_portal' | 'whatsapp' | 'other'

export type LeadQuality = 'hot' | 'warm' | 'cold' | 'dead'

export type Lead = {
  id: string
  name: string
  email: string | null
  phone: string
  alternate_phone: string | null
  stage: LeadStage
  quality: LeadQuality
  score: number
  source: LeadSource
  source_detail: string | null
  budget_min: number | null
  budget_max: number | null
  preferred_location: string | null
  preferred_config: string | null
  property_type: string | null
  assigned_to: string | null
  assigned_at: string | null
  assigned_by: string | null
  channel_partner_id: string | null
  project_id: string | null
  project_name: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  gclid: string | null
  fbclid: string | null
  msclkid: string | null
  landing_page: string | null
  referrer: string | null
  session_id: string | null
  ga_cid: string | null
  device_type: string | null
  last_contacted_at: string | null
  next_follow_up: string | null
  follow_up_count: number
  site_visit_count: number
  is_active: boolean
  lost_reason: string | null
  notes: string | null
  tags: string[]
  created_at: string
  updated_at: string
  created_by: string | null
  form_mode: string | null
  // Joined
  assigned_user?: Profile
  channel_partner?: Profile
}

// ===== Activity =====
export type ActivityType =
  | 'note' | 'call' | 'email' | 'whatsapp' | 'meeting'
  | 'site_visit' | 'follow_up' | 'stage_change'
  | 'assignment' | 'document' | 'payment' | 'system'

export type LeadActivity = {
  id: string
  lead_id: string
  type: ActivityType
  title: string
  description: string | null
  metadata: Record<string, unknown>
  old_stage: LeadStage | null
  new_stage: LeadStage | null
  call_duration: number | null
  call_outcome: string | null
  follow_up_date: string | null
  is_completed: boolean
  completed_at: string | null
  created_by: string | null
  created_at: string
  creator?: Profile
}

// ===== Property =====
export type Property = {
  id: string
  project_ref: string | null
  name: string
  developer: string | null
  brand: string | null
  city: string | null
  state: string | null
  sector: string | null
  micro_market: string | null
  location: string | null
  rera: string | null
  status: string | null
  possession: string | null
  launch_date: string | null
  property_type: string | null
  configuration: string | null
  typologies: string[] | null
  sizes: string | null
  land_area: string | null
  towers: number | null
  floors: string | null
  total_units: string | null
  price_display: string | null
  price_min: number | null
  price_max: number | null
  amenities: string[] | null
  highlights: string[] | null
  overview: string | null
  hero_image: string | null
  gallery: string[] | null
  brochure_url: string | null
  video_url: string | null
  map_embed: string | null
  map_lat: number | null
  map_lng: number | null
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
  synced_from_ts: boolean
  units_count?: number
  available_count?: number
}

// ===== Unit =====
export type UnitStatus = 'available' | 'blocked' | 'booked' | 'sold' | 'not_released'

export type Unit = {
  id: string
  property_id: string
  unit_number: string
  tower: string | null
  floor: number | null
  configuration: string | null
  carpet_area: number | null
  super_area: number | null
  balcony_area: number | null
  facing: string | null
  status: UnitStatus
  base_price: number | null
  total_price: number | null
  plc: number | null
  floor_rise: number | null
  other_charges: number | null
  parking_charges: number | null
  stamp_duty_pct: number | null
  gst_pct: number | null
  floor_plan_url: string | null
  booked_by_lead: string | null
  blocked_by: string | null
  blocked_until: string | null
  commission_pct: number | null
  notes: string | null
  created_at: string
  updated_at: string
  property?: Property
  lead?: Lead
}

// ===== Site Visit =====
export type VisitStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'

export type SiteVisit = {
  id: string
  lead_id: string
  property_id: string | null
  project_name: string | null
  scheduled_date: string
  scheduled_time: string | null
  status: VisitStatus
  assigned_to: string | null
  feedback: string | null
  rating: number | null
  interested_units: string[] | null
  next_action: string | null
  pickup_required: boolean
  pickup_location: string | null
  vehicle_details: string | null
  completed_at: string | null
  cancelled_reason: string | null
  rescheduled_from: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  lead?: Lead
  property?: Property
  assigned_user?: Profile
}

// ===== Follow-up =====
export type FollowUpPriority = 'low' | 'medium' | 'high' | 'urgent'

export type FollowUp = {
  id: string
  lead_id: string
  type: ActivityType
  title: string
  description: string | null
  priority: FollowUpPriority
  due_date: string
  due_time: string | null
  is_completed: boolean
  completed_at: string | null
  completed_by: string | null
  outcome: string | null
  assigned_to: string
  reminder_at: string | null
  reminder_sent: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  lead?: Lead
  assigned_user?: Profile
}

// ===== Booking =====
export type BookingStatus =
  | 'draft' | 'pending_approval' | 'approved'
  | 'agreement_sent' | 'agreement_signed'
  | 'registered' | 'cancelled' | 'refunded'

export type Booking = {
  id: string
  booking_number: string
  lead_id: string
  property_id: string
  unit_id: string
  buyer_name: string
  buyer_email: string | null
  buyer_phone: string
  buyer_pan: string | null
  buyer_aadhaar: string | null
  buyer_address: string | null
  co_applicant_name: string | null
  co_applicant_pan: string | null
  agreement_value: number
  discount: number
  net_amount: number
  stamp_duty: number | null
  registration_fee: number | null
  gst_amount: number | null
  total_payable: number
  status: BookingStatus
  approved_by: string | null
  approved_at: string | null
  agreement_date: string | null
  agreement_doc_url: string | null
  registration_date: string | null
  sales_agent_id: string | null
  channel_partner_id: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  lead?: Lead
  property?: Property
  unit?: Unit
  payments?: Payment[]
}

// ===== Payment =====
export type PaymentStatus = 'pending' | 'received' | 'verified' | 'bounced' | 'refunded' | 'overdue'
export type PaymentMode = 'cheque' | 'rtgs_neft' | 'upi' | 'demand_draft' | 'cash' | 'card' | 'other'

export type Payment = {
  id: string
  booking_id: string
  milestone: string
  amount: number
  due_date: string | null
  paid_date: string | null
  status: PaymentStatus
  mode: PaymentMode | null
  transaction_ref: string | null
  bank_name: string | null
  instrument_date: string | null
  receipt_number: string | null
  receipt_url: string | null
  verified_by: string | null
  verified_at: string | null
  bounce_reason: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

// ===== Commission =====
export type CommissionStatus = 'pending' | 'approved' | 'invoice_raised' | 'paid' | 'cancelled'

export type Commission = {
  id: string
  booking_id: string
  earner_id: string
  earner_role: UserRole
  base_amount: number
  commission_pct: number
  commission_amount: number
  gst_on_commission: number | null
  tds_deducted: number | null
  net_payable: number
  status: CommissionStatus
  approved_by: string | null
  approved_at: string | null
  paid_date: string | null
  invoice_number: string | null
  invoice_url: string | null
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  booking?: Booking
  earner?: Profile
}

// ===== Expense =====
export type ExpenseStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'reimbursed'
export type ExpenseCategory =
  | 'marketing' | 'travel' | 'client_entertainment'
  | 'office' | 'legal' | 'tech' | 'training' | 'other'

export type Expense = {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  expense_date: string
  description: string | null
  receipt_url: string | null
  status: ExpenseStatus
  submitted_by: string | null
  approved_by: string | null
  approved_at: string | null
  rejection_reason: string | null
  reimbursed_at: string | null
  lead_id: string | null
  visit_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
  submitter?: { id: string; full_name: string; avatar_url: string | null; role: string } | null
  approver?: { id: string; full_name: string } | null
}

// ===== Notification =====
export type CrmNotification = {
  id: string
  user_id: string
  title: string
  body: string | null
  type: string
  entity_type: string | null
  entity_id: string | null
  is_read: boolean
  read_at: string | null
  created_at: string
}

// ===== Dashboard =====
export type DashboardStats = {
  totalLeads: number
  newLeadsToday: number
  newLeadsThisWeek: number
  newLeadsThisMonth: number
  leadsInPipeline: number
  qualifiedLeads: number
  conversionRate: number
  totalBookings: number
  bookingsThisMonth: number
  totalRevenue: number
  revenueThisMonth: number
  pendingPayments: number
  overduePayments: number
  todayVisits: number
  todayFollowUps: number
  overdueFollowUps: number
  leadsByStage: Record<LeadStage, number>
  leadsBySource: Record<LeadSource, number>
}

// ===== DataTable =====
export type SortDirection = 'asc' | 'desc'

export type Column<T> = {
  key: string
  header: string
  render?: (row: T) => ReactNode
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  className?: string
}

export type PaginationState = {
  page: number
  pageSize: number
  total: number
}
