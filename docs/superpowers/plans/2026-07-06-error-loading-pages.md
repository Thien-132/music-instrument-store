# 404/Error/Loading Pages & Page Transitions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add branded 404/error/loading pages to the Next.js storefront, plus a lightweight CSS-only page-transition effect, so navigation and failure states feel polished instead of blank/default.

**Architecture:** Use Next.js App Router's built-in file conventions (`not-found.tsx`, `error.tsx`, `loading.tsx`) at the root and at the `products`, `product/[id]`, and `admin` segments. Page transitions use `app/template.tsx` (which remounts on every navigation, unlike `layout.tsx`) combined with a CSS `@keyframes` fade-in defined in `globals.css`, following the existing custom-keyframe convention already in that file (`kenburns`, `pulse-slow`, `float-slow`).

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, `lucide-react` icons, existing `MusicLoading` component (`frontend/app/components/common/MusicLoading.tsx`).

**Spec:** `docs/superpowers/specs/2026-07-06-error-loading-pages-design.md`

## Global Constraints

- Tailwind CSS only; do not add raw CSS to `globals.css` beyond the one `@keyframes`/utility-class pair this plan adds (already justified in the spec since page transitions were explicitly requested).
- Preserve responsive classes (`sm:`, `md:`, `lg:`) on every new page.
- No new npm dependencies (no framer-motion/gsap). `lucide-react` is already a dependency.
- All copy is in Vietnamese, matching the rest of the app.
- Every new top-level element gets a `data-testid` attribute (see per-task steps) so this plan's verification steps can grep for it reliably instead of matching on visible copy text.
- Working directory for all commands below is `frontend/` unless stated otherwise.
- Dev server for manual/curl verification: `npm run dev -w @music-store/web` (run from repo root) serves on `http://localhost:3000`.
- Do not commit any temporary test file created purely for verification — delete it before the task's commit step.

---

### Task 1: Page transition (`template.tsx` + CSS fade-in)

**Files:**
- Modify: `frontend/app/globals.css` (append after the `.shimmer-button:hover::after` block, i.e. after line 148)
- Create: `frontend/app/template.tsx`

**Interfaces:**
- Produces: `.animate-page-in` Tailwind utility class (CSS only, no exported symbol) — implicitly applied to every route via `template.tsx`. No other task depends on this directly.

- [ ] **Step 1: Add the transition keyframes to `globals.css`**

Append this block immediately after the existing `.shimmer-button:hover::after { ... }` rule (currently ending around line 148), before the trailing blank lines:

```css
@keyframes page-fade-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-page-in {
  animation: page-fade-in 0.35s ease-out;
}
```

- [ ] **Step 2: Create `frontend/app/template.tsx`**

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
```

- [ ] **Step 3: Verify — start dev server, curl homepage, confirm the class is present**

Run from `frontend/`:

```bash
npm run dev -w @music-store/web >/tmp/dev-task1.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -s http://localhost:3000/ | grep -o "animate-page-in"
kill $DEV_PID
```

Expected: prints `animate-page-in` at least once (confirms the wrapper div rendered with the new class).

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: both exit with no errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/globals.css frontend/app/template.tsx
git commit -m "feat: add CSS page-transition fade-in via template.tsx"
```

---

### Task 2: `not-found.tsx` (404 page)

**Files:**
- Create: `frontend/app/not-found.tsx`

**Interfaces:**
- Consumes: none (uses only `next/link` and `lucide-react`, both already dependencies).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Create `frontend/app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main
      data-testid="not-found-page"
      className="min-h-screen flex flex-col items-center justify-center bg-surface-cream text-primary px-6 text-center transition-colors duration-300"
    >
      <Compass className="w-16 h-16 text-secondary animate-float-slow mb-6" strokeWidth={1.5} />
      <h1 className="font-serif text-6xl md:text-7xl mb-4">404</h1>
      <p className="font-serif text-2xl mb-2">Không tìm thấy trang</p>
      <p className="text-sm text-slate-500 dark:text-emerald-100/50 max-w-md mb-8">
        Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <button className="bg-primary hover:bg-primary-container text-white dark:bg-secondary dark:text-[#002B1F] dark:hover:bg-secondary-container px-6 py-3 rounded-xl transition-colors font-semibold">
            Về trang chủ
          </button>
        </Link>
        <Link href="/products">
          <button className="border border-border-subtle hover:bg-black/5 dark:hover:bg-white/5 px-6 py-3 rounded-xl transition-colors font-semibold">
            Xem sản phẩm
          </button>
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify — curl a non-existent route**

```bash
npm run dev -w @music-store/web >/tmp/dev-task2.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -s http://localhost:3000/khong-ton-tai-xyz | grep -o 'data-testid="not-found-page"'
kill $DEV_PID
```

Expected: prints `data-testid="not-found-page"`.

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: both pass.

- [ ] **Step 4: Commit**

```bash
git add frontend/app/not-found.tsx
git commit -m "feat: add branded 404 not-found page"
```

---

### Task 3: `error.tsx` (global error boundary)

**Files:**
- Create: `frontend/app/error.tsx`

**Interfaces:**
- Consumes: standard Next.js error-boundary props `{ error: Error & { digest?: string }; reset: () => void }` (supplied by the framework, not by another task).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Create `frontend/app/error.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      data-testid="error-page"
      className="min-h-screen flex flex-col items-center justify-center bg-surface-cream text-primary px-6 text-center transition-colors duration-300"
    >
      <AlertTriangle className="w-16 h-16 text-secondary mb-6" strokeWidth={1.5} />
      <h1 className="font-serif text-3xl md:text-4xl mb-2">Đã có lỗi xảy ra</h1>
      <p className="text-sm text-slate-500 dark:text-emerald-100/50 max-w-md mb-8">
        Rất tiếc, đã có lỗi xảy ra khi tải trang. Vui lòng thử lại.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary-container text-white dark:bg-secondary dark:text-[#002B1F] dark:hover:bg-secondary-container px-6 py-3 rounded-xl transition-colors font-semibold"
        >
          Thử lại
        </button>
        <Link href="/">
          <button className="border border-border-subtle hover:bg-black/5 dark:hover:bg-white/5 px-6 py-3 rounded-xl transition-colors font-semibold">
            Về trang chủ
          </button>
        </Link>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Create a temporary throwing page to verify the boundary catches it**

Create `frontend/app/(storefront)/__test-error__/page.tsx`:

```tsx
export default function TestErrorPage() {
  throw new Error("test error for error.tsx verification");
}
```

- [ ] **Step 3: Verify — curl the temporary route, then delete it**

```bash
npm run dev -w @music-store/web >/tmp/dev-task3.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -s http://localhost:3000/__test-error__ | grep -o 'data-testid="error-page"'
kill $DEV_PID
rm -rf "frontend/app/(storefront)/__test-error__"
```

Expected: prints `data-testid="error-page"` before the temp directory is removed.

- [ ] **Step 4: Confirm the temp file is gone and type-check/lint the real change**

```bash
git status --short frontend/app/(storefront)
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: `git status` shows nothing under `__test-error__` (it was untracked and deleted); tsc/lint pass.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/error.tsx
git commit -m "feat: add global error boundary page"
```

---

### Task 4: Root `loading.tsx`

**Files:**
- Create: `frontend/app/loading.tsx`

**Interfaces:**
- Consumes: `MusicLoading` from `frontend/app/components/common/MusicLoading.tsx` — signature `MusicLoading({ message?: string; height?: string; theme?: "dark" | "light" })`.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Create `frontend/app/loading.tsx`**

```tsx
import MusicLoading from "./components/common/MusicLoading";

export default function Loading() {
  return (
    <main
      data-testid="root-loading"
      className="min-h-screen flex items-center justify-center bg-surface-cream transition-colors duration-300"
    >
      <MusicLoading message="Đang tải..." height="200px" />
    </main>
  );
}
```

- [ ] **Step 2: Create a temporary slow route (no own `loading.tsx`) to prove it falls back to the root one**

Create `frontend/app/(storefront)/__test-loading__/page.tsx`:

```tsx
export default async function TestLoadingPage() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return <div>Loaded</div>;
}
```

- [ ] **Step 3: Verify — curl with a short timeout to catch the streamed fallback, then delete the temp route**

```bash
npm run dev -w @music-store/web >/tmp/dev-task4.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -sN --max-time 1 http://localhost:3000/__test-loading__ | grep -o 'data-testid="root-loading"'
kill $DEV_PID
rm -rf "frontend/app/(storefront)/__test-loading__"
```

Expected: prints `data-testid="root-loading"` (the streamed response returned within 1s still contains the Suspense fallback markup, since the real page is deliberately delayed 1.2s).

- [ ] **Step 4: Confirm cleanup and type-check/lint**

```bash
git status --short frontend/app/(storefront)
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: no leftover `__test-loading__`; tsc/lint pass.

- [ ] **Step 5: Commit**

```bash
git add frontend/app/loading.tsx
git commit -m "feat: add root loading fallback using MusicLoading"
```

---

### Task 5: `(storefront)/products/loading.tsx` (product grid skeleton)

**Files:**
- Create: `frontend/app/(storefront)/products/loading.tsx`
- Temporarily modify (revert before commit): `frontend/app/(storefront)/products/page.tsx`

**Interfaces:**
- Consumes: none (self-contained skeleton markup, no shared component).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Create `frontend/app/(storefront)/products/loading.tsx`**

Matches the real grid's container classes (`min-h-screen ... pt-16 md:pt-20` outer, `px-6 lg:px-24 py-16` section, `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8` grid) and the real `ProductCard`'s image aspect ratio (`paddingTop: 85%`) and container radius/border, from `frontend/app/components/product/ProductCard.tsx` and `ProductBrowserClient.tsx`:

```tsx
export default function Loading() {
  return (
    <main
      data-testid="products-loading"
      className="min-h-screen bg-surface-cream dark:bg-[#02140f] pt-16 md:pt-20 transition-colors duration-300"
    >
      <section className="px-6 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white dark:bg-[#06261d] rounded-2xl overflow-hidden border border-gray-100 dark:border-primary-container/20"
            >
              <div
                className="relative w-full bg-[#F3EFEA] dark:bg-[#031d16] animate-pulse"
                style={{ paddingTop: "85%" }}
              />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
                <div className="h-4 w-1/2 bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Temporarily add an artificial delay to the real page to force the fallback to appear**

In `frontend/app/(storefront)/products/page.tsx`, temporarily change:

```tsx
export default async function ProductsPage() {
  const { products, error } = await getProducts();
```

to:

```tsx
export default async function ProductsPage() {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const { products, error } = await getProducts();
```

- [ ] **Step 3: Verify — curl with a short timeout, then revert the temporary delay**

```bash
npm run dev -w @music-store/web >/tmp/dev-task5.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -sN --max-time 1 http://localhost:3000/products | grep -o 'data-testid="products-loading"'
kill $DEV_PID
```

Expected: prints `data-testid="products-loading"`.

Then revert step 2's edit in `frontend/app/(storefront)/products/page.tsx` (remove the added `await new Promise(...)` line) so the real page has no artificial delay.

- [ ] **Step 4: Confirm the page.tsx diff is clean and type-check/lint**

```bash
git diff --stat frontend/app/(storefront)/products/page.tsx
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: no diff on `page.tsx` (fully reverted); tsc/lint pass.

- [ ] **Step 5: Commit**

```bash
git add "frontend/app/(storefront)/products/loading.tsx"
git commit -m "feat: add product grid loading skeleton"
```

---

### Task 6: `(storefront)/product/[id]/loading.tsx` (product detail skeleton)

**Files:**
- Create: `frontend/app/(storefront)/product/[id]/loading.tsx`
- Temporarily modify (revert before commit): `frontend/app/(storefront)/product/[id]/page.tsx`

**Interfaces:**
- Consumes: none.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Create `frontend/app/(storefront)/product/[id]/loading.tsx`**

Matches the real detail page's container (`max-w-7xl mx-auto px-4 py-8`) and its two-column layout (`grid grid-cols-1 md:grid-cols-2 gap-10`, left image `aspect-square max-w-120`) from `frontend/app/(storefront)/product/[id]/ProductDetailClient.tsx`:

```tsx
export default function Loading() {
  return (
    <main data-testid="product-detail-loading" className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative w-full aspect-square max-w-120 bg-[#F3EFEA] dark:bg-[#031d16] rounded-2xl animate-pulse" />
        <div className="space-y-4 pt-2">
          <div className="h-8 w-3/4 bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
          <div className="h-6 w-1/3 bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
          <div className="h-4 w-full bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
          <div className="h-4 w-2/3 bg-border-subtle dark:bg-primary-container/30 rounded-lg animate-pulse" />
          <div className="h-12 w-48 bg-border-subtle dark:bg-primary-container/30 rounded-xl animate-pulse mt-6" />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Temporarily add an artificial delay to the real page**

In `frontend/app/(storefront)/product/[id]/page.tsx`, temporarily change:

```tsx
  const { id } = await params;
  const { product, error } = await getProduct(id);
```

to:

```tsx
  const { id } = await params;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const { product, error } = await getProduct(id);
```

- [ ] **Step 3: Verify — curl a known mock product id with a short timeout, then revert the delay**

`getProduct` falls back to mock data (`mock-1`) when no API is configured locally, so this id resolves without needing AWS credentials:

```bash
npm run dev -w @music-store/web >/tmp/dev-task6.log 2>&1 &
DEV_PID=$!
for i in $(seq 1 30); do curl -s -o /dev/null http://localhost:3000/ && break; sleep 1; done
curl -sN --max-time 1 http://localhost:3000/product/mock-1 | grep -o 'data-testid="product-detail-loading"'
kill $DEV_PID
```

Expected: prints `data-testid="product-detail-loading"`.

Then revert step 2's edit in `frontend/app/(storefront)/product/[id]/page.tsx` (remove the added `await new Promise(...)` line).

- [ ] **Step 4: Confirm the page.tsx diff is clean and type-check/lint**

```bash
git diff --stat "frontend/app/(storefront)/product/[id]/page.tsx"
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: no diff; tsc/lint pass.

- [ ] **Step 5: Commit**

```bash
git add "frontend/app/(storefront)/product/[id]/loading.tsx"
git commit -m "feat: add product detail loading skeleton"
```

---

### Task 7: `admin/loading.tsx`

**Files:**
- Create: `frontend/app/admin/loading.tsx`

**Interfaces:**
- Consumes: `MusicLoading` from `frontend/app/components/common/MusicLoading.tsx` (same signature as Task 4).
- Produces: nothing consumed by later tasks.

**Known limitation (documented, not a bug to fix here):** `frontend/app/admin/layout.tsx` is a Client Component that gates `{children}` behind a client-side `isAuthorized` state (starts `null`, resolved only after `useEffect` runs post-hydration via `fetchAuthSession()`). During SSR, `isAuthorized` is always `null`, so the layout renders its own "Đang kiểm tra quyền truy cập" `MusicLoading` branch and never reaches `{children}` — meaning this `admin/loading.tsx` Suspense fallback is unreachable via a plain curl/SSR request. It only ever appears client-side, during in-app navigation between admin pages after the user is already authorized (e.g. clicking from `/admin/orders` to `/admin/products`). Verification below is therefore limited to type-check/lint; there is no automated way to exercise this path without a logged-in Admin/Staff session.

- [ ] **Step 1: Create `frontend/app/admin/loading.tsx`**

```tsx
import MusicLoading from "../components/common/MusicLoading";

export default function Loading() {
  return (
    <div data-testid="admin-loading" className="w-full flex items-center justify-center py-24">
      <MusicLoading message="Đang tải dữ liệu..." height="300px" />
    </div>
  );
}
```

- [ ] **Step 2: Type-check and lint**

```bash
npx tsc --noEmit
npm run lint -w @music-store/web
```

Expected: both pass.

- [ ] **Step 3: Commit**

```bash
git add frontend/app/admin/loading.tsx
git commit -m "feat: add admin section loading fallback"
```

---

### Task 8: Final full verification

**Files:** none (verification only).

- [ ] **Step 1: Full lint, type-check, and production build**

```bash
npm run lint -w @music-store/web
npx tsc --noEmit
npm run build -w @music-store/web
```

Expected: all three succeed with no errors (the build step also confirms `not-found.tsx`/`error.tsx`/`loading.tsx` are picked up correctly by Next.js's route manifest).

- [ ] **Step 2: Confirm no leftover temp files from earlier tasks**

```bash
git status --short
```

Expected: only the files this plan intentionally created/modified across Tasks 1–7 are staged/committed; no `__test-error__` or `__test-loading__` directories remain.

- [ ] **Step 3: Manual smoke check (record result, no code change)**

With `npm run dev -w @music-store/web` running, open a browser to:
- `http://localhost:3000/khong-ton-tai-xyz` → confirm 404 page renders correctly in both light and dark theme (toggle via the theme switcher in the header).
- `http://localhost:3000/products` and `http://localhost:3000/product/mock-1` with network throttled (DevTools → Network → Slow 3G) → confirm skeletons appear before real content.
- Navigate between a few pages → confirm the fade-in transition runs smoothly without flicker on fast client-side navigations.

No commit for this step (observation only).
