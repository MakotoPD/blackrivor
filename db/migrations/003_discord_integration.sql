ALTER TABLE notification_integration DROP CONSTRAINT IF EXISTS notification_integration_channel_check;
ALTER TABLE notification_integration ADD CONSTRAINT notification_integration_channel_check
  CHECK (channel IN ('email', 'whatsapp', 'telegram', 'discord', 'webhook'));

INSERT INTO notification_integration (channel)
VALUES ('discord')
ON CONFLICT (channel) DO NOTHING;
