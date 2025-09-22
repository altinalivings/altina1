'use client';

export default function DebugAnalytics() {
  const lead = (mode: string, label: string, project = '') => {
    window.altinaTrack?.lead?.({ mode, label, project, value: 1 });
  };
  const contact = (label: string, project = '') => {
    window.altinaTrack?.contact?.({ label, project, value: 1 });
  };
  const rawGA = () => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
  event_category: 'engagement',
  event_label: payload?.label || payload?.mode || 'lead',
  value: payload?.value || 1,
        debug_mode: true,
      });
	  
      console.log('[debug] manual gtag generate_lead fired');
    } else {
      console.warn('[debug] gtag not available');
    }
  };

  const Btn = (p: any) => (
    <button
      {...p}
      className="rounded-lg border border-white/20 px-4 py-2 hover:bg-white/5"
    />
  );

  return (
    <main className="mx-auto max-w-xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Analytics Debug</h1>
      <p className="text-sm text-neutral-300">
        Open GA4 → Reports → Realtime, then click any button below to see events within seconds.
      </p>
      <div className="grid gap-3">
        <Btn onClick={() => lead('callback', '/debug-analytics', 'General Enquiry')}>
          Fire generate_lead (callback)
        </Btn>
        <Btn onClick={() => lead('visit', '/debug-analytics', 'M3M Crown')}>
          Fire generate_lead (visit)
        </Btn>
        <Btn onClick={() => contact('/debug-analytics', 'General Enquiry')}>
          Fire contact
        </Btn>
        <Btn onClick={rawGA}>Fire GA4 manually (generate_lead)</Btn>
      </div>
      <p className="text-xs text-neutral-500">
        Check your browser console for <code>[analytics]</code> logs and GA4 Realtime for event names.
      </p>
    </main>
  );
}
