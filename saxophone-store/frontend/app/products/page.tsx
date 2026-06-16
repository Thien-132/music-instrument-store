import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Yamaha YAS-280",
    type: "Alto Saxophone",
    price: "35.800.000đ",
    image: "/images/yamaha-yas280.jpg",
  },
  {
    id: 2,
    name: "Selmer AS500",
    type: "Alto Saxophone",
    price: "51.000.000đ",
    image: "/images/selmer-as500.jpg",
  },
  {
    id: 3,
    name: "Conn Director",
    type: "Alto Saxophone",
    price: "12.000.000đ",
    image: "/images/conn-as650.jpg",
  },
  {
    id: 4,
    name: "Yamaha YTS-280",
    type: "Tenor Saxophone",
    price: "42.000.000đ",
    image: "/images/yamaha-yts280.jpg",
  },
  {
    id: 5,
    name: "Selmer Supreme",
    type: "Professional Saxophone",
    price: "95.000.000đ",
    image: "/images/selmer-supreme.jpg",
  },
  {
    id: 6,
    name: "Conn New Wonder",
    type: "Vintage Saxophone",
    price: "28.000.000đ",
    image: "/images/conn-newwoner.jpg",
  },
  {
    id: 7,
    name: "Yanagisawa A-WO1",
    type: "Alto Saxophone",
    price: "72.000.000đ",
    image: "/images/yanagisawa-awo1.jpg",
  },
  {
    id: 8,
    name: "Jupiter JAS700",
    type: "Student Saxophone",
    price: "24.500.000đ",
    image: "/images/jupiter-jas700.jpg",
  },
];

export default function Products() {
  return (
    <main className="products-page">
      <h1 className="section-title">Danh Sách Sản Phẩm</h1>

      <section className="products">
        {products.map((product) => (
          <div className="card" key={product.id}>
            <img src={product.image} alt={product.name} />

            <p className="product-type">{product.type}</p>

            <h3>{product.name}</h3>

            <p className="price">{product.price}</p>

            <Link href={`/product/${product.id}`}>
              <button>Xem Chi Tiết</button>
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}