-- GitHub link label gains the contribution count (306+, verified by owner).
-- Plain targeted REPLACE; idempotent.

UPDATE portfolio_content SET
  data_json = REPLACE(data_json, '"label":"GitHub","url":"https://github.com/coqs"', '"label":"GitHub · 306+ contributions","url":"https://github.com/coqs"'),
  updated_at = '2026-08-09T00:00:00.000Z'
WHERE id = 1;
