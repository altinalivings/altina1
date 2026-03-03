'use client'

import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No data found',
  description = 'There are no items to display.',
  icon,
  action,
}: {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-altina-muted">
        {icon || <Inbox size={48} strokeWidth={1} />}
      </div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      <p className="mt-1 text-sm text-altina-muted">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
