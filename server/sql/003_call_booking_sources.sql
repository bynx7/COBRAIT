ALTER TABLE call_bookings
  ADD COLUMN IF NOT EXISTS source_page text;

ALTER TABLE call_bookings
  ADD COLUMN IF NOT EXISTS source_campaign text;
