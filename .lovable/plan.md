

## Plan: Speed Up App Loading

### Problem Analysis
The app feels slow because:
1. **No query caching** -- `QueryClient` has default settings (0ms staleTime), so every page navigation re-fetches data from the backend
2. **Hero slideshow loads 3 large JPGs eagerly** on every visit, blocking the page
3. **No Supabase connection pooling hint** -- the first request after idle always triggers a cold connection
4. **Admin login cold start** -- already has a hint but the underlying auth call is slow on first hit

### Changes

#### 1. Configure QueryClient with aggressive caching (src/App.tsx)
- Set `staleTime: 5 * 60 * 1000` (5 minutes) so library data is cached and pages load instantly on navigation
- Set `gcTime: 10 * 60 * 1000` (10 min garbage collection)
- This alone will make "See All" and back-navigation feel instant

#### 2. Optimize hero images (src/components/public/HeroSlideshow.tsx)
- Only load the first image eagerly; lazy-load the other two
- Add `fetchpriority="high"` to the first slide for faster LCP

#### 3. Prefetch libraries on app mount (src/App.tsx)
- Call `queryClient.prefetchQuery` for the libraries list so data is ready before the user even sees the page

#### 4. Add Supabase transform for image thumbnails (src/components/public/LibraryCard.tsx)
- Append `?width=400&quality=60` to Supabase storage URLs in the card grid to load smaller thumbnails instead of full-size images

### Technical Details

**src/App.tsx**
- Change `new QueryClient()` to include `defaultOptions.queries.staleTime = 300000` and `gcTime = 600000`
- Add a `prefetchQuery` call for `["libraries"]` using the same fetch function

**src/components/public/HeroSlideshow.tsx**
- First image: `loading="eager"`, `fetchpriority="high"`
- Other images: `loading="lazy"`

**src/components/public/LibraryCard.tsx**
- Create a helper `getThumbUrl(url)` that appends width/quality params for Supabase storage URLs
- Use it for the card thumbnail image

**src/components/public/OptimizedImage.tsx**
- Increase `rootMargin` from `200px` to `400px` to start loading images earlier during scroll

