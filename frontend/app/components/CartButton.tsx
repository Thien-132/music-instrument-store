"use client";

import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartButton() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(223, 158, 71, 0.5)', padding: '10px 20px', borderRadius: '8px', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
      GIỎ HÀNG ({totalItems})
    </Link>
  );
}