import React, { useState } from "react";
import { X, Sparkles, CreditCard, ChevronRight } from "lucide-react";
import { CartItem, Product } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  onSubmit: (shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  }) => void;
  isSubmitting: boolean;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  products,
  onSubmit,
  isSubmitting,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Tamil Nadu");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const cartWithProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  }).filter((line) => line.product !== undefined) as (CartItem & { product: Product })[];

  const subtotal = cartWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCost = subtotal >= 5000 ? 0 : 150;
  const grandTotal = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Simple robust validation
    if (!fullName.trim() || !addressLine.trim() || !city.trim() || !postalCode.trim() || !phone.trim()) {
      setErrorMsg("Please fill out all shipping details.");
      return;
    }

    if (phone.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please provide a valid 10-digit phone number.");
      return;
    }

    if (postalCode.replace(/\D/g, "").length < 6) {
      setErrorMsg("Please provide a valid 6-digit pin code.");
      return;
    }

    onSubmit({
      fullName,
      addressLine,
      city,
      state,
      postalCode,
      phone,
    });
  };

  const southStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Goa", "Pondicherry"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-stone-950/75 backdrop-blur-xs" id="checkout-modal-overlay">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main card box */}
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0d0c0b] border border-stone-800/80 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Address Details Form */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4 bg-[#0d0c0b]">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-[#C5A880]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M48 24C42 22 45 14 50 14C55 14 58 22 52 24C46 26 43 30 50 32C55 33 59 29 59 24C59 19 51 16 48 20C45 24 50 28 54 27" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="font-serif text-base font-bold text-[#FCFBF9] tracking-wide">
                Loom Dispatch Details
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-900 text-stone-400 md:hidden cursor-pointer"
              id="checkout-close-mobile"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="checkout-form">
            {errorMsg && (
              <div className="rounded-lg bg-red-950/40 border border-red-900/45 p-2.5 text-xs text-red-300 font-semibold">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block mb-1">
                Full Name / Recipient
              </label>
              <input
                type="text"
                placeholder="Rishabh Raghavan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-stone-800 px-3.5 py-2 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none bg-stone-900/50 text-[#FCFBF9]"
                id="checkout-name"
              />
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block mb-1">
                Loom Delivery Address
              </label>
              <input
                type="text"
                placeholder="Flat No, House Name, Street Details"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full rounded-lg border border-stone-800 px-3.5 py-2 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none bg-stone-900/50 text-[#FCFBF9]"
                id="checkout-address"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block mb-1">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Chennai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 px-3.5 py-2 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none bg-stone-900/50 text-[#FCFBF9]"
                  id="checkout-city"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block mb-1">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 px-3 py-2 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none bg-[#0d0c0b] font-sans text-stone-300"
                  id="checkout-state"
                >
                  {southStates.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block mb-1">
                  PIN Code (6 digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="600001"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-stone-800 px-3.5 py-2 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono bg-stone-900/50 text-[#FCFBF9]"
                  id="checkout-pin"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block mb-1">
                  10-Digit Mobile Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-lg border border-stone-800 px-3.5 py-2 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono bg-stone-900/50 text-[#FCFBF9]"
                  id="checkout-phone"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 flex w-full items-center justify-center space-x-2 rounded-xl bg-[#3E59FA] hover:bg-[#2A45E2] hover:shadow-[0_4px_25px_rgba(62,89,250,0.45)] py-3 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
              id="checkout-submit-btn"
            >
              <CreditCard className="h-4 w-4" />
              <span>{isSubmitting ? "Completing Loom Reserve..." : "Confirm Secure Cash On Delivery Order"}</span>
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary Card details */}
        <div className="bg-[#121110] p-6 border-t md:border-t-0 md:border-l border-stone-800 w-full md:w-64 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-3 border-b border-stone-800 mb-4 bg-[#121110]">
              <h3 className="font-serif text-sm font-bold text-[#FCFBF9] tracking-wider">
                Order Swatches
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-stone-900 text-stone-400 hidden md:block cursor-pointer"
                id="checkout-close-desktop"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 overflow-y-auto max-h-[30vh]">
              {cartWithProducts.map(({ product, quantity, selectedSize }) => (
                <div key={`${product.id}-${selectedSize}`} className="flex space-x-3 text-xs">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-10 w-8 object-cover rounded border border-stone-850"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-medium text-[#FCFBF9] truncate">{product.name}</h4>
                    <p className="text-[10px] text-stone-400">
                      {quantity} × Size {selectedSize}
                    </p>
                  </div>
                  <span className="font-mono text-[#FCFBF9] text-right font-medium">
                    ₹{(product.price * quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-stone-850 pt-4 space-y-2">
            <div className="flex justify-between text-xs text-stone-400">
              <span>Loom Items subtotal</span>
              <span className="font-mono text-stone-300">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-stone-400 font-medium">
              <span>Dispatch Delivery</span>
              <span className="font-mono text-[#C5A880] uppercase tracking-widest text-[9px] font-bold">
                {shippingCost === 0 ? "Complimentary" : `₹${shippingCost}`}
              </span>
            </div>
            <div className="h-px bg-stone-850 my-2" />
            <div className="flex justify-between text-xs text-[#FCFBF9] font-bold">
              <span>Grand Total</span>
              <span className="font-mono text-[#C5A880] text-base font-bold">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
