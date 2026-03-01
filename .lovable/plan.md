

## Add Location-Based Library Filtering

Use the browser's Geolocation API to detect the user's city and automatically filter libraries to their location -- similar to the OYO-style location prompt in the screenshot.

### What Changes

**1. Create `src/components/public/LocationPrompt.tsx`**
- A modal/dialog that appears on first visit asking "Allow studyura to access your location?"
- Shows a location pin icon and two buttons: "Allow Location" and "Skip"
- Styled with the green theme, rounded card, clean layout (inspired by the OYO screenshot)
- Uses `navigator.geolocation.getCurrentPosition()` to get lat/lng
- Reverse geocodes coordinates to a city name using a free API (Nominatim/OpenStreetMap -- no API key needed)
- Stores the user's choice in localStorage so the prompt only shows once per device

**2. Create `src/hooks/useUserLocation.ts`**
- Custom hook that manages location state (city name, loading, error)
- Checks localStorage for a previously detected city
- Exposes `requestLocation()` to trigger the geolocation flow
- Returns `{ city, loading, requestLocation, clearLocation }`

**3. Update `src/pages/Index.tsx`**
- Import and use the `useUserLocation` hook
- Show the `LocationPrompt` dialog if no location has been set yet
- Auto-set the city filter (`selectedCity`) when location is detected
- Add a small "Near me" chip/button next to the location dropdown so users can re-trigger location detection

### Technical Details

- Reverse geocoding via `https://nominatim.openstreetmap.org/reverse?lat=...&lon=...&format=json` (free, no key)
- The detected city is matched against available library cities (case-insensitive); if no match, show all libraries with a note
- localStorage key: `studyura_user_city`
- No database changes needed -- libraries already have a `city` column
- The prompt only appears once; users can change location anytime via the "Where" dropdown
- Graceful fallback: if user denies permission or geocoding fails, just show all libraries

