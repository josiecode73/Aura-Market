# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **State**: Zustand (cart persisted to localStorage)
- **Animation**: Framer Motion
- **Routing**: Wouter

## Project: Aura Market

Japanese minimalist brand e-commerce website with Traditional Chinese (繁體中文) UI throughout.

### Features
- **Storefront (前台)**: Home, Shop, Product Detail, Cart, Checkout, Order History
- **Admin Backend (後台)**: Product Management, Order Management (separate layout & navigation)
- **Mock Payment**: No Stripe — checkout creates orders directly in DB, redirects with `?success=true`
- **8 Products**: All with AI-generated images, Chinese names/descriptions, NT$ pricing
- **Categories**: 服飾, 配件, 居家, 生活美學

### Color Scheme
- Primary: #355872
- Secondary: #7AAACE
- Accent: #9CD5FF
- Background: #F7F8F0
- Text: #30364F

### Key Design Decisions
- Frontend and admin have completely separate layouts (Layout.tsx vs AdminLayout.tsx)
- Admin navigation does not appear in customer-facing pages
- All UI text in Traditional Chinese
- Currency: NT$ (New Taiwan Dollar)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── aura-market/        # React + Vite frontend (storefront + admin)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; products, orders, checkout
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)

### `artifacts/aura-market` (`@workspace/aura-market`)

React + Vite frontend with shadcn/ui components. Japanese minimalist design with Traditional Chinese UI.

- Pages: Home, Shop, ProductDetail, Cart, Checkout, Orders, AdminProducts, AdminOrders, NotFound
- Layouts: `Layout.tsx` (customer), `AdminLayout.tsx` (admin)
- Store: `store/use-cart.ts` (Zustand with localStorage persistence)
- Product images: `public/images/`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Schema: products, orders, order_items.

- `src/schema/index.ts` — barrel re-export of all models
- Production migrations handled by Replit when publishing. Dev uses `pnpm --filter @workspace/db run push`.

### `lib/api-spec` (`@workspace/api-spec`)

OpenAPI 3.1 spec (`openapi.yaml`) + Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Run via `pnpm --filter @workspace/scripts run <script>`.
