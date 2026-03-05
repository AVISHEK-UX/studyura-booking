

## Fix Pricing Inconsistency

### Investigation

I queried the database and found the actual stored pricing for "R.k Library" is `{"daily": 10, "monthly": 10}`. The card correctly shows ₹10. The detail page showing ₹100 / ₹1500 is likely stale cached data from a previous value.

### Root Cause

The pricing data in the database appears to be incorrect — it was likely updated to `10` by mistake when the intended values were `daily: 100` and `monthly: 1500`.

### Fix

**Update the database** — Set the correct pricing for R.k Library:
```sql
UPDATE libraries 
SET pricing = '{"daily": 100, "monthly": 1500}'::jsonb 
WHERE id = '35186b6d-fa41-45f1-ac42-b41920fd18fd';
```

This will make both the card and the detail page show the correct, consistent prices.

> **Note**: If the intended price really is ₹10, let me know and I will investigate a different root cause.

