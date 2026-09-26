CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS admin_user (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  name text NOT NULL DEFAULT 'Studio Admin',
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_session (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES admin_user(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  postcode text,
  vehicle_registration text,
  notes text,
  marketing_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS customer_email_unique ON customer (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS customer_search_idx ON customer (name, phone, vehicle_registration);

CREATE TABLE IF NOT EXISTS enquiry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customer(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  postcode text,
  vehicle text NOT NULL,
  registration text,
  service text NOT NULL,
  finish text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'booked', 'closed')),
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS enquiry_status_idx ON enquiry (status, created_at DESC);

CREATE TABLE IF NOT EXISTS booking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customer(id) ON DELETE SET NULL,
  title text NOT NULL,
  service text NOT NULL,
  vehicle text NOT NULL,
  registration text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'provisional' CHECK (status IN ('provisional', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  deposit_amount numeric(10,2) NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE INDEX IF NOT EXISTS booking_dates_idx ON booking (starts_at, ends_at);

CREATE SEQUENCE IF NOT EXISTS job_reference_seq START WITH 1001;

CREATE TABLE IF NOT EXISTS job (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('BR-' || nextval('job_reference_seq')),
  customer_id uuid REFERENCES customer(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES booking(id) ON DELETE SET NULL,
  title text NOT NULL,
  service text NOT NULL,
  vehicle text NOT NULL,
  registration text,
  status text NOT NULL DEFAULT 'lead' CHECK (status IN ('lead', 'quoted', 'approved', 'scheduled', 'in_progress', 'quality_check', 'complete', 'cancelled')),
  quoted_amount numeric(10,2),
  deposit_amount numeric(10,2) NOT NULL DEFAULT 0,
  due_date date,
  notes text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS job_status_idx ON job (status, due_date);

CREATE TABLE IF NOT EXISTS job_event (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_item (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  name text NOT NULL,
  colour text NOT NULL,
  finish text NOT NULL,
  sku text,
  roll_width_mm integer NOT NULL DEFAULT 1520 CHECK (roll_width_mm > 0),
  remaining_metres numeric(8,2) NOT NULL DEFAULT 0 CHECK (remaining_metres >= 0),
  reorder_level numeric(8,2) NOT NULL DEFAULT 5 CHECK (reorder_level >= 0),
  cost_per_metre numeric(8,2),
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS inventory_stock_idx ON inventory_item (remaining_metres, reorder_level);

CREATE TABLE IF NOT EXISTS newsletter_subscriber (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source text NOT NULL DEFAULT 'website',
  consent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_unique ON newsletter_subscriber (lower(email));

CREATE TABLE IF NOT EXISTS newsletter_campaign (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject text NOT NULL,
  preview_text text,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  scheduled_for timestamptz,
  sent_at timestamptz,
  recipient_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES admin_user(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE table_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['admin_user', 'customer', 'enquiry', 'booking', 'job', 'inventory_item', 'newsletter_subscriber', 'newsletter_campaign']
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I_updated_at ON %I', table_name, table_name);
    EXECUTE format('CREATE TRIGGER %I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()', table_name, table_name);
  END LOOP;
END;
$$;

