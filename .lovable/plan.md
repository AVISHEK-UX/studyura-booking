

## Remove Admin Link from Mobile Menu

### Change
In `src/components/public/Header.tsx`, hide the "Admin" link on mobile by splitting it out of the shared `navLinks` block and only rendering it in the desktop nav.

### Implementation
- Move the Admin `<Link>` out of `navLinks`
- Render it only inside the desktop `<nav className="hidden md:flex ...">` section
- Mobile menu will show: Log In (or user dropdown) + List My Library — no Admin link

