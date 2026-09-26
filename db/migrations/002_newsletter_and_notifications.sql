ALTER TABLE newsletter_subscriber
  ADD COLUMN IF NOT EXISTS unsubscribe_token uuid NOT NULL DEFAULT gen_random_uuid();

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_unsubscribe_token_unique
  ON newsletter_subscriber (unsubscribe_token);

ALTER TABLE newsletter_campaign DROP CONSTRAINT IF EXISTS newsletter_campaign_status_check;
ALTER TABLE newsletter_campaign ADD CONSTRAINT newsletter_campaign_status_check
  CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled'));

CREATE TABLE IF NOT EXISTS newsletter_campaign_event (
  id bigserial PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES newsletter_campaign(id) ON DELETE CASCADE,
  user_id uuid REFERENCES admin_user(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('created', 'updated', 'scheduled', 'sent', 'cancelled')),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_campaign_event_date_idx
  ON newsletter_campaign_event (created_at DESC);

CREATE TABLE IF NOT EXISTS newsletter_delivery (
  id bigserial PRIMARY KEY,
  campaign_id uuid NOT NULL REFERENCES newsletter_campaign(id) ON DELETE CASCADE,
  subscriber_id uuid REFERENCES newsletter_subscriber(id) ON DELETE SET NULL,
  email text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS newsletter_delivery_campaign_idx
  ON newsletter_delivery (campaign_id, created_at DESC);

INSERT INTO newsletter_campaign_event (campaign_id, event_type, note)
SELECT id, 'created', 'Campaign imported from the existing campaign register'
FROM newsletter_campaign campaign
WHERE NOT EXISTS (
  SELECT 1 FROM newsletter_campaign_event event WHERE event.campaign_id = campaign.id
);

CREATE TABLE IF NOT EXISTS notification_integration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel text NOT NULL UNIQUE CHECK (channel IN ('email', 'whatsapp', 'telegram', 'webhook')),
  enabled boolean NOT NULL DEFAULT false,
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  secret_encrypted text,
  events text[] NOT NULL DEFAULT ARRAY['new_enquiry', 'low_stock']::text[],
  last_test_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_delivery (
  id bigserial PRIMARY KEY,
  integration_id uuid REFERENCES notification_integration(id) ON DELETE SET NULL,
  channel text NOT NULL,
  event_type text NOT NULL,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  message text NOT NULL,
  error text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notification_delivery_date_idx
  ON notification_delivery (created_at DESC);

INSERT INTO notification_integration (channel)
VALUES ('email'), ('whatsapp'), ('telegram'), ('webhook')
ON CONFLICT (channel) DO NOTHING;

DROP TRIGGER IF EXISTS notification_integration_updated_at ON notification_integration;
CREATE TRIGGER notification_integration_updated_at
  BEFORE UPDATE ON notification_integration
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
