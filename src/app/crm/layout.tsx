import { createServerSupabase } from '@/lib/supabase/server'
import CrmSidebar from '@/components/crm/layout/CrmSidebar'
import CrmTopbar from '@/components/crm/layout/CrmTopbar'
import { Toaster } from 'react-hot-toast'
import type { Profile } from '@/types/crm'

export const metadata = {
  title: 'ALTINA CRM',
  description: 'ALTINA Livings CRM Suite',
}

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  // No user — render children directly (login page has its own UI, no sidebar needed)
  // Middleware handles redirecting unauthenticated users away from protected routes
  if (!user) {
    return <>{children}</>
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-[#0B0B0C] text-white">
      <CrmSidebar profile={profile as Profile | null} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <CrmTopbar profile={profile as Profile | null} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A1A1C',
            color: '#F7F7F5',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </div>
  )
}
