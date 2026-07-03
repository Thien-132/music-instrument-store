import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "./components/ProductCard";
import { getProducts } from "../lib/products";
import HomeRedirect from "./components/HomeRedirect";

export default async function Home() {
  const { products, error } = await getProducts();
  const categories = Array.from(
    new Set(products.map((p) => p.type).filter(Boolean))
  ) as string[];
  const brandsData = [
    { name: "Yamaha", slogan: "SOUND. PASSION. PERFECTION." },
    { name: "Selmer", slogan: "LEGENDARY SINCE 1885" },
    { name: "Conn", slogan: "INNOVATION IN EVERY NOTE" },
    { name: "Yanagisawa", slogan: "MASTERPIECE OF JAPAN" },
    { name: "Jupiter", slogan: "PLAY. INSPIRE. CREATE." }
  ];
  const featuredProducts = products.slice(0, 4);
  const bucketName = process.env.S3_BUCKET_NAME || "cdk-hnb659fds-assets-112613858653-ap-southeast-1";
  const s3BaseUrl = `https://${bucketName}.s3.ap-southeast-1.amazonaws.com`;

  return (
    <main>
      <HomeRedirect />

      {/* HERO */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4">Aureate Forest</h1>
              <p className="text-lg mb-6">Saxophone chất lượng cao, âm thanh chuẩn, bảo hành uy tín cho người mới học đến nghệ sĩ chuyên nghiệp.</p>
              <div className="flex gap-4">
                <Link href="/products" className="bg-yellow-600 text-white px-6 py-3 rounded font-semibold">
                  Mua ngay
                </Link>
                <Link href="/products" className="border border-white text-white px-6 py-3 rounded font-semibold">
                  Xem sản phẩm
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Hero image placeholder */}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Danh Mục Sản Phẩm</h2>
          <div className="grid grid-cols-4 gap-6">
            {categories.map((cat) => {
              const product = products.find((p) => p.type === cat);
              return (
                <Link
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  key={cat}
                  className="border rounded p-4 text-center hover:border-yellow-600 transition"
                >
                  {product && (
                    <Image src={product.imageUrl} alt={cat} width={200} height={200} className="mb-4" />
                  )}
                  <p className="font-semibold">{cat}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Thương Hiệu Nổi Bật</h2>
          <div className="grid grid-cols-5 gap-6">
            {brandsData.map((brand) => (
              <Link
                href={`/products?brand=${encodeURIComponent(brand.name)}`}
                key={brand.name}
                className="border rounded p-6 text-center hover:border-yellow-600 transition"
              >
                <Image
                  src={`${s3BaseUrl}/logos/${brand.name.toLowerCase()}-logo.png`}
                  alt={`${brand.name} logo`}
                  width={140}
                  height={60}
                  className="mb-4"
                />
                <p className="text-sm font-semibold text-yellow-600">{brand.slogan}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Sản Phẩm Nổi Bật</h2>
          {error ? (
            <p className="text-center text-gray-600">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-6 mb-12">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <p className="text-center text-gray-600">Không có sản phẩm nào nổi bật.</p>
                )}
              </div>
              <div className="text-center">
                <Link href="/products" className="border border-yellow-600 text-yellow-600 px-8 py-3 rounded font-semibold hover:bg-yellow-50 transition">
                  XEM TẤT CẢ SẢN PHẨM
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
