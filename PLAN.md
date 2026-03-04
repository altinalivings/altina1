# Implementation Plan: CRM Mobile App + CalleyApp Integration

## Phase 1: PWA — Make Web CRM Mobile-Friendly (Do First)

The web CRM already has responsive Tailwind classes (sm:/md:/lg:) on most pages. The main gap is the **sidebar navigation** — it's a permanent sidebar that doesn't work on mobile. We need a hamburger-driven drawer.

### 1.1 Mobile Navigation (Sidebar → Drawer)

**Files to modify:**
- `src/components/crm/layout/CrmSidebar.tsx` — Convert to a slide-out drawer on mobile
- `src/components/crm/layout/CrmTopbar.tsx` — Add hamburger menu button (visible on mobile only)
- `src/app/crm/layout.tsx` — Add shared state for mobile drawer open/close

**Changes:**
- Add a `MobileSidebarProvider` context (or lift state to layout) to control open/close
- Sidebar: On `md:` and up → stays as-is (permanent sidebar). On mobile → hidden by default, slides in as overlay with backdrop
- Topbar: Add `Menu` (hamburger) icon on the left, visible only on `md:hidden`
- Add swipe-to-close gesture support (optional, nice-to-have)

### 1.2 CRM-Specific PWA Manifest

**Files to create/modify:**
- `public/crm-manifest.json` — New manifest pointing `start_url` to `/crm/dashboard`
- `src/app/crm/layout.tsx` — Add `<link rel="manifest" href="/crm-manifest.json">` in metadata

**Manifest config:**
```json
{
  "name": "ALTINA CRM",
  "short_name": "CRM",
  "start_url": "/crm/dashboard",
  "display": "standalone",
  "background_color": "#0B0B0C",
  "theme_color": "#BF953F",
  "icons": [/* 192x192, 512x512 */]
}
```

### 1.3 Service Worker (Offline Shell)

**Files to create:**
- `public/crm-sw.js` — Simple service worker for app shell caching
- Register in `src/app/crm/layout.tsx` via a client component

**Scope:** Cache the CRM shell (layout, nav, CSS/JS bundles) so the app loads instantly. API calls remain network-first (CRM data must be live).

### 1.4 Mobile Touch Optimizations

**Files to audit/tweak:**
- All CRM pages — Ensure tap targets are ≥44px, tables scroll horizontally on small screens
- `src/components/crm/ui/DataTable.tsx` — Add horizontal scroll wrapper for mobile
- List pages (leads, properties, etc.) — Ensure filter bars stack vertically on mobile

---

## Phase 2: CalleyApp → CRM Lead Sync

**Architecture:** When a CalleyApp agent marks a contact disposition as "Interested", an API call is made to the ALTINA CRM to create a lead and assign it to the matching agent.

Two separate Supabase projects:
- CalleyApp: `nzmswjftdmjeejqzucak.supabase.co`
- ALTINA CRM: `sfioxdicvykagybxvore.supabase.co`

### 2.1 CRM API Endpoint — Receive Leads from CalleyApp

**File to create:**
- `src/app/crm/api/leads/from-callstation/route.ts`

**Behavior:**
1. Authenticates via a shared API key (`X-API-Key` header, stored in `.env.local` as `CALLSTATION_API_KEY`)
2. Receives contact data: `{ name, phone, email, notes, disposition, feedback, caller_email, campaign_name, call_duration, source }`
3. Looks up CRM agent by `caller_email` (matches CalleyApp user email → CRM profile email)
4. Creates a new lead in Supabase:
   - `source`: `"cold_call"`
   - `stage`: `"contacted"` (they already spoke to the person)
   - `quality`: `"warm"`
   - `assigned_to`: matched CRM agent ID (or admin fallback)
   - `notes`: call notes + feedback from CalleyApp
5. Creates a lead activity: "Lead synced from CallStation — disposition: Interested"
6. Returns `{ success: true, lead_id }`

**Deduplication:** Check if a lead with the same phone number already exists. If yes, update notes/activity instead of creating duplicate.

### 2.2 CalleyApp Integration Hook — Shared Package

**File to create:**
- `packages/shared/src/integrations/crm-sync.ts`

**Function:** `syncToCRM({ disposition, contact, callerEmail, campaignName, notes, feedback, callDuration })`

**Behavior:**
1. Check if disposition matches "Interested" (case-insensitive)
2. If yes, call the ALTINA CRM API endpoint with contact data
3. If API fails, log error but don't block the CalleyApp flow (fire-and-forget with retry)

**Config:** CRM API URL and key stored in CalleyApp `.env.local`:
```
CRM_API_URL=https://www.altinalivings.com/crm/api/leads/from-callstation
CRM_API_KEY=<shared-secret>
```

### 2.3 Hook into CalleyApp Disposition Flow

**Files to modify:**

**Mobile app** — `apps/mobile/hooks/useCallingSession.ts`
- After `calls.create()` and `campaigns.updateContactStatus()` succeed (around line 192)
- Call `syncToCRM()` if disposition is "Interested"

**Web app** — `apps/web/src/components/campaigns/campaign-detail.tsx`
- After `handleSubmitDisposition()` updates campaign_contacts (around line 320)
- Call `syncToCRM()` if disposition is "Interested"

### 2.4 Middleware Update

**File to modify:**
- `src/middleware.ts` — Add `/crm/api/leads/from-callstation` to public routes (it uses API key auth, not session auth)

---

## Phase 3: Expo Mobile App (Future — Plan Only)

This is a larger project to build after Phase 1 & 2 are working. High-level plan:

- New Expo project (can be standalone or added to CalleyApp monorepo)
- Shares the same ALTINA Supabase backend
- Tab navigation: Dashboard, Leads, Visits, Follow-ups, More (bookings, expenses, settings)
- Push notifications for follow-up reminders and new lead assignments
- Camera integration for site visit photos
- Location check-in for site visits

**Will plan in detail after Phase 1 & 2 are complete.**

---

## Execution Order

1. **Phase 1.1** — Mobile sidebar drawer (biggest UX impact)
2. **Phase 1.2** — CRM PWA manifest
3. **Phase 1.3** — Service worker
4. **Phase 1.4** — Mobile touch audit
5. **Phase 2.1** — CRM API endpoint for receiving leads
6. **Phase 2.2** — CalleyApp shared sync function
7. **Phase 2.3** — Hook into CalleyApp disposition flow
8. **Phase 2.4** — Middleware update
