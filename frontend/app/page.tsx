import Link from "next/link";

const categories = [
  "Đàn Guitar Acoustic",
  "Đàn Guitar Classic",
  "Đàn Guitar Điện",
  "Đàn Guitar Bass",
  "Đàn Guitar Silent",
  "Đàn Guitar Acoustic Bass",
  "Phụ Kiện Guitar",
];

const products = [
  {
    id: 1,
    name: "Yamaha Alto Saxophone",
    price: "25,000,000 VND",
    icon: "🎷",
  },
  {
    id: 2,
    name: "Selmer Tenor Saxophone",
    price: "48,000,000 VND",
    icon: "🎷",
  },
  {
    id: 3,
    name: "Beginner Saxophone Kit",
    price: "12,000,000 VND",
    icon: "🎷",
  },
  {
    id: 4,
    name: "Saxophone Mouthpiece",
    price: "1,200,000 VND",
    icon: "🎼",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-neutral-900">

      {/* TOP BAR */}
      <div className="bg-red-800 px-10 py-4 text-sm font-semibold text-white">
        <div className="flex justify-between">
          <div className="flex gap-8">
            <span>MENU</span>
            <span>THƯƠNG HIỆU</span>
            <span>BLOG TƯ VẤN</span>
            <span>LIÊN HỆ</span>
            <span>MUA TRẢ GÓP</span>
            <span>GIỚI THIỆU</span>
          </div>

          <span>☎ 0912191218</span>
        </div>
      </div>

      {/* LOGO + SEARCH */}
      <section className="px-10 py-8">
        <div className="flex items-center justify-between gap-10">

          <Link href="/">
            <div>
              <h1 className="text-3xl font-black text-green-800">
                TRAN THIEN
              </h1>

              <p className="tracking-[0.5em] text-red-700">
                MUSIC
              </p>
            </div>
          </Link>

          <input
            className="flex-1 border-b px-4 py-3 text-xl outline-none"
            placeholder="Tìm kiếm..."
          />

          <div className="flex gap-6 text-4xl">
            <span>⌕</span>
            <span>♡</span>
            <span>🛒</span>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-10 flex flex-wrap gap-5">
          {categories.map((category) => (
            <button
              key={category}
              className="rounded-md border border-neutral-400 bg-neutral-100 px-5 py-2 text-lg hover:bg-neutral-200"
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* BREADCRUMB */}
      <section className="border-t px-10 py-6">

        <div className="flex items-center gap-4 text-[22px]">
          <Link
            href="/"
            className="text-[#a00000] hover:underline"
          >
            Trang Chủ
          </Link>

          <span className="text-gray-500">›</span>

          <span className="text-gray-600">
            Kèn Saxophone
          </span>
        </div>

        <h2 className="mt-10 text-center text-4xl font-bold">
          Kèn Saxophone
        </h2>

      </section>

      {/* FILTER */}
      <section className="px-10 py-8">

        <div className="mb-8 flex justify-between">
          <button className="text-xl">
            Mở Bộ Lọc
          </button>

          <select className="border px-4 py-2">
            <option>Nổi bật</option>
            <option>Giá thấp đến cao</option>
            <option>Giá cao đến thấp</option>
          </select>
        </div>

        {/* PRODUCTS */}
        <div className="grid gap-10 md:grid-cols-4">
          {products.map((product) => (
            <Link
              href="/products"
              key={product.id}
              className="rounded-xl border p-6 text-center transition hover:shadow-xl"
            >
              <div className="flex h-72 items-center justify-center text-8xl">
                {product.icon}
              </div>

              <h3 className="mt-4 text-xl font-bold">
                {product.name}
              </h3>

              <p className="mt-2 text-red-700">
                {product.price}
              </p>
            </Link>
          ))}
        </div>

      </section>

    </main>
  );
}