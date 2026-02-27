# 07 - Monorepo Structure

Since the project is a single React + Vite application hosted on Lovable, the structure is a single-repo layout (not a traditional monorepo). Below is the recommended directory organization.

```
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── images/                    # Static images (logo, og-image)
│
├── src/
│   ├── main.tsx                   # Entry point
│   ├── App.tsx                    # Router + providers
│   ├── index.css                  # Design system tokens
│   ├── vite-env.d.ts
│   │
│   ├── assets/                    # Imported assets (ES6 modules)
│   │
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── public/                # Public-facing components
│   │   │   ├── LibraryCard.tsx
│   │   │   ├── LibraryGrid.tsx
│   │   │   ├── PhotoCarousel.tsx
│   │   │   ├── BookingForm.tsx
│   │   │   ├── AmenityBadge.tsx
│   │   │   └── Header.tsx
│   │   └── admin/                 # Admin components
│   │       ├── AdminSidebar.tsx
│   │       ├── LibraryForm.tsx
│   │       ├── LibraryTable.tsx
│   │       ├── PhotoUploader.tsx
│   │       └── SettingsForm.tsx
│   │
│   ├── pages/
│   │   ├── Index.tsx              # Public library listing
│   │   ├── LibraryDetail.tsx      # Library detail + booking
│   │   ├── NotFound.tsx
│   │   ├── admin/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LibraryEdit.tsx
│   │   │   └── Settings.tsx
│   │
│   ├── hooks/
│   │   ├── useLibraries.ts        # React Query hooks for libraries
│   │   ├── useAppConfig.ts        # React Query hook for config
│   │   └── use-mobile.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts               # Utility functions
│   │   ├── supabase.ts            # Supabase client
│   │   └── whatsapp.ts            # WhatsApp URL builder
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   │
│   └── test/
│       ├── setup.ts
│       └── example.test.ts
│
├── engineering/                   # Engineering documentation
│   ├── 01-product-requirements.md
│   ├── ...
│   └── 12-testing-strategy.md
│
├── tailwind.config.ts
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

## Key Conventions
- **Components**: PascalCase filenames, one component per file
- **Hooks**: camelCase with `use` prefix
- **Pages**: PascalCase, map 1:1 with routes
- **Types**: Centralized in `src/types/`
- **No barrel exports**: Direct imports for tree-shaking
