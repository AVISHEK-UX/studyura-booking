# 05 - Database Schema

## Tables

### `libraries`
| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | UUID | PK, default gen_random_uuid() | Unique identifier |
| name | TEXT | NOT NULL | Library name |
| address | TEXT | NOT NULL | Full address |
| pricing | JSONB | NOT NULL, default '{}' | Pricing tiers (e.g., `{"monthly": 1500, "daily": 100}`) |
| shifts | JSONB | NOT NULL, default '[]' | Available shifts (e.g., `["Morning 6-12", "Afternoon 12-6", "Evening 6-12"]`) |
| amenities | TEXT[] | default '{}' | List of amenities (WiFi, AC, Power Backup, etc.) |
| photos | TEXT[] | default '{}' | Array of storage URLs |
| google_maps_url | TEXT | | Google Maps link |
| sort_order | INTEGER | NOT NULL, default 0 | Display order (ascending) |
| is_active | BOOLEAN | NOT NULL, default true | Visibility toggle |
| created_at | TIMESTAMPTZ | default now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | default now() | Last update timestamp |

### `app_config`
| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| id | TEXT | PK, default 'main' | Singleton key |
| whatsapp_number | TEXT | NOT NULL | WhatsApp number with country code |
| whatsapp_template | TEXT | NOT NULL | Message template with placeholders |
| updated_at | TIMESTAMPTZ | default now() | Last update timestamp |

**Default `whatsapp_template`:**
```
Hi, I'm {name}. I'd like to enquire about booking at {library} on {date} for the {shift} shift. Please confirm availability.
```

## Indexes
- `libraries` → index on `(is_active, sort_order)` for listing query
- `libraries` → index on `sort_order` for admin ordering

## RLS Policies

### `libraries`
| Policy | Action | Role | Condition |
|--------|--------|------|-----------|
| Public read | SELECT | anon, authenticated | `is_active = true` |
| Admin all | ALL | authenticated | `auth.role() = 'authenticated'` |

### `app_config`
| Policy | Action | Role | Condition |
|--------|--------|------|-----------|
| Public read | SELECT | anon, authenticated | true |
| Admin update | UPDATE | authenticated | `auth.role() = 'authenticated'` |
