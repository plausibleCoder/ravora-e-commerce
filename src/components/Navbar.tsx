import React from "react";
import { ShoppingBag, User, Settings, LogOut, Sparkles } from "lucide-react";
import { User as UserType } from "../types";
import RavoraLogo from "./RavoraLogo";

interface NavbarProps {
  currentUser: UserType | null;
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: "shop" | "orders" | "admin" | "login" | "story") => void;
  activeView: "shop" | "orders" | "admin" | "login" | "story";
  onLogout: () => void;
}

export default function Navbar({
  currentUser,
  cartCount,
  onOpenCart,
  onNavigate,
  activeView,
  onLogout,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#C5A880]/15 bg-[#080807]/90 backdrop-blur-md shadow-lg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Luxury Curation Header */}
        <div 
          onClick={() => onNavigate("shop")}
          id="nav-logo"
        >
          <RavoraLogo variant="horizontal" className="hover:opacity-90 transition-opacity" />
        </div>

        {/* Navigation Actions */}
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <button
            onClick={() => onNavigate("shop")}
            className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer ${
              activeView === "shop"
                ? "text-[#C5A880] border-b border-[#C5A880]"
                : "text-stone-300 hover:text-[#C5A880]"
            }`}
            id="nav-btn-shop"
          >
            Collections
          </button>

          <button
            onClick={() => onNavigate("story")}
            className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer ${
              activeView === "story"
                ? "text-[#C5A880] border-b border-[#C5A880]"
                : "text-stone-300 hover:text-[#C5A880]"
            }`}
            id="nav-btn-story"
          >
            Our Story
          </button>

          {currentUser && (
            <button
              onClick={() => onNavigate("orders")}
              className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer ${
                activeView === "orders"
                  ? "text-[#C5A880] border-b border-[#C5A880]"
                  : "text-stone-300 hover:text-[#C5A880]"
              }`}
              id="nav-btn-orders"
            >
              My Orders
            </button>
          )}

          {currentUser?.role === "admin" && (
            <button
              onClick={() => onNavigate("admin")}
              className={`flex items-center space-x-1 px-4 py-1.5 rounded-full border border-[#C5A880]/40 text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-200 cursor-pointer ${
                activeView === "admin"
                  ? "bg-[#C5A880] text-[#080807]"
                  : "text-[#C5A880] hover:bg-[#C5A880] hover:text-[#080807]"
              }`}
              id="nav-btn-admin"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>Admin Portal</span>
            </button>
          )}

          <div className="h-6 w-px bg-stone-800" />

          {/* Cart Trigger */}
          <button
            onClick={onOpenCart}
            className="group relative p-2 text-stone-300 hover:text-[#C5A880] transition-colors cursor-pointer"
            aria-label="Open Shopping Cart"
            id="nav-cart-btn"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C5A880] text-[10px] font-bold text-[#080807] shadow-md ring-2 ring-[#080807]">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Action */}
          {currentUser ? (
            <div className="flex items-center space-x-1 sm:space-x-3">
              <span className="hidden max-w-[130px] truncate text-[11px] font-bold uppercase tracking-wider text-[#C5A880] md:block">
                Namaste, {currentUser.username}
              </span>
              <button
                onClick={onLogout}
                className="p-2 text-stone-400 hover:text-[#C5A880] transition-colors cursor-pointer"
                title="Sign Out"
                id="nav-logout-btn"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className={`flex items-center space-x-1.5 rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border cursor-pointer ${
                activeView === "login"
                  ? "bg-[#C5A880] text-[#080807] border-[#C5A880]"
                  : "border-[#C5A880]/40 text-stone-200 hover:bg-[#C5A880] hover:text-[#080807] hover:border-[#C5A880]"
              }`}
              id="nav-login-btn"
            >
              <User className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}
        </nav>

      </div>
    </header>
  );
}
