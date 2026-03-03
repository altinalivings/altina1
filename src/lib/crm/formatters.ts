import { formatDistanceToNow, format, isToday, isYesterday, isTomorrow, parseISO } from 'date-fns'

// Format currency in INR
export function formatINR(amount: number | null | undefined): string {
  if (amount == null) return '-'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format large amounts in lakhs/crores
export function formatINRCompact(amount: number | null | undefined): string {
  if (amount == null) return '-'
  if (amount >= 1_00_00_000) {
    return `${(amount / 1_00_00_000).toFixed(2)} Cr`
  }
  if (amount >= 1_00_000) {
    return `${(amount / 1_00_000).toFixed(2)} L`
  }
  return formatINR(amount)
}

// Format phone number for display
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '-'
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  return phone
}

// Relative time (e.g., "2 hours ago")
export function timeAgo(date: string | null | undefined): string {
  if (!date) return '-'
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true })
  } catch {
    return '-'
  }
}

// Format date for display
export function formatDate(date: string | null | undefined): string {
  if (!date) return '-'
  try {
    const d = parseISO(date)
    if (isToday(d)) return 'Today'
    if (isYesterday(d)) return 'Yesterday'
    if (isTomorrow(d)) return 'Tomorrow'
    return format(d, 'dd MMM yyyy')
  } catch {
    return '-'
  }
}

// Format date and time
export function formatDateTime(date: string | null | undefined): string {
  if (!date) return '-'
  try {
    const d = parseISO(date)
    if (isToday(d)) return `Today, ${format(d, 'h:mm a')}`
    if (isYesterday(d)) return `Yesterday, ${format(d, 'h:mm a')}`
    return format(d, 'dd MMM yyyy, h:mm a')
  } catch {
    return '-'
  }
}

// Format time
export function formatTime(time: string | null | undefined): string {
  if (!time) return '-'
  try {
    // If it's HH:mm or HH:mm:ss
    const [h, m] = time.split(':')
    const hour = parseInt(h, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const h12 = hour % 12 || 12
    return `${h12}:${m} ${ampm}`
  } catch {
    return time
  }
}

// Get user initials from name
export function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// Format percentage
export function formatPercent(value: number | null | undefined, decimals = 1): string {
  if (value == null) return '-'
  return `${value.toFixed(decimals)}%`
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Format enum values for display (snake_case -> Title Case)
export function formatEnumLabel(value: string): string {
  return value
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
