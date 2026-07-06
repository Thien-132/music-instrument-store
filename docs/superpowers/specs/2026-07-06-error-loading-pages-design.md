# Thiết kế: Trang 404/500, Loading states & Hiệu ứng chuyển trang

**Ngày:** 2026-07-06
**Nhánh:** `feat/error-loading-pages` (từ `dev`)
**Trạng thái:** Approved — sẵn sàng lập implementation plan

## Bối cảnh

Dự án là Next.js 16 (App Router) cho "Aureate Forest" — cửa hàng saxophone cao cấp.
Hiện chưa có `not-found.tsx`, `error.tsx`, `loading.tsx` nào trong `frontend/app`.
Đã có sẵn component branded loading: `frontend/app/components/common/MusicLoading.tsx`
(soundwave loader màu vàng đồng, dùng font `--font-sans`).

Ràng buộc quan trọng (`frontend/CLAUDE.md`):
- Chỉ dùng Tailwind CSS. Không thêm raw CSS/global style vào `globals.css` trừ khi
  được yêu cầu rõ ràng — hiệu ứng chuyển trang trong spec này đã được yêu cầu rõ nên
  được phép thêm `@keyframes` mới, theo đúng convention đã có sẵn trong
  `globals.css` (xem `kenburns`, `pulse-slow`, `float-slow`, `shimmer-button`).
- Giữ responsive (`sm:`, `md:`, `lg:`).
- Không thêm dependency mới (không dùng framer-motion) — dùng CSS/Tailwind thuần
  và Next.js `template.tsx` để tạo hiệu ứng chuyển trang.

Theme màu dùng token có sẵn trong `globals.css` (`bg-surface-cream`, `text-primary`,
`bg-primary`, `text-secondary`, `border-subtle`, ...), font `Playfair Display`
(`--font-serif`) cho heading, `Inter` (`--font-sans`) cho body.

## Phạm vi

Tạo các file theo convention Next.js App Router:

| File | Mục đích |
|---|---|
| `frontend/app/not-found.tsx` | Trang 404 toàn app |
| `frontend/app/error.tsx` | Error boundary toàn app (client component) |
| `frontend/app/loading.tsx` | Loading fallback mặc định toàn app |
| `frontend/app/(storefront)/products/loading.tsx` | Skeleton lưới sản phẩm |
| `frontend/app/(storefront)/product/[id]/loading.tsx` | Skeleton trang chi tiết sản phẩm |
| `frontend/app/admin/loading.tsx` | Loading cho toàn bộ segment admin |
| `frontend/app/template.tsx` | Wrapper remount mỗi lần chuyển trang → tạo hiệu ứng fade-in |
| `frontend/app/globals.css` | Thêm `@keyframes page-fade-in` + `.animate-page-in` (theo convention hiện có) |

Không tạo trang error/loading riêng cho `(auth)` group hay `admin/*` con — dùng
fallback từ root/segment cha (đúng cơ chế Next.js: `error.tsx`/`loading.tsx` ở
segment cha áp dụng cho mọi segment con chưa có file riêng).

## Chi tiết từng phần

### 1. `app/not-found.tsx` (server component)
- Layout: `min-h-screen flex flex-col items-center justify-center bg-surface-cream
  text-primary px-6 text-center`.
- Heading serif lớn "404" (`font-serif`), dòng phụ "Không tìm thấy trang" +
  mô tả "Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển."
- Icon từ `lucide-react` (vd. `SearchX` hoặc `Compass`), áp class
  `.animate-float-slow` (utility đã có sẵn trong `globals.css`) để nhất quán
  motion-language với phần còn lại của site.
- 2 nút CTA: "Về trang chủ" (`Link href="/"`, style primary — nền `bg-primary`
  chữ trắng) và "Xem sản phẩm" (`Link href="/products"`, style outline — border
  `border-border-subtle`).

### 2. `app/error.tsx` (`"use client"`)
- Props chuẩn Next.js: `{ error: Error & { digest?: string }; reset: () => void }`.
- `useEffect` log `console.error(error)` (phục vụ debug, không gửi lên service
  ngoài — ngoài phạm vi spec này).
- Cùng khung layout với `not-found.tsx` nhưng icon `AlertTriangle`, heading
  "Đã có lỗi xảy ra", mô tả "Rất tiếc, đã có lỗi xảy ra khi tải trang. Vui lòng
  thử lại."
- 2 nút: "Thử lại" (`onClick={() => reset()}`, style primary) và "Về trang chủ"
  (`Link href="/"`, style outline).

### 3. `app/loading.tsx` (server component)
- `min-h-screen flex items-center justify-center bg-surface-cream`, render
  `<MusicLoading message="Đang tải..." height="200px" />`.

### 4. `app/(storefront)/products/loading.tsx`
- Skeleton lưới dùng đúng breakpoints grid hiện có của trang `/products`
  (kiểm tra lại class grid thực tế trong `ProductGrid`/`page.tsx` khi implement
  để khớp số cột `sm:`/`md:`/`lg:`).
- Mỗi thẻ skeleton: `animate-pulse` (Tailwind built-in), khối ảnh vuông
  `aspect-square bg-border-subtle rounded-lg`, 2 thanh giả cho tên/giá.
- Render ~8 thẻ skeleton (map từ mảng cố định).

### 5. `app/(storefront)/product/[id]/loading.tsx`
- Bố cục 2 cột giống trang chi tiết thật: cột trái khối ảnh lớn
  `aspect-square animate-pulse bg-border-subtle`, cột phải các thanh giả cho
  tiêu đề/giá/mô tả/nút mua (`animate-pulse`).

### 6. `app/admin/loading.tsx`
- Đơn giản hơn (không full-screen vì admin có sidebar/layout riêng):
  `<MusicLoading message="Đang tải dữ liệu..." height="300px" />` trong container
  căn giữa nội dung khu vực admin.

### 7. Hiệu ứng chuyển trang — `app/template.tsx`
`template.tsx` re-mount mỗi lần navigate (khác `layout.tsx` không remount),
nên chỉ cần CSS animation thuần, không cần JS state:

```tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
```

Thêm vào `globals.css` (theo đúng convention keyframes/utility class đã có):

```css
@keyframes page-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-page-in {
  animation: page-fade-in 0.35s ease-out;
}
```

**Giới hạn đã biết:** `template.tsx` làm remount toàn bộ children mỗi lần
chuyển trang trong cùng layout → mất local state / scroll position của
component con giữa các lần điều hướng. Chấp nhận được cho site dạng
storefront/marketing này; cần lưu ý nếu sau này có state cần giữ lại khi
chuyển trang (vd. giỏ hàng mini-cart mở sẵn).

## Kiểm thử khi implement

1. `npm run dev -w @music-store/web`.
2. Truy cập route không tồn tại (vd `/khong-ton-tai`) → xác nhận `not-found.tsx`
   hiển thị đúng cả light/dark theme.
3. Tạm thời `throw new Error("test")` trong một page để kiểm tra `error.tsx`
   bắt lỗi đúng, nút "Thử lại" gọi `reset()` hoạt động — sau đó xoá code test.
4. Thêm `await new Promise(r => setTimeout(r, 1500))` tạm thời vào data fetch
   của `/products` và `/product/[id]` để quan sát skeleton loading — sau đó
   xoá code test.
5. Điều hướng qua lại nhiều trang để xác nhận hiệu ứng fade-in chạy mượt, không
   giật/nháy khi chuyển trang nhanh.
6. Kiểm tra dark mode (`.dark`) cho toàn bộ trang mới.
7. `npm run lint -w @music-store/web` và type-check (`npx tsc --noEmit` trong
   `frontend`) phải pass.

## Ngoài phạm vi

- Không thêm animation library (framer-motion, gsap...).
- Không tạo trang 404/error riêng cho từng route con trong `admin/*` hay
  `(auth)/*` — dùng fallback từ segment cha.
- Không thêm error logging ra dịch vụ ngoài (Sentry...).
- Không viết Playwright test mới (có thể làm ở lần sau nếu cần).
