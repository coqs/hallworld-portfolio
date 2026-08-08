-- Fix private engagements dates: 2026, not 2025 (verified with owner).
-- 0003 was already applied to remote D1, so this is a targeted replace
-- on the live row. The Independent Developer entry legitimately stays
-- 2025 — Present (yafc created Sep 2025, tryon Dec 2025).

UPDATE portfolio_content SET
  data_json = REPLACE(data_json, '"organization":"Qatar & UAE — names withheld","dates":"2025 — Present"', '"organization":"Qatar & UAE — names withheld","dates":"2026 — Present"'),
  updated_at = '2026-08-09T00:00:00.000Z'
WHERE id = 1
  AND data_json LIKE '%"organization":"Qatar & UAE — names withheld","dates":"2025 — Present"%';
