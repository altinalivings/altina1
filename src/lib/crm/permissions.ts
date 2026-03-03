export type Permission =
  // Leads
  | 'leads.view_own'
  | 'leads.view_team'
  | 'leads.view_all'
  | 'leads.create'
  | 'leads.edit_own'
  | 'leads.edit_all'
  | 'leads.delete'
  | 'leads.assign'
  | 'leads.bulk_assign'
  | 'leads.import'
  | 'leads.export'
  // Properties
  | 'properties.view'
  | 'properties.create'
  | 'properties.edit'
  | 'properties.delete'
  | 'properties.sync'
  // Units
  | 'units.view'
  | 'units.create'
  | 'units.edit'
  | 'units.block'
  | 'units.release'
  // Visits
  | 'visits.view_own'
  | 'visits.view_all'
  | 'visits.create'
  | 'visits.edit_own'
  | 'visits.edit_all'
  | 'visits.complete'
  // Follow-ups
  | 'followups.view_own'
  | 'followups.view_all'
  | 'followups.create'
  | 'followups.edit_own'
  | 'followups.edit_all'
  | 'followups.complete'
  // Bookings
  | 'bookings.view_own'
  | 'bookings.view_all'
  | 'bookings.create'
  | 'bookings.edit'
  | 'bookings.approve'
  | 'bookings.cancel'
  // Payments
  | 'payments.view_own'
  | 'payments.view_all'
  | 'payments.create'
  | 'payments.verify'
  // Commissions
  | 'commissions.view_own'
  | 'commissions.view_all'
  | 'commissions.approve'
  // Settings
  | 'settings.view'
  | 'settings.manage_users'
  | 'settings.manage_teams'
  // Dashboard
  | 'dashboard.view_own'
  | 'dashboard.view_all'

export type UserRole = 'admin' | 'manager' | 'agent' | 'channel_partner'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'leads.view_own', 'leads.view_team', 'leads.view_all', 'leads.create',
    'leads.edit_own', 'leads.edit_all', 'leads.delete', 'leads.assign',
    'leads.bulk_assign', 'leads.import', 'leads.export',
    'properties.view', 'properties.create', 'properties.edit', 'properties.delete', 'properties.sync',
    'units.view', 'units.create', 'units.edit', 'units.block', 'units.release',
    'visits.view_own', 'visits.view_all', 'visits.create', 'visits.edit_own', 'visits.edit_all', 'visits.complete',
    'followups.view_own', 'followups.view_all', 'followups.create', 'followups.edit_own', 'followups.edit_all', 'followups.complete',
    'bookings.view_own', 'bookings.view_all', 'bookings.create', 'bookings.edit', 'bookings.approve', 'bookings.cancel',
    'payments.view_own', 'payments.view_all', 'payments.create', 'payments.verify',
    'commissions.view_own', 'commissions.view_all', 'commissions.approve',
    'settings.view', 'settings.manage_users', 'settings.manage_teams',
    'dashboard.view_own', 'dashboard.view_all',
  ],
  manager: [
    'leads.view_own', 'leads.view_team', 'leads.create', 'leads.edit_own', 'leads.edit_all',
    'leads.assign', 'leads.bulk_assign', 'leads.import', 'leads.export',
    'properties.view', 'properties.create', 'properties.edit', 'properties.sync',
    'units.view', 'units.create', 'units.edit', 'units.block', 'units.release',
    'visits.view_own', 'visits.view_all', 'visits.create', 'visits.edit_own', 'visits.edit_all', 'visits.complete',
    'followups.view_own', 'followups.view_all', 'followups.create', 'followups.edit_own', 'followups.edit_all', 'followups.complete',
    'bookings.view_own', 'bookings.view_all', 'bookings.create', 'bookings.edit', 'bookings.approve',
    'payments.view_own', 'payments.view_all', 'payments.create', 'payments.verify',
    'commissions.view_own', 'commissions.view_all',
    'settings.view', 'settings.manage_teams',
    'dashboard.view_own', 'dashboard.view_all',
  ],
  agent: [
    'leads.view_own', 'leads.create', 'leads.edit_own',
    'properties.view',
    'units.view', 'units.block',
    'visits.view_own', 'visits.create', 'visits.edit_own', 'visits.complete',
    'followups.view_own', 'followups.create', 'followups.edit_own', 'followups.complete',
    'bookings.view_own', 'bookings.create',
    'payments.view_own', 'payments.create',
    'commissions.view_own',
    'settings.view',
    'dashboard.view_own',
  ],
  channel_partner: [
    'leads.view_own', 'leads.create',
    'properties.view',
    'units.view',
    'visits.view_own',
    'bookings.view_own',
    'payments.view_own',
    'commissions.view_own',
    'settings.view',
    'dashboard.view_own',
  ],
}

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? []
}
