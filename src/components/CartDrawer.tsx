import React from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { CartItem, Product } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  products,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  // Resolve cart lines to products
  const cartWithProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter((line) => line.product !== undefined) as (CartItem & { product: Product })[];

  const subtotal = cartWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Elegant delivery: FREE over ₹5000, otherwise flat ₹150 for courier
  const shippingCost = subtotal === 0 || subtotal >= 5000 ? 0 : 150;
  const grandTotal = subtotal + shippingCost;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-container">
      {/* Dark overlay backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10" id="cart-drawer-sidebar">
        <div className="w-screen max-w-md transform bg-[#0d0c0b] border-l border-stone-800/80 shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="px-5 py-5 border-b border-stone-800 flex items-center justify-between bg-[#0d0c0b]">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="h-5 w-5 text-[#C5A880]" />
              <h2 className="text-base font-serif font-bold tracking-wider text-[#FCFBF9]">
                Your Shopping Bag ({totalQuantity})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-900 text-stone-400 transition-colors cursor-pointer"
              aria-label="Close Shopping Bag"
              id="cart-drawer-close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartWithProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <div className="h-16 w-16 bg-[#121110] border border-stone-800 rounded-full flex items-center justify-center text-[#C5A880] shadow-md">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#FCFBF9] tracking-wide">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-stone-400 max-w-xs leading-relaxed font-sans">
                  Explore our vibrant handlooms, luxury temple border weaves, and majestic peacock-patterned styles.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 text-xs font-bold text-[#C5A880] hover:text-[#E5C49F] underline decoration-[#C5A880] underline-offset-4 tracking-wider uppercase cursor-pointer"
                  id="checkout-resume-shopping"
                >
                  Return to collections
                </button>
              </div>
            ) : (
              cartWithProducts.map(({ product, quantity, selectedSize }) => (
                <div
                  key={`${product.id}-${selectedSize}`}
                  className="flex items-start space-x-4 p-3 rounded-lg border border-stone-800/80 bg-[#121110] shadow-md"
                  id={`cart-item-${product.id}-${selectedSize}`}
                >
                  {/* Thumbnail */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-20 w-16 object-cover object-center rounded border border-stone-800"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info and counts */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <h4 className="text-xs font-serif font-bold text-[#FCFBF9] line-clamp-1">
                        {product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(product.id, selectedSize)}
                        className="text-stone-500 hover:text-red-400 transition-colors pl-2 cursor-pointer"
                        title="Remove product"
                        id={`btn-remove-${product.id}-${selectedSize}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-stone-400 font-sans">
                      <span>Size: <strong className="text-stone-200">{selectedSize}</strong></span>
                      <span>•</span>
                      <span>Fabric: {product.fabric}</span>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-1">
                      {/* Quantity switcher */}
                      <div className="flex items-center rounded-md border border-stone-800 h-6 bg-stone-950">
                        <button
                          onClick={() => onUpdateQuantity(product.id, selectedSize, quantity - 1)}
                          className="px-2 text-stone-400 hover:text-[#C5A880] h-full flex items-center cursor-pointer"
                          id={`btn-dec-${product.id}-${selectedSize}`}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-[#C5A880]">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, selectedSize, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-2 text-stone-400 hover:text-[#C5A880] h-full flex items-center disabled:opacity-30 cursor-pointer"
                          id={`btn-inc-${product.id}-${selectedSize}`}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Display price */}
                      <span className="text-xs font-bold text-[#FCFBF9]">
                        ₹{(product.price * quantity).toLocaleString("en-IN")}
                      </span>
                    </div>

                    {quantity >= product.stock && (
                      <p className="text-[9px] text-[#C5A880] font-medium leading-tight mt-1">
                        Loom limit reached (Only {product.stock} available)
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout & summary sticky tray */}
          {cartWithProducts.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-[#0b0a09] space-y-4">
              <div className="space-y-1.5 text-xs" id="cart-drawer-summary">
                <div className="flex justify-between text-stone-450">
                  <span>Bag Subtotal</span>
                  <span className="font-mono text-xs text-stone-300">₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-450">
                  <span>Loom Dispatch & Delivery</span>
                  <span className="font-mono text-xs">
                    {shippingCost === 0 ? (
                      <span className="text-[#C5A880] font-bold uppercase tracking-wider text-[9px]">
                        FREE Delivery
                      </span>
                    ) : (
                      <span className="text-stone-300">₹{shippingCost}</span>
                    )}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-[10px] text-stone-400">
                    Add <strong className="text-[#C5A880]">₹{(5000 - subtotal).toLocaleString("en-IN")}</strong> more for priority delivery
                  </p>
                )}
                <div className="h-px bg-stone-800 my-2" />
                <div className="flex justify-between text-[#FCFBF9] font-bold text-sm">
                  <span>Total Amount</span>
                  <span className="font-mono text-[#C5A880] text-base">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Order Placement Call-to-action button */}
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#3E59FA] hover:bg-[#2A45E2] hover:shadow-[0_4px_25px_rgba(62,89,250,0.45)] py-3 text-xs font-bold uppercase tracking-[0.1em] text-white transition-all shadow-md active:scale-98 cursor-pointer"
                id="cart-checkout-btn"
              >
                <span>Proceed to Weave Order</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <div className="text-center text-[9px] text-stone-500 font-sans tracking-wide">
                100% Secure Checkout • Curated Handloom Trust
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
