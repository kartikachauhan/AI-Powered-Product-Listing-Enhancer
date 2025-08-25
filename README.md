# AI-Powered Product Listing Enhancer

   A small, clean, componentized web app where a merchant can upload a product, generate an AI-suggested description, edit it inline, and save the listing with a live preview.

   1. Left: Form (title, category, price, image) + Generate Description (spinner on button) + Edit Description (only after generation) + Save.

   2. Right: Preview only (live card; no editor).

   3. Listings: Minimal “My Listings” grid (title, thumbnail, price, short description).

## How to run it locally

## Prereqs: Node 18+ and npm (or yarn/pnpm).

   # 1. Install
   npm i

   # 2. Run dev server
   npm run dev
   # open the printed local URL

   # (Optional) Production build
   npm run build
   npm run preview

Stack: Vite + React + TypeScript + styled-components + react-hook-form + zod + Zustand.

# Project structure (high level)

   src/
   components/
      ProductForm/ProductForm.tsx        # Form + Generate + Editor (left pane)
      ProductPreview/ProductPreview.tsx  # Preview-only card (right pane)
      ListingsView/ListingsView.tsx      # Saved products grid
      common/Toast.tsx                   # Reusable toast
   store/
      productStore.ts                    # Zustand store (products, isGenerating, error/success)
   api/
      productApi.ts                      # (Optional) Real AI calls; mockable
   App.tsx                              # Page layout + wiring
   main.tsx                             # App bootstrap (theme, global styles, etc.)


# Design notes

   ## State management
      1. Zustand store (productStore.ts) holds:
         1. products[] (persisted to localStorage), isGenerating, error, success
         2. actions: generateDescriptionForProduct, addProductWithDescription, clearMessages, etc.

      2. Form state in ProductForm.tsx via react-hook-form + zod.

      3. The generated description lives in App.tsx and is passed to both the Form (for editing) and the Preview (for display), keeping a single source of truth for the description string.

   ## Component structure

      1. App.tsx – 2-column layout, wires store → form/preview, renders Toast for success/error, shows ListingsView below.

      2. ProductForm.tsx – inputs, Generate button (shows spinner while generating), Edit Description textarea (only after generation), and Save Listing.

      3. ProductPreview.tsx – preview-only card (title, category, price, image, description). Shows a gentle “Generating…” state inside the card while AI runs.

      4. ListingsView.tsx – shows saved products (title, thumbnail, category, price, clamped description).

      5. common/Toast.tsx – reusable toast with type, message, duration, position.

   ## Loading / Error / Empty

      1. Generate button is disabled until all required fields are present; shows an inline spinner + “Generating…” while running.

      2. error/success from the store are surfaced via the Toast (auto-dismiss).

      3. Preview and Listings show friendly empty states.

   ## Accessibility

      1. Labeled inputs, keyboard focusable actions, descriptive alt text for images, and screen-reader friendly toast (role="status", aria-live="polite").

# AI integration approach
   ##Option B (default): Mocked AI

      1. productStore.generateDescriptionForProduct() returns a parameterized canned response using the current form inputs (no network calls).

   ##Option A: Real AI API

      1. Implement a call in productApi.ts to your provider (OpenAI/others) and have the store use it.

      2. Suggested environment variables (example):
            VITE_USE_MOCK_AI=false
            AI_PROVIDER=openai
            OPENAI_API_KEY=sk-...

      3. The function should return:
            { description: string, meta?: { seoKeywords?: string[], language?: string } }

      4. Add basic retry/backoff and surface failures via error (Toast will display it).

   Images are stored as data URLs when saving (so the grid survives reloads without a backend). For production, upload to S3/Cloud Storage and store only the URL.

# Scaling plan (≤ 300 words)

   1. Data & storage. Move from localStorage to a backend (Postgres with Prisma, or DynamoDB). Store images in S3/Cloud Storage and persist only imageUrl. Add created/updated timestamps and indexes (merchant ID, category, title).

   2. API & concurrency. Expose REST/GraphQL with cursor-based pagination. Make description generation asynchronous: enqueue jobs (SQS/Cloud Tasks), and notify clients via WebSocket/SSE or client-side polling. Use idempotency keys and per-merchant rate limits.

   3. Performance. Virtualize long lists (react-window) and lazy-load responsive images. CDN static assets and images. Split bundles by route and prefetch on hover. Client cache with SWR/tanstack-query (stale-while-revalidate). Cache popular GETs at the edge.

   4. Reliability & cost. Add retries/backoff and circuit breakers around AI calls. Cache prompt→result pairs by hashing inputs to avoid re-billing. Gracefully degrade to a templated baseline copy if the AI provider is down.

   5. Security & multi-tenancy. AuthN (OAuth/JWT) and per-merchant AuthZ on records. Validate and sanitize inputs server-side. Signed upload URLs for images.

   6. Observability. Centralized logs, metrics (p95 latency, error rate, token spend), and traces. Feature flags to roll out new AI models/providers safely.

   7. DX & quality. Keep domain logic in the store; presentational components dumb. Add unit tests for store/actions and component tests for the form→preview flow. CI: typecheck, lint, tests, preview deploys. Document failure/empty/loading states and UX contracts.
