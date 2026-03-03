'use client'

import {
  MessageSquare, Phone, Mail, Send, Calendar, Clock,
  ArrowRightLeft, UserPlus, FileText, CreditCard, Bot
} from 'lucide-react'
import type { ActivityType } from '@/types/crm'
import { timeAgo } from '@/lib/crm/formatters'

const ACTIVITY_ICONS: Record<ActivityType, { icon: typeof MessageSquare; color: string }> = {
  note:         { icon: MessageSquare, color: 'text-blue-400 bg-blue-500/15' },
  call:         { icon: Phone, color: 'text-green-400 bg-green-500/15' },
  email:        { icon: Mail, color: 'text-cyan-400 bg-cyan-500/15' },
  whatsapp:     { icon: Send, color: 'text-emerald-400 bg-emerald-500/15' },
  meeting:      { icon: Calendar, color: 'text-violet-400 bg-violet-500/15' },
  site_visit:   { icon: Calendar, color: 'text-purple-400 bg-purple-500/15' },
  follow_up:    { icon: Clock, color: 'text-amber-400 bg-amber-500/15' },
  stage_change: { icon: ArrowRightLeft, color: 'text-altina-gold bg-altina-gold/15' },
  assignment:   { icon: UserPlus, color: 'text-indigo-400 bg-indigo-500/15' },
  document:     { icon: FileText, color: 'text-pink-400 bg-pink-500/15' },
  payment:      { icon: CreditCard, color: 'text-emerald-400 bg-emerald-500/15' },
  system:       { icon: Bot, color: 'text-altina-muted bg-white/10' },
}

type TimelineItem = {
  id: string
  type: ActivityType
  title: string
  description?: string | null
  created_at: string
  creator?: { full_name: string } | null
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  if (!items.length) {
    return <p className="py-8 text-center text-sm text-altina-muted">No activity yet</p>
  }

  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const { icon: Icon, color } = ACTIVITY_ICONS[item.type] || ACTIVITY_ICONS.system
        return (
          <div key={item.id} className="relative flex gap-4 pb-6">
            {/* Vertical line */}
            {i < items.length - 1 && (
              <div className="absolute left-[17px] top-10 h-[calc(100%-24px)] w-px bg-white/10" />
            )}
            {/* Icon */}
            <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color}`}>
              <Icon size={16} />
            </div>
            {/* Content */}
            <div className="flex-1 pt-1">
              <p className="text-sm font-medium text-white">{item.title}</p>
              {item.description && (
                <p className="mt-0.5 text-sm text-altina-muted">{item.description}</p>
              )}
              <p className="mt-1 text-xs text-altina-muted/60">
                {timeAgo(item.created_at)}
                {item.creator?.full_name && ` by ${item.creator.full_name}`}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
