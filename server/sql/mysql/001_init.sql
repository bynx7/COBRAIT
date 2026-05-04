CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role ENUM('admin', 'editor', 'viewer') NOT NULL DEFAULT 'viewer',
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY admin_users_email_unique_idx (email)
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  actor_user_id VARCHAR(36) NULL,
  action VARCHAR(255) NOT NULL,
  target_type VARCHAR(255) NOT NULL,
  target_id VARCHAR(255) NULL,
  details JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_admin_audit_logs_actor_user
    FOREIGN KEY (actor_user_id) REFERENCES admin_users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  company VARCHAR(255) NULL,
  subject VARCHAR(255) NULL,
  message TEXT NOT NULL,
  source_page VARCHAR(255) NULL,
  source_campaign VARCHAR(255) NULL,
  status ENUM('new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost', 'archived') NOT NULL DEFAULT 'new',
  assigned_to VARCHAR(36) NULL,
  internal_notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY contact_requests_status_idx (status, created_at),
  KEY contact_requests_email_idx (email),
  CONSTRAINT fk_contact_requests_assigned_to
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS call_bookings (
  id VARCHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  company VARCHAR(255) NULL,
  project_summary TEXT NULL,
  preferred_date DATE NULL,
  preferred_time VARCHAR(64) NULL,
  timezone VARCHAR(128) NULL,
  budget_range VARCHAR(128) NULL,
  service_interest VARCHAR(255) NULL,
  source_page VARCHAR(255) NULL,
  source_campaign VARCHAR(255) NULL,
  status ENUM('new', 'contacted', 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'new',
  assigned_to VARCHAR(36) NULL,
  meeting_url VARCHAR(500) NULL,
  meeting_at DATETIME NULL,
  internal_notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY call_bookings_status_idx (status, created_at),
  KEY call_bookings_email_idx (email),
  CONSTRAINT fk_call_bookings_assigned_to
    FOREIGN KEY (assigned_to) REFERENCES admin_users(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS site_content_entries (
  page_key VARCHAR(64) PRIMARY KEY,
  content JSON NOT NULL,
  updated_by VARCHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY site_content_entries_updated_at_idx (updated_at),
  CONSTRAINT fk_site_content_entries_updated_by
    FOREIGN KEY (updated_by) REFERENCES admin_users(id)
    ON DELETE SET NULL
);
