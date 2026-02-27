# 06 - API Contracts

All data access is via Supabase client SDK (no custom REST API). Below are the logical operations.

## Public Endpoints

### List Active Libraries
```typescript
// GET /libraries (public)
const { data } = await supabase
  .from('libraries')
  .select('*')
  .eq('is_active', true)
  .order('sort_order', { ascending: true });

// Response: Library[]
```

### Get Library by ID
```typescript
// GET /libraries/:id (public)
const { data } = await supabase
  .from('libraries')
  .select('*')
  .eq('id', id)
  .eq('is_active', true)
  .single();

// Response: Library | null
```

### Get App Config
```typescript
// GET /app_config (public)
const { data } = await supabase
  .from('app_config')
  .select('*')
  .eq('id', 'main')
  .single();

// Response: AppConfig
```

## Admin Endpoints (Authenticated)

### Create Library
```typescript
// POST /libraries (admin)
const { data } = await supabase
  .from('libraries')
  .insert(libraryData)
  .select()
  .single();
```

### Update Library
```typescript
// PATCH /libraries/:id (admin)
const { data } = await supabase
  .from('libraries')
  .update(updates)
  .eq('id', id)
  .select()
  .single();
```

### Delete Library
```typescript
// DELETE /libraries/:id (admin)
const { error } = await supabase
  .from('libraries')
  .delete()
  .eq('id', id);
```

### Upload Photo
```typescript
// POST /storage/library-photos (admin)
const { data } = await supabase.storage
  .from('library-photos')
  .upload(filePath, file);

// Returns: { path: string }
// Public URL: supabase.storage.from('library-photos').getPublicUrl(path)
```

### Update App Config
```typescript
// PATCH /app_config (admin)
const { data } = await supabase
  .from('app_config')
  .update({ whatsapp_number, whatsapp_template })
  .eq('id', 'main');
```

## WhatsApp Redirect (Client-side)
```typescript
function buildWhatsAppUrl(config: AppConfig, params: BookingParams): string {
  const message = config.whatsapp_template
    .replace('{name}', params.name)
    .replace('{library}', params.library)
    .replace('{date}', params.date)
    .replace('{shift}', params.shift);

  return `https://wa.me/${config.whatsapp_number}?text=${encodeURIComponent(message)}`;
}
```

## TypeScript Interfaces

```typescript
interface Library {
  id: string;
  name: string;
  address: string;
  pricing: Record<string, number>;
  shifts: string[];
  amenities: string[];
  photos: string[];
  google_maps_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AppConfig {
  id: string;
  whatsapp_number: string;
  whatsapp_template: string;
  updated_at: string;
}

interface BookingParams {
  name: string;
  library: string;
  date: string;
  shift: string;
}
```
