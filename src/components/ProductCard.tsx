import React, { useState } from "react";
import { Sparkles, ShoppingBag, Eye } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: React.Key | null | undefined;
  product: Product;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onQuickView }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [isHovered, setIsHovered] = useState(false);

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const getMotifBadge = (motif: string) => {
    switch (motif) {
      case "Peacock (Mayil)":
        return "bg-[#C5A880]/10 text-[#E5C49F] border-[#C5A880]/20";
      case "Temple Border (Gopuram)":
        return "bg-[#C5A880]/15 text-[#FCFBF9] border-[#C5A880]/30";
      case "Lotus (Kamalam)":
        return "bg-stone-900/60 text-stone-300 border-stone-800";
      case "Mango (Paisley)":
        return "bg-[#C5A880]/10 text-[#C5A880] border-[#C5A880]/20";
      default:
        return "bg-stone-950 text-stone-300 border-stone-800";
    }
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-800/80 bg-[#121110] transition-all duration-300 hover:border-[#3E59FA]/40 hover:shadow-[0_8px_30px_rgba(62,89,250,0.15)] hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`product-card-${product.id}`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-3/4 w-full bg-[#1A1918] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          id={`product-img-${product.id}`}
        />

        {/* Diagonal Ribbon for Discount / Sale */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#C5A880] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#080807] shadow-md rounded font-mono">
            {discount}% OFF
          </div>
        )}

        {/* Stock Alert Badge */}
        {product.stock === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-950/80 backdrop-blur-[2px]">
            <span className="rounded bg-stone-950 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#C5A880] border border-[#C5A880]/25">
              Sold Out
            </span>
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 right-3 bg-[#080807]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-[#E5C49F] shadow-xs rounded border border-[#C5A880]/20">
            Only {product.stock} Left
          </div>
        ) : null}

        {/* Quick actions overlay */}
        <div className="absolute bottom-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onQuickView(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#080807] text-[#C5A880] border border-[#C5A880]/20 shadow-md hover:bg-[#C5A880] hover:text-[#080807] transition-all duration-200 cursor-pointer"
            title="Read Fabric Craft Overview"
            id={`btn-view-${product.id}`}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Garment Details */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category & Motif pills */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#C5A880]">
            {product.category}
          </span>
          <span className="text-stone-700">•</span>
          <span className={`text-[9px] px-2.5 py-0.5 rounded-full border ${getMotifBadge(product.motif)} font-medium`}>
            {product.motif}
          </span>
        </div>

        {/* Title & Fabric descriptions */}
        <h3 className="font-serif text-base font-semibold text-[#FCFBF9] group-hover:text-[#C5A880] line-clamp-1 transition-colors duration-200">
          {product.name}
        </h3>
        
        <p className="mt-1 text-xs text-stone-400 font-sans tracking-tight leading-relaxed">
          {product.fabric}
        </p>

        {/* Swatch indicator and Color descriptor */}
        <div className="mt-3 flex items-center space-x-2">
          <span 
            className="h-3.5 w-3.5 rounded-full border border-stone-800 shadow-2xs block" 
            style={{ backgroundColor: product.colorHex }}
          />
          <span className="text-[10px] text-stone-400 font-medium tracking-wide">
            {product.color}
          </span>
        </div>

        {/* Price layout */}
        <div className="mt-4 flex items-baseline justify-between pt-1">
          <div className="flex items-baseline space-x-2">
            <span className="font-sans font-bold text-base text-[#FCFBF9]">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-stone-500 line-through">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          
          {/* Sizing selection panel */}
          {product.stock > 0 && (
            <div className="flex items-center space-x-1" id={`size-selector-${product.id}`}>
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`text-[9px] font-bold h-5 w-5 flex items-center justify-center rounded border transition-all cursor-pointer ${
                    selectedSize === size
                      ? "bg-[#3E59FA] text-white border-[#3E59FA]"
                      : "bg-transparent text-stone-400 border-stone-800 hover:border-[#3E59FA]/30"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add to Cart CTA button */}
        {product.stock > 0 && (
          <button
            onClick={() => onAddToCart(product, selectedSize)}
            className="mt-5 flex w-full items-center justify-center space-x-2 rounded-xl bg-[#3E59FA] py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#2A45E2] hover:shadow-[0_4px_20px_rgba(62,89,250,0.45)] active:scale-98 shadow-md cursor-pointer"
            id={`btn-add-cart-${product.id}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add to bag ({selectedSize})</span>
          </button>
        )}
      </div>
    </div>
  );
}
