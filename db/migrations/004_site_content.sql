-- Admin edits to homepage copy; missing keys fall back to defaults in shared/utils/siteContent.ts.
CREATE TABLE IF NOT EXISTS site_content (
  key text PRIMARY KEY,
  value text NOT NULL
);
