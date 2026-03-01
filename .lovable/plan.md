

## Splash Screen with Logo

### What will happen
A professional splash screen will appear for ~2.5 seconds when the app first loads, showing the uploaded green "S" hexagon logo centered on a dark background with a smooth fade-in animation, a subtle pulse glow effect, and the "StudySpot" brand name. After the duration, it will smoothly fade out and reveal the home screen.

### Technical approach

**1. Copy the logo to the project**
- Copy `user-uploads://logo.png` to `src/assets/logo.png`

**2. Create a `SplashScreen` component** (`src/components/SplashScreen.tsx`)
- Full-screen overlay with a dark background (matching the app's `--foreground` color)
- Centered logo image with a scale + fade-in entrance animation
- "StudySpot" text below the logo with a delayed fade-in
- After ~2.5 seconds, the entire splash fades out over 0.5s
- Uses `useState` + `useEffect` with a timer to control visibility
- Once the fade-out animation completes, the component unmounts entirely

**3. Update `App.tsx`**
- Import and render `<SplashScreen />` alongside the existing app content
- The splash renders as a fixed overlay on top of everything, then disappears

**4. Add splash keyframe animations to `src/index.css`**
- `splashFadeIn`: opacity 0 to 1 + scale up
- `splashFadeOut`: opacity 1 to 0
- `splashPulse`: subtle glow pulse on the logo

No other files will be touched.

