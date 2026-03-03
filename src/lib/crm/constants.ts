import type { LeadStage, LeadQuality, UnitStatus, BookingStatus, PaymentStatus, VisitStatus, FollowUpPriority, ExpenseStatus, ExpenseCategory } from '@/types/crm'

// Stage colors for badges and Kanban
export const STAGE_COLORS: Record<LeadStage, { bg: string; text: string; border: string }> = {
  new:                  { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  contacted:            { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  qualified:            { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  site_visit_scheduled: { bg: 'bg-violet-500/15', text: 'text-violet-400', border: 'border-violet-500/30' },
  site_visit_done:      { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  negotiation:          { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  booking:              { bg: 'bg-yellow-500/15', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  won:                  { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30' },
  lost:                 { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  junk:                 { bg: 'bg-neutral-500/15', text: 'text-neutral-400', border: 'border-neutral-500/30' },
}

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  site_visit_scheduled: 'Visit Scheduled',
  site_visit_done: 'Visit Done',
  negotiation: 'Negotiation',
  booking: 'Booking',
  won: 'Won',
  lost: 'Lost',
  junk: 'Junk',
}

export const QUALITY_COLORS: Record<LeadQuality, { bg: string; text: string }> = {
  hot:  { bg: 'bg-red-500/15', text: 'text-red-400' },
  warm: { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  cold: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  dead: { bg: 'bg-neutral-500/15', text: 'text-neutral-400' },
}

export const UNIT_STATUS_COLORS: Record<UnitStatus, string> = {
  available:    'bg-green-500',
  blocked:      'bg-amber-500',
  booked:       'bg-blue-500',
  sold:         'bg-red-500',
  not_released: 'bg-neutral-500',
}

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  available: 'Available',
  blocked: 'Blocked',
  booked: 'Booked',
  sold: 'Sold',
  not_released: 'Not Released',
}

export const BOOKING_STATUS_COLORS: Record<BookingStatus, { bg: string; text: string }> = {
  draft:             { bg: 'bg-neutral-500/15', text: 'text-neutral-400' },
  pending_approval:  { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  approved:          { bg: 'bg-green-500/15', text: 'text-green-400' },
  agreement_sent:    { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  agreement_signed:  { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  registered:        { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  cancelled:         { bg: 'bg-red-500/15', text: 'text-red-400' },
  refunded:          { bg: 'bg-orange-500/15', text: 'text-orange-400' },
}

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, { bg: string; text: string }> = {
  pending:  { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  received: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  verified: { bg: 'bg-green-500/15', text: 'text-green-400' },
  bounced:  { bg: 'bg-red-500/15', text: 'text-red-400' },
  refunded: { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  overdue:  { bg: 'bg-red-500/15', text: 'text-red-300' },
}

export const VISIT_STATUS_COLORS: Record<VisitStatus, { bg: string; text: string }> = {
  scheduled:   { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  confirmed:   { bg: 'bg-cyan-500/15', text: 'text-cyan-400' },
  completed:   { bg: 'bg-green-500/15', text: 'text-green-400' },
  cancelled:   { bg: 'bg-red-500/15', text: 'text-red-400' },
  no_show:     { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  rescheduled: { bg: 'bg-violet-500/15', text: 'text-violet-400' },
}

export const PRIORITY_COLORS: Record<FollowUpPriority, { bg: string; text: string }> = {
  low:    { bg: 'bg-neutral-500/15', text: 'text-neutral-400' },
  medium: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  high:   { bg: 'bg-amber-500/15', text: 'text-amber-400' },
  urgent: { bg: 'bg-red-500/15', text: 'text-red-400' },
}

export const EXPENSE_STATUS_COLORS: Record<ExpenseStatus, { bg: string; text: string }> = {
  draft:      { bg: 'bg-neutral-500/15', text: 'text-neutral-400' },
  submitted:  { bg: 'bg-amber-500/15',   text: 'text-amber-400' },
  approved:   { bg: 'bg-green-500/15',   text: 'text-green-400' },
  rejected:   { bg: 'bg-red-500/15',     text: 'text-red-400' },
  reimbursed: { bg: 'bg-blue-500/15',    text: 'text-blue-400' },
}

export const EXPENSE_STATUS_LABELS: Record<ExpenseStatus, string> = {
  draft:      'Draft',
  submitted:  'Pending Approval',
  approved:   'Approved',
  rejected:   'Rejected',
  reimbursed: 'Reimbursed',
}

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  marketing:            'Marketing',
  travel:               'Travel & Transport',
  client_entertainment: 'Client Entertainment',
  office:               'Office & Supplies',
  legal:                'Legal & Documentation',
  tech:                 'Technology',
  training:             'Training & Development',
  other:                'Other',
}

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'marketing',            label: 'Marketing' },
  { value: 'travel',               label: 'Travel & Transport' },
  { value: 'client_entertainment', label: 'Client Entertainment' },
  { value: 'office',               label: 'Office & Supplies' },
  { value: 'legal',                label: 'Legal & Documentation' },
  { value: 'tech',                 label: 'Technology' },
  { value: 'training',             label: 'Training & Development' },
  { value: 'other',                label: 'Other' },
]

export const LEAD_SOURCES: { value: string; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Referral' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'channel_partner', label: 'Channel Partner' },
  { value: 'property_portal', label: 'Property Portal' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'other', label: 'Other' },
]

export const LEAD_STAGES: { value: LeadStage; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'site_visit_scheduled', label: 'Visit Scheduled' },
  { value: 'site_visit_done', label: 'Visit Done' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'booking', label: 'Booking' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'junk', label: 'Junk' },
]

export const CRM_NAV = [
  { label: 'Dashboard',   href: '/crm/dashboard',    icon: 'LayoutDashboard' },
  { label: 'Leads',       href: '/crm/leads',        icon: 'Users' },
  { label: 'Properties',  href: '/crm/properties',   icon: 'Building2' },
  { label: 'Site Visits',  href: '/crm/visits',       icon: 'MapPin' },
  { label: 'Follow-ups',  href: '/crm/follow-ups',   icon: 'Clock' },
  { label: 'Bookings',    href: '/crm/bookings',     icon: 'FileCheck' },
  { label: 'Commissions', href: '/crm/commissions',  icon: 'IndianRupee' },
  { label: 'Expenses',    href: '/crm/expenses',     icon: 'Receipt' },
  { label: 'Settings',    href: '/crm/settings',     icon: 'Settings' },
] as const
