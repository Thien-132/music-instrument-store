"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import type { Order } from "../../../types/cart";

interface OrderDetailsModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

type StatusHistoryEntry = {
  status: string;
  changedBy: string;
  reason?: string;
  createdAt: string;
};

export function OrderDetailsModal({ isOpen, order, onClose }: OrderDetailsModalProps) {
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);

  useEffect(() => {
    if (!isOpen || !order) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) return;

        const res = await fetch(`/api/orders/${order.id}/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setHistory(await res.json());
        }
      } catch {
        // Bỏ qua nếu không lấy được lịch sử (không chặn xem chi tiết đơn hàng)
      }
    };

    fetchHistory();
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const formatPrice = (price: number) => price.toLocaleString("vi-VN") + " ₫";

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF9F6] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 md:px-8 py-6 border-b border-gray-100 bg-[#F3EFEA]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#002B1F]">Chi Tiết Đơn Hàng</h3>
            <span className="text-xs font-mono text-slate-500">ID: {order.id}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600 transition-colors leading-none"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Status and Method */}
          <div className="grid gap-6 mb-8 p-5 bg-[#002B1F]/[0.03] rounded-xl border border-dashed border-gray-200" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500">Trạng thái hiện tại</span>
              <div className="font-bold text-[#002B1F] mt-1">{order.status}</div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500">Phương thức thanh toán</span>
              <div className="font-semibold mt-1 text-slate-700">{order.paymentMethod}</div>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500">Thời gian đặt hàng</span>
              <div className="font-medium mt-1 text-slate-700">{formatDate(order.createdAt)}</div>
            </div>
          </div>

          {/* Customer Grid */}
          <div className="mb-8">
            <h4 className="text-sm font-bold text-[#002B1F] border-b border-gray-100 pb-2 mb-4">
              Thông Tin Giao Hàng
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500">Họ và Tên</span>
                <p className="font-semibold text-slate-800 mt-1">{order.customer?.name || "Chưa cập nhật"}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Số Điện Thoại</span>
                <p className="font-semibold text-slate-800 mt-1">{order.customer?.phone || "Chưa cập nhật"}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-500">Địa Chỉ Nhận Hàng</span>
                <p className="font-medium text-slate-700 leading-relaxed mt-1">{order.customer?.address || "Chưa cập nhật"}</p>
              </div>
              {order.customer?.note && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-500">Ghi chú đơn hàng</span>
                  <p className="italic text-slate-500 leading-relaxed mt-1">&ldquo;{order.customer.note}&rdquo;</p>
                </div>
              )}
            </div>
          </div>

          {/* Status History Timeline */}
          {history.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-bold text-[#002B1F] border-b border-gray-100 pb-2 mb-4">
                Lịch Sử Trạng Thái
              </h4>
              <ul className="space-y-3">
                {history.map((entry, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <span className="mt-1 w-2 h-2 rounded-full bg-[#A36B2B] shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-800">{entry.status}</span>
                      <span className="text-slate-500"> — {formatDate(entry.createdAt)}</span>
                      <div className="text-xs text-slate-500">Bởi: {entry.changedBy}</div>
                      {entry.reason && <div className="text-xs italic text-slate-500">&ldquo;{entry.reason}&rdquo;</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Product Items */}
          <div>
            <h4 className="text-sm font-bold text-[#002B1F] border-b border-gray-100 pb-2 mb-4">
              Danh Sách Sản Phẩm ({order.totalItems || 0})
            </h4>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F3EFEA] border-b border-gray-100">
                    <th className="p-3 text-left text-xs font-bold uppercase text-[#002B1F]">Sản phẩm</th>
                    <th className="p-3 text-right text-xs font-bold uppercase text-[#002B1F]">Đơn giá</th>
                    <th className="p-3 text-center text-xs font-bold uppercase text-[#002B1F]">Số lượng</th>
                    <th className="p-3 text-right text-xs font-bold uppercase text-[#002B1F]">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.products || []).map((item) => {
                    const priceNum = parseFloat(String(item.price).replace(/,/g, ""));
                    const totalNum = priceNum * (item.quantity || 1);
                    return (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            {item.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-contain bg-white rounded border border-gray-100"
                              />
                            )}
                            <span className="font-semibold text-slate-800">{item.name}</span>
                          </div>
                        </td>
                        <td className="p-3 text-right text-slate-600">{formatPrice(priceNum)}</td>
                        <td className="p-3 text-center font-semibold text-slate-700">{item.quantity || 1}</td>
                        <td className="p-3 text-right font-semibold text-[#002B1F]">{formatPrice(totalNum)}</td>
                      </tr>
                    );
                  })}
                  {!!order.discountAmount && (
                    <tr className="border-b border-gray-100">
                      <td colSpan={3} className="p-3 text-right text-emerald-600">
                        Giảm giá {order.couponCode ? `(${order.couponCode})` : ""}:
                      </td>
                      <td className="p-3 text-right text-emerald-600">-{formatPrice(order.discountAmount)}</td>
                    </tr>
                  )}
                  <tr className="bg-[#002B1F]/[0.02] font-bold">
                    <td colSpan={3} className="p-4 text-right text-slate-700">TỔNG THANH TOÁN:</td>
                    <td className="p-4 text-right text-[#002B1F]">{formatPrice(order.totalPrice || 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-5 border-t border-gray-100 bg-[#F3EFEA] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#002B1F] hover:bg-[#054030] text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
