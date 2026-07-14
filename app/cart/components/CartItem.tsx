import Image from "next/image";
import { IoAdd, IoRemove, IoClose } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CartItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
  };
  qty: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

export default function CartItem({ product, qty, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const rawImg = product.images?.[0] || product.image;
  const img = rawImg ? resolveImg(rawImg) : undefined;

  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all hover:shadow-md" style={{ backgroundColor: "#fff", border: "1px solid rgba(188,146,85,0.12)" }}>
      {/* Remove button */}
      <button
        onClick={() => onRemove(product._id)}
        className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: "rgba(239,68,68,0.08)" }}
      >
        <IoClose size={12} className="text-red-500" />
      </button>

      <div className="flex">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0" style={{ backgroundColor: "#faf7f2" }}>
          {img ? (
            <Image src={img} alt={product.name} fill className="object-contain p-3" />
          ) : (
            <span className="text-3xl flex items-center justify-center w-full h-full">📱</span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="text-sm font-bold line-clamp-1" style={{ color: "#0A1825" }}>{product.name}</h3>
            <p className="text-lg font-black mt-1" style={{ color: "#BC9255" }}>
              {fmt(price)} <span className="text-[10px] font-medium" style={{ color: "#A77D4B" }}>ر.س</span>
            </p>
          </div>

          <div className="flex items-center justify-between mt-2">
            {/* Qty controls */}
            <div className="flex items-center rounded-lg overflow-hidden" style={{ border: "1.5px solid rgba(188,146,85,0.25)" }}>
              <button onClick={() => onUpdateQty(product._id, qty - 1)} className="w-8 h-8 flex items-center justify-center transition hover:opacity-70" style={{ backgroundColor: "rgba(188,146,85,0.08)" }}>
                <IoRemove size={14} style={{ color: "#A77D4B" }} />
              </button>
              <span className="w-10 h-8 flex items-center justify-center text-sm font-black" style={{ color: "#0A1825", backgroundColor: "#fff" }}>{qty}</span>
              <button onClick={() => onUpdateQty(product._id, qty + 1)} className="w-8 h-8 flex items-center justify-center transition hover:opacity-70" style={{ backgroundColor: "rgba(188,146,85,0.08)" }}>
                <IoAdd size={14} style={{ color: "#A77D4B" }} />
              </button>
            </div>

            {/* Subtotal */}
            {qty > 1 && (
              <span className="text-xs font-bold" style={{ color: "#A77D4B" }}>
                المجموع: {fmt(price * qty)} ر.س
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
