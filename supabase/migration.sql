-- ============================================================
-- ALTINA CRM Suite — Full Database Schema Migration
-- Fully idempotent: safe on fresh OR existing Supabase projects
-- Run this in Supabase SQL Editor
-- ============================================================

-- ===== ENUM TYPES =====

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'manager', 'agent', 'channel_partner');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_stage AS ENUM (
    'new', 'contacted', 'qualified', 'site_visit_scheduled', 'site_visit_done',
    'negotiation', 'booking', 'won', 'lost', 'junk'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_source AS ENUM (
    'website', 'google_ads', 'facebook', 'instagram', 'linkedin',
    'referral', 'walk_in', 'cold_call', 'channel_partner',
    'property_portal', 'whatsapp', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE lead_quality AS ENUM ('hot', 'warm', 'cold', 'dead');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE activity_type AS ENUM (
    'note', 'call', 'email', 'whatsapp', 'meeting', 'site_visit',
    'follow_up', 'stage_change', 'assignment', 'document', 'payment', 'system'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE unit_status AS ENUM ('available', 'blocked', 'booked', 'sold', 'not_released');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'draft', 'pending_approval', 'approved', 'agreement_sent',
    'agreement_signed', 'registered', 'cancelled', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE payment_status AS ENUM ('pending', 'received', 'verified', 'bounced', 'refunded', 'overdue');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE payment_mode AS ENUM ('cheque', 'rtgs_neft', 'upi', 'demand_draft', 'cash', 'card', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE visit_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show', 'rescheduled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE follow_up_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'invoice_raised', 'paid', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ===== TABLES =====
-- Strategy: CREATE TABLE IF NOT EXISTS (handles fresh installs)
--           ALTER TABLE ADD COLUMN IF NOT EXISTS (handles existing tables with different schema)

-- ── profiles ──
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT NOT NULL,
  full_name  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone      TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role       user_role NOT NULL DEFAULT 'agent';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active  BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_id    UUID;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS manager_id UUID;

CREATE INDEX IF NOT EXISTS idx_profiles_role    ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_manager ON profiles(manager_id);

-- ── teams ──
CREATE TABLE IF NOT EXISTS teams (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE teams ADD COLUMN IF NOT EXISTS manager_id UUID;

-- ── leads ──
CREATE TABLE IF NOT EXISTS leads (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email              TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS alternate_phone    TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS stage              lead_stage NOT NULL DEFAULT 'new';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS quality            lead_quality DEFAULT 'warm';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS score              INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source             lead_source DEFAULT 'website';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_detail      TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_min         NUMERIC(15,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget_max         NUMERIC(15,2);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_location TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS preferred_config   TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_type      TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_to        UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_at        TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_by        UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS channel_partner_id UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_id         TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_name       TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_source         TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_medium         TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_campaign       TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_term           TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS utm_content        TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gclid              TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fbclid             TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS msclkid            TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS landing_page       TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referrer           TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS session_id         TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ga_cid             TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS device_type        TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_contacted_at  TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS next_follow_up     TIMESTAMPTZ;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS follow_up_count    INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS site_visit_count   INTEGER DEFAULT 0;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS is_active          BOOLEAN DEFAULT true;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS lost_reason        TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes              TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS tags               TEXT[] DEFAULT '{}';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_by         UUID;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS form_mode          TEXT;

CREATE INDEX IF NOT EXISTS idx_leads_stage           ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_assigned        ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_phone           ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_email           ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created         ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_quality         ON leads(quality);
CREATE INDEX IF NOT EXISTS idx_leads_project         ON leads(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_channel_partner ON leads(channel_partner_id);

-- ── lead_activities ──
CREATE TABLE IF NOT EXISTS lead_activities (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS lead_id        UUID;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS type           activity_type;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS title          TEXT;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS description    TEXT;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS metadata       JSONB DEFAULT '{}';
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS old_stage      lead_stage;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS new_stage      lead_stage;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS call_duration  INTEGER;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS call_outcome   TEXT;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS follow_up_date TIMESTAMPTZ;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS is_completed   BOOLEAN DEFAULT false;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS completed_at   TIMESTAMPTZ;
ALTER TABLE lead_activities ADD COLUMN IF NOT EXISTS created_by     UUID;

CREATE INDEX IF NOT EXISTS idx_activities_lead     ON lead_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_type     ON lead_activities(type);

-- ── properties ──
CREATE TABLE IF NOT EXISTS properties (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS project_ref    TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer      TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS brand         TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS city          TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS state         TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sector        TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS micro_market  TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS location      TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS rera          TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS status        TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS possession    TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS launch_date   TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS configuration TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS typologies    TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS sizes         TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS land_area     TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS towers        INTEGER;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS floors        TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS total_units   TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_display TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_min     NUMERIC(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS price_max     NUMERIC(15,2);
ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities     TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS highlights    TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS overview      TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS hero_image    TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS gallery       TEXT[];
ALTER TABLE properties ADD COLUMN IF NOT EXISTS brochure_url  TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS video_url     TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS map_embed     TEXT;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS map_lat       DOUBLE PRECISION;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS map_lng       DOUBLE PRECISION;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_active     BOOLEAN DEFAULT true;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured   BOOLEAN DEFAULT false;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS synced_from_ts BOOLEAN DEFAULT false;

-- Add unique constraint on project_ref if not present
DO $$ BEGIN
  ALTER TABLE properties ADD CONSTRAINT properties_project_ref_key UNIQUE (project_ref);
EXCEPTION WHEN duplicate_table THEN NULL;
         WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_properties_project_ref ON properties(project_ref);
CREATE INDEX IF NOT EXISTS idx_properties_city        ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_developer   ON properties(developer);

-- ── units ──
CREATE TABLE IF NOT EXISTS units (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_number TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE units ADD COLUMN IF NOT EXISTS property_id     UUID;
ALTER TABLE units ADD COLUMN IF NOT EXISTS tower           TEXT;
ALTER TABLE units ADD COLUMN IF NOT EXISTS floor           INTEGER;
ALTER TABLE units ADD COLUMN IF NOT EXISTS configuration   TEXT;
ALTER TABLE units ADD COLUMN IF NOT EXISTS carpet_area     NUMERIC(10,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS super_area      NUMERIC(10,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS balcony_area    NUMERIC(10,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS facing          TEXT;
ALTER TABLE units ADD COLUMN IF NOT EXISTS status          unit_status NOT NULL DEFAULT 'available';
ALTER TABLE units ADD COLUMN IF NOT EXISTS base_price      NUMERIC(15,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS total_price     NUMERIC(15,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS plc             NUMERIC(15,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS floor_rise      NUMERIC(15,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS other_charges   NUMERIC(15,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS parking_charges NUMERIC(15,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS stamp_duty_pct  NUMERIC(5,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS gst_pct         NUMERIC(5,2);
ALTER TABLE units ADD COLUMN IF NOT EXISTS floor_plan_url  TEXT;
ALTER TABLE units ADD COLUMN IF NOT EXISTS booked_by_lead  UUID;
ALTER TABLE units ADD COLUMN IF NOT EXISTS blocked_by      UUID;
ALTER TABLE units ADD COLUMN IF NOT EXISTS blocked_until   TIMESTAMPTZ;
ALTER TABLE units ADD COLUMN IF NOT EXISTS notes           TEXT;

CREATE INDEX IF NOT EXISTS idx_units_property ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status   ON units(status);
CREATE INDEX IF NOT EXISTS idx_units_config   ON units(configuration);

-- ── site_visits ──
CREATE TABLE IF NOT EXISTS site_visits (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date DATE NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS lead_id          UUID;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS property_id      UUID;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS project_name     TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS scheduled_time   TIME;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS status           visit_status NOT NULL DEFAULT 'scheduled';
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS assigned_to      UUID;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS feedback         TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS rating           INTEGER;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS interested_units TEXT[];
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS next_action      TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS pickup_required  BOOLEAN DEFAULT false;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS pickup_location  TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS vehicle_details  TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS completed_at     TIMESTAMPTZ;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS cancelled_reason TEXT;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS rescheduled_from UUID;
ALTER TABLE site_visits ADD COLUMN IF NOT EXISTS created_by       UUID;

CREATE INDEX IF NOT EXISTS idx_visits_lead     ON site_visits(lead_id);
CREATE INDEX IF NOT EXISTS idx_visits_date     ON site_visits(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_visits_status   ON site_visits(status);
CREATE INDEX IF NOT EXISTS idx_visits_assigned ON site_visits(assigned_to);

-- ── follow_ups ──
CREATE TABLE IF NOT EXISTS follow_ups (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  due_date   TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS lead_id       UUID;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS type          activity_type NOT NULL DEFAULT 'follow_up';
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS description   TEXT;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS priority      follow_up_priority DEFAULT 'medium';
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS due_time      TIME;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS is_completed  BOOLEAN DEFAULT false;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS completed_at  TIMESTAMPTZ;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS completed_by  UUID;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS outcome       TEXT;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS assigned_to   UUID;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS reminder_at   TIMESTAMPTZ;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE follow_ups ADD COLUMN IF NOT EXISTS created_by    UUID;

CREATE INDEX IF NOT EXISTS idx_followups_lead     ON follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_followups_assigned ON follow_ups(assigned_to);

-- ── call_logs ──
CREATE TABLE IF NOT EXISTS call_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  called_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS lead_id      UUID;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS caller_id    UUID;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS direction    TEXT;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS duration     INTEGER;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS outcome      TEXT;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS notes        TEXT;
ALTER TABLE call_logs ADD COLUMN IF NOT EXISTS recording_url TEXT;

CREATE INDEX IF NOT EXISTS idx_calls_lead   ON call_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_caller ON call_logs(caller_id);
CREATE INDEX IF NOT EXISTS idx_calls_date   ON call_logs(called_at DESC);

-- ── bookings ──
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name      TEXT NOT NULL,
  buyer_phone     TEXT NOT NULL,
  agreement_value NUMERIC(15,2) NOT NULL DEFAULT 0,
  net_amount      NUMERIC(15,2) NOT NULL DEFAULT 0,
  total_payable   NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS booking_number     TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS lead_id            UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS property_id        UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS unit_id            UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS buyer_email        TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS buyer_pan          TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS buyer_aadhaar      TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS buyer_address      TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS co_applicant_name  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS co_applicant_pan   TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount           NUMERIC(15,2) DEFAULT 0;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS stamp_duty         NUMERIC(15,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS registration_fee   NUMERIC(15,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS gst_amount         NUMERIC(15,2);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS status             booking_status NOT NULL DEFAULT 'draft';
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS approved_by        UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS approved_at        TIMESTAMPTZ;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agreement_date     DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS agreement_doc_url  TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS registration_date  DATE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS sales_agent_id     UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS channel_partner_id UUID;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes              TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS created_by         UUID;

DO $$ BEGIN
  ALTER TABLE bookings ADD CONSTRAINT bookings_booking_number_key UNIQUE (booking_number);
EXCEPTION WHEN duplicate_table THEN NULL;
         WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_lead   ON bookings(lead_id);
CREATE INDEX IF NOT EXISTS idx_bookings_unit   ON bookings(unit_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);

-- ── payments ──
CREATE TABLE IF NOT EXISTS payments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone  TEXT NOT NULL,
  amount     NUMERIC(15,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS booking_id      UUID;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS due_date        DATE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS paid_date       DATE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS status          payment_status NOT NULL DEFAULT 'pending';
ALTER TABLE payments ADD COLUMN IF NOT EXISTS mode            payment_mode;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS transaction_ref TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS bank_name       TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS instrument_date DATE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_number  TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS receipt_url     TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_by     UUID;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS verified_at     TIMESTAMPTZ;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS bounce_reason   TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS notes           TEXT;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS created_by      UUID;

CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status  ON payments(status);

-- ── commissions ──
CREATE TABLE IF NOT EXISTS commissions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  earner_role       user_role NOT NULL DEFAULT 'agent',
  base_amount       NUMERIC(15,2) NOT NULL DEFAULT 0,
  commission_pct    NUMERIC(5,2)  NOT NULL DEFAULT 0,
  commission_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
  net_payable       NUMERIC(15,2) NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS booking_id        UUID;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS earner_id         UUID;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS gst_on_commission NUMERIC(15,2);
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS tds_deducted      NUMERIC(15,2);
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS status            commission_status NOT NULL DEFAULT 'pending';
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS approved_by       UUID;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS approved_at       TIMESTAMPTZ;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS paid_date         DATE;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS invoice_number    TEXT;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS invoice_url       TEXT;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS notes             TEXT;
ALTER TABLE commissions ADD COLUMN IF NOT EXISTS created_by        UUID;

CREATE INDEX IF NOT EXISTS idx_commissions_booking ON commissions(booking_id);
CREATE INDEX IF NOT EXISTS idx_commissions_earner  ON commissions(earner_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status  ON commissions(status);

-- ── notifications ──
CREATE TABLE IF NOT EXISTS notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  type       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS user_id     UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS body        TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS entity_type TEXT;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS entity_id   UUID;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read     BOOLEAN DEFAULT false;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS read_at     TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);


-- ===== FUNCTIONS & TRIGGERS =====

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON profiles;
DROP TRIGGER IF EXISTS set_updated_at ON leads;
DROP TRIGGER IF EXISTS set_updated_at ON properties;
DROP TRIGGER IF EXISTS set_updated_at ON units;
DROP TRIGGER IF EXISTS set_updated_at ON site_visits;
DROP TRIGGER IF EXISTS set_updated_at ON follow_ups;
DROP TRIGGER IF EXISTS set_updated_at ON bookings;
DROP TRIGGER IF EXISTS set_updated_at ON payments;
DROP TRIGGER IF EXISTS set_updated_at ON commissions;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON leads       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON properties  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON units       FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_visits FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON follow_ups  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON bookings    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON payments    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON commissions FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'agent'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-log lead stage changes
CREATE OR REPLACE FUNCTION log_lead_stage_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.stage IS DISTINCT FROM NEW.stage THEN
    INSERT INTO lead_activities (lead_id, type, title, old_stage, new_stage, created_by)
    VALUES (NEW.id, 'stage_change',
      'Stage changed from ' || OLD.stage || ' to ' || NEW.stage,
      OLD.stage, NEW.stage, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_lead_stage_change ON leads;
CREATE TRIGGER on_lead_stage_change
  AFTER UPDATE OF stage ON leads
  FOR EACH ROW EXECUTE FUNCTION log_lead_stage_change();

-- Auto-generate booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS TRIGGER AS $$
DECLARE seq INTEGER; year_str TEXT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(booking_number FROM 'BK-' || year_str || '-(\d+)') AS INTEGER)
  ), 0) + 1 INTO seq FROM bookings WHERE booking_number LIKE 'BK-' || year_str || '-%';
  NEW.booking_number := 'BK-' || year_str || '-' || LPAD(seq::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_booking_number ON bookings;
CREATE TRIGGER set_booking_number BEFORE INSERT ON bookings
  FOR EACH ROW WHEN (NEW.booking_number IS NULL)
  EXECUTE FUNCTION generate_booking_number();

-- Lead scoring
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_uuid UUID)
RETURNS INTEGER AS $$
DECLARE sc INTEGER := 0; lr leads%ROWTYPE; vc INTEGER; ac INTEGER;
BEGIN
  SELECT * INTO lr FROM leads WHERE id = lead_uuid;
  IF NOT FOUND THEN RETURN 0; END IF;
  IF lr.email IS NOT NULL AND lr.email != '' THEN sc := sc + 5; END IF;
  IF lr.budget_min IS NOT NULL THEN sc := sc + 10; END IF;
  IF lr.budget_max IS NOT NULL THEN sc := sc + 5;  END IF;
  IF lr.source IN ('google_ads', 'referral') THEN sc := sc + 15; END IF;
  IF lr.source IN ('facebook', 'instagram')  THEN sc := sc + 10; END IF;
  IF lr.source = 'walk_in'                   THEN sc := sc + 20; END IF;
  SELECT COUNT(*) INTO vc FROM site_visits WHERE lead_id = lead_uuid AND status = 'completed';
  sc := sc + (vc * 15);
  SELECT COUNT(*) INTO ac FROM lead_activities WHERE lead_id = lead_uuid;
  sc := sc + LEAST(ac * 2, 20);
  CASE lr.stage
    WHEN 'qualified'       THEN sc := sc + 10;
    WHEN 'site_visit_done' THEN sc := sc + 20;
    WHEN 'negotiation'     THEN sc := sc + 30;
    WHEN 'booking'         THEN sc := sc + 40;
    ELSE NULL;
  END CASE;
  RETURN LEAST(sc, 100);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ===== ROW LEVEL SECURITY =====

ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams           ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads           ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties      ENABLE ROW LEVEL SECURITY;
ALTER TABLE units           ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_visits     ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups      ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs       ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── Policies ──

DROP POLICY IF EXISTS profiles_select       ON profiles;
DROP POLICY IF EXISTS profiles_update_own   ON profiles;
DROP POLICY IF EXISTS profiles_admin_update ON profiles;
DROP POLICY IF EXISTS profiles_admin_insert ON profiles;
CREATE POLICY profiles_select       ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update_own   ON profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY profiles_admin_update ON profiles FOR UPDATE USING (is_admin_or_manager());
CREATE POLICY profiles_admin_insert ON profiles FOR INSERT WITH CHECK (is_admin_or_manager());

DROP POLICY IF EXISTS teams_select ON teams;
DROP POLICY IF EXISTS teams_admin  ON teams;
CREATE POLICY teams_select ON teams FOR SELECT USING (true);
CREATE POLICY teams_admin  ON teams FOR ALL    USING (is_admin_or_manager());

DROP POLICY IF EXISTS leads_admin        ON leads;
DROP POLICY IF EXISTS leads_manager      ON leads;
DROP POLICY IF EXISTS leads_agent_select ON leads;
DROP POLICY IF EXISTS leads_agent_update ON leads;
DROP POLICY IF EXISTS leads_agent_insert ON leads;
DROP POLICY IF EXISTS leads_cp_select    ON leads;
DROP POLICY IF EXISTS leads_cp_insert    ON leads;
CREATE POLICY leads_admin ON leads FOR ALL USING (get_user_role() = 'admin');
CREATE POLICY leads_manager ON leads FOR ALL
  USING (get_user_role() = 'manager' AND (
    assigned_to IN (SELECT id FROM profiles WHERE manager_id = auth.uid())
    OR assigned_to = auth.uid() OR assigned_to IS NULL
  ));
CREATE POLICY leads_agent_select ON leads FOR SELECT
  USING (get_user_role() = 'agent' AND (assigned_to = auth.uid() OR created_by = auth.uid()));
CREATE POLICY leads_agent_update ON leads FOR UPDATE
  USING (get_user_role() = 'agent' AND assigned_to = auth.uid());
CREATE POLICY leads_agent_insert ON leads FOR INSERT
  WITH CHECK (get_user_role() IN ('agent', 'manager', 'admin'));
CREATE POLICY leads_cp_select ON leads FOR SELECT
  USING (get_user_role() = 'channel_partner' AND channel_partner_id = auth.uid());
CREATE POLICY leads_cp_insert ON leads FOR INSERT
  WITH CHECK (get_user_role() = 'channel_partner');

DROP POLICY IF EXISTS activities_select ON lead_activities;
DROP POLICY IF EXISTS activities_insert ON lead_activities;
CREATE POLICY activities_select ON lead_activities FOR SELECT
  USING (lead_id IS NULL OR EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_activities.lead_id));
CREATE POLICY activities_insert ON lead_activities FOR INSERT
  WITH CHECK (lead_id IS NULL OR EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_activities.lead_id));

DROP POLICY IF EXISTS properties_select ON properties;
DROP POLICY IF EXISTS properties_modify ON properties;
CREATE POLICY properties_select ON properties FOR SELECT USING (true);
CREATE POLICY properties_modify ON properties FOR ALL    USING (is_admin_or_manager());

DROP POLICY IF EXISTS units_select       ON units;
DROP POLICY IF EXISTS units_modify       ON units;
DROP POLICY IF EXISTS units_agent_update ON units;
CREATE POLICY units_select       ON units FOR SELECT USING (true);
CREATE POLICY units_modify       ON units FOR ALL    USING (is_admin_or_manager());
CREATE POLICY units_agent_update ON units FOR UPDATE USING (get_user_role() = 'agent');

DROP POLICY IF EXISTS visits_admin        ON site_visits;
DROP POLICY IF EXISTS visits_agent        ON site_visits;
DROP POLICY IF EXISTS visits_agent_insert ON site_visits;
DROP POLICY IF EXISTS visits_agent_update ON site_visits;
DROP POLICY IF EXISTS visits_cp           ON site_visits;
CREATE POLICY visits_admin ON site_visits FOR ALL USING (is_admin_or_manager());
CREATE POLICY visits_agent ON site_visits FOR SELECT
  USING (get_user_role() = 'agent' AND (assigned_to = auth.uid() OR created_by = auth.uid()));
CREATE POLICY visits_agent_insert ON site_visits FOR INSERT WITH CHECK (get_user_role() = 'agent');
CREATE POLICY visits_agent_update ON site_visits FOR UPDATE
  USING (get_user_role() = 'agent' AND assigned_to = auth.uid());
CREATE POLICY visits_cp ON site_visits FOR SELECT
  USING (get_user_role() = 'channel_partner'
    AND lead_id IN (SELECT id FROM leads WHERE channel_partner_id = auth.uid()));

DROP POLICY IF EXISTS followups_admin        ON follow_ups;
DROP POLICY IF EXISTS followups_agent_select ON follow_ups;
DROP POLICY IF EXISTS followups_agent_insert ON follow_ups;
DROP POLICY IF EXISTS followups_agent_update ON follow_ups;
CREATE POLICY followups_admin        ON follow_ups FOR ALL    USING (is_admin_or_manager());
CREATE POLICY followups_agent_select ON follow_ups FOR SELECT USING (get_user_role() = 'agent' AND assigned_to = auth.uid());
CREATE POLICY followups_agent_insert ON follow_ups FOR INSERT WITH CHECK (get_user_role() = 'agent');
CREATE POLICY followups_agent_update ON follow_ups FOR UPDATE USING (get_user_role() = 'agent' AND assigned_to = auth.uid());

DROP POLICY IF EXISTS calls_admin        ON call_logs;
DROP POLICY IF EXISTS calls_agent        ON call_logs;
DROP POLICY IF EXISTS calls_agent_insert ON call_logs;
CREATE POLICY calls_admin        ON call_logs FOR ALL    USING (is_admin_or_manager());
CREATE POLICY calls_agent        ON call_logs FOR SELECT USING (get_user_role() = 'agent' AND caller_id = auth.uid());
CREATE POLICY calls_agent_insert ON call_logs FOR INSERT WITH CHECK (get_user_role() IN ('agent', 'manager', 'admin'));

DROP POLICY IF EXISTS bookings_admin        ON bookings;
DROP POLICY IF EXISTS bookings_agent        ON bookings;
DROP POLICY IF EXISTS bookings_agent_insert ON bookings;
DROP POLICY IF EXISTS bookings_cp           ON bookings;
CREATE POLICY bookings_admin        ON bookings FOR ALL    USING (is_admin_or_manager());
CREATE POLICY bookings_agent        ON bookings FOR SELECT
  USING (get_user_role() = 'agent' AND (sales_agent_id = auth.uid() OR created_by = auth.uid()));
CREATE POLICY bookings_agent_insert ON bookings FOR INSERT WITH CHECK (get_user_role() = 'agent');
CREATE POLICY bookings_cp           ON bookings FOR SELECT
  USING (get_user_role() = 'channel_partner' AND channel_partner_id = auth.uid());

DROP POLICY IF EXISTS payments_admin        ON payments;
DROP POLICY IF EXISTS payments_agent        ON payments;
DROP POLICY IF EXISTS payments_agent_insert ON payments;
DROP POLICY IF EXISTS payments_cp           ON payments;
CREATE POLICY payments_admin ON payments FOR ALL USING (is_admin_or_manager());
CREATE POLICY payments_agent ON payments FOR SELECT
  USING (get_user_role() = 'agent'
    AND booking_id IN (SELECT id FROM bookings WHERE sales_agent_id = auth.uid() OR created_by = auth.uid()));
CREATE POLICY payments_agent_insert ON payments FOR INSERT WITH CHECK (get_user_role() = 'agent');
CREATE POLICY payments_cp ON payments FOR SELECT
  USING (get_user_role() = 'channel_partner'
    AND booking_id IN (SELECT id FROM bookings WHERE channel_partner_id = auth.uid()));

DROP POLICY IF EXISTS commissions_admin ON commissions;
DROP POLICY IF EXISTS commissions_own   ON commissions;
CREATE POLICY commissions_admin ON commissions FOR ALL    USING (is_admin_or_manager());
CREATE POLICY commissions_own   ON commissions FOR SELECT USING (earner_id = auth.uid());

DROP POLICY IF EXISTS notifications_own ON notifications;
CREATE POLICY notifications_own ON notifications FOR ALL USING (user_id = auth.uid());
