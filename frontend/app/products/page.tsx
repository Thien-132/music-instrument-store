import Link from "next/link";

const menuItems = [
  "Đàn Guitar",
  "Đàn Piano",
  "Trống & Bộ Gõ",
  "Kèn & Bộ Hơi",
  "Amplifier",
  "Ukulele & Violin",
  "Âm Thanh & Studio",
  "Organ & Keyboard",
  "Pedal Effect",
];

const featuredProducts = [
  { name: "Yamaha Alto Saxophone", price: "25.000.000đ", icon: "🎷" },
  { name: "Selmer Tenor Saxophone", price: "48.000.000đ", icon: "🎷" },
  { name: "Beginner Saxophone Kit", price: "12.000.000đ", icon: "🎷" },
  { name: "Saxophone Mouthpiece", price: "1.200.000đ", icon: "🎼" },
];

const blogPosts = [
  "Cách chọn kèn saxophone cho người mới bắt đầu",
  "5 mẹo bảo quản nhạc cụ luôn bền đẹp",
  "Nên mua saxophone alto hay tenor?",
  "Luyện nghe và cảm âm khi chơi nhạc cụ",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#252b31]">
      <div className="bg-[#a40000] px-10 py-4 text-sm font-bold text-white">
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

      <header className="flex items-center justify-between px-10 py-8">
        <Link href="/" className="block">
          <h1 className="text-3xl font-black text-green-800">TRAN THIEN</h1>
          <p className="tracking-[0.5em] text-red-700">MUSIC</p>
        </Link>

        <input
          className="mx-14 flex-1 border-b px-4 py-3 text-xl outline-none"
          placeholder="Tìm kiếm..."
        />

        <div className="flex gap-6 text-4xl">
          <span>⌕</span>
          <span>♡</span>
          <span>🛒</span>
        </div>
      </header>

      <section className="grid gap-10 px-10 py-6 md:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border">
          <div className="rounded-t-3xl bg-[#a40000] px-8 py-6 text-xl font-bold text-white">
            Danh Mục Sản Phẩm
          </div>

          <div className="space-y-1 p-6 text-xl">
            {menuItems.map((item) => (
              <Link
                href="/products"
                key={item}
                className="flex items-center justify-between rounded-xl px-4 py-4 hover:bg-gray-100"
              >
                <span>{item}</span>
                <span>›</span>
              </Link>
            ))}
          </div>
        </aside>

        <div className="relative flex min-h-[430px] items-center overflow-hidden rounded-3xl bg-gradient-to-r from-yellow-300 to-orange-400 px-16">
          <button className="absolute left-5 rounded-full bg-white px-5 py-4 text-3xl shadow">
            ‹
          </button>

          <div>
            <p className="text-4xl font-black text-red-700">NHẠC CỤ CHÍNH HÃNG</p>
            <h2 className="mt-4 max-w-3xl text-7xl font-black text-red-700">
              KÈN SAXOPHONE CAO CẤP
            </h2>
            <p className="mt-6 text-4xl font-black text-black">
              Từ 1 triệu - 380 triệu
            </p>
          </div>

          <div className="absolute bottom-8 left-16 flex gap-3">
            <span className="h-3 w-10 rounded-full bg-white"></span>
            <span className="h-3 w-3 rounded-full bg-white/70"></span>
          </div>

          <button className="absolute right-5 rounded-full bg-neutral-800 px-5 py-4 text-3xl text-white shadow">
            ›
          </button>
        </div>
      </section>

      <section className="px-10 py-12 text-center">
        <h2 className="text-4xl font-black">Sản Phẩm Nổi Bật</h2>
        <p className="mt-4 text-2xl text-gray-500">
          Bán chạy, mới về hàng, mới ra mắt, khuyến mãi...
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-4">
          {featuredProducts.map((product) => (
            <Link href="/products" key={product.name} className="group">
              <div className="flex h-72 items-center justify-center text-8xl transition group-hover:scale-105">
                {product.icon}
              </div>
              <h3 className="mt-6 text-xl font-bold">{product.name}</h3>
              <p className="mt-3 text-2xl font-black">{product.price}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t px-10 py-14 text-center">
        <h2 className="text-4xl font-black">Blog Posts</h2>

        <div className="mt-12 grid gap-10 text-left md:grid-cols-4">
          {blogPosts.map((post, index) => (
            <article key={post}>
              <div className="flex h-56 items-center justify-center rounded-2xl bg-gray-200 text-6xl">
                {index % 2 === 0 ? "🎹" : "🎼"}
              </div>
              <h3 className="mt-6 text-2xl font-bold leading-snug">{post}</h3>
              <p className="mt-4 text-lg text-gray-600">
                Những kiến thức hữu ích giúp bạn chọn và sử dụng nhạc cụ tốt hơn...
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t px-10 py-8 md:grid-cols-4">
        <div>
          <h3 className="text-xl font-black">GIAO HÀNG</h3>
          <p>Free ship bán kính 10km, giao hàng toàn quốc.</p>
        </div>
        <div>
          <h3 className="text-xl font-black">ĐỔI TRẢ</h3>
          <p>Đổi trả trong vòng 7 ngày nếu có lỗi nhà sản xuất.</p>
        </div>
        <div>
          <h3 className="text-xl font-black">BẢO HÀNH</h3>
          <p>Bảo hành chính hãng trên toàn quốc.</p>
        </div>
        <div>
          <h3 className="text-xl font-black">TƯ VẤN</h3>
          <p>Tư vấn nhiệt tình bất cứ vấn đề gì liên quan sản phẩm.</p>
        </div>
      </section>

      <footer className="grid gap-10 bg-[#a40000] px-16 py-16 text-white md:grid-cols-3">
        <div>
          <h3 className="mb-8 text-2xl font-black">Công Ty CP Âm Nhạc Trần Thiện</h3>
          <p>Hotline / Zalo: 0912191218</p>
          <p className="mt-4">Email: contact@tranthienmusic.vn</p>
          <p className="mt-4">Địa chỉ showroom: TP.HCM</p>
        </div>

        <div>
          <h3 className="mb-8 text-2xl font-black">Liên Kết Nhanh</h3>
          <p>Đàn Guitar</p>
          <p>Kèn & Bộ Hơi</p>
          <p>Organ & Keyboard</p>
          <p>Blog Tư Vấn</p>
        </div>

        <div>
          <h3 className="mb-8 text-2xl font-black">Chính Sách</h3>
          <p>Chính Sách Bảo Mật</p>
          <p>Chính Sách Hoàn Trả</p>
          <p>Chính Sách Vận Chuyển</p>
          <p>Điều Khoản Dịch Vụ</p>
        </div>
      </footer>
    </main>
  );
}