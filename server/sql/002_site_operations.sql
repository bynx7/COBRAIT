CREATE TABLE IF NOT EXISTS contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subject text,
  message text NOT NULL,
  source_page text,
  source_campaign text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'archived')),
  assigned_to uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_requests_status_idx
  ON contact_requests (status, created_at DESC);

CREATE INDEX IF NOT EXISTS contact_requests_email_idx
  ON contact_requests (lower(email));

DROP TRIGGER IF EXISTS contact_requests_set_updated_at ON contact_requests;

CREATE TRIGGER contact_requests_set_updated_at
BEFORE UPDATE ON contact_requests
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS call_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  project_summary text,
  preferred_date date,
  preferred_time text,
  timezone text,
  budget_range text,
  service_interest text,
  source_page text,
  source_campaign text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  assigned_to uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  meeting_url text,
  meeting_at timestamptz,
  internal_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS call_bookings_status_idx
  ON call_bookings (status, created_at DESC);

CREATE INDEX IF NOT EXISTS call_bookings_email_idx
  ON call_bookings (lower(email));

DROP TRIGGER IF EXISTS call_bookings_set_updated_at ON call_bookings;

CREATE TRIGGER call_bookings_set_updated_at
BEFORE UPDATE ON call_bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Queries uteis para o backoffice
-- SELECT * FROM contact_requests WHERE status = 'new' ORDER BY created_at DESC;
-- SELECT * FROM call_bookings WHERE status = 'new' ORDER BY created_at DESC;
-- UPDATE call_bookings SET status = 'contacted', internal_notes = 'Cliente contactado por email' WHERE id = 'UUID_AQUI';
-- UPDATE contact_requests SET assigned_to = 'UUID_DO_ADMIN', status = 'qualified' WHERE id = 'UUID_AQUI';
