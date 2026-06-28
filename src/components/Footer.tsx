import React from "react";
import { Sparkles, MapPin, ShieldCheck, HeartPulse } from "lucide-react";
import RavoraLogo from "./RavoraLogo";

export default function Footer() {
  return (
    <footer className="bg-[#050504] text-stone-300 border-t border-[#C5A880]/15">
      {/* South Indian Craft Heritage Highlight */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          
          <div className="col-span-1 md:col-span-2 space-y-5" id="footer-about">
            <RavoraLogo variant="horizontal" />
            <p className="max-w-md text-xs sm:text-sm text-stone-400 leading-relaxed font-sans">
              Founded on the values of absolute authenticity and meticulous couture design. We collaborate with master handloom weavers across Kanchipuram, Madurai, and Pochampally to curate heavy zari silk borders, bespoke peacock patterns, and historic temple weaves tailored for modern elegant lifestyles.
            </p>
            <div className="flex items-center space-x-3 text-xs text-stone-400">
              <MapPin className="h-4 w-4 text-[#C5A880]" />
              <span className="tracking-wide">Atelier Hubs: Kanchipuram • Madurai • Pochampally • Trivandrum</span>
            </div>
          </div>

          <div className="space-y-4" id="footer-craft">
            <h3 className="font-serif text-xs font-bold tracking-[0.15em] text-[#C5A880] uppercase">
              The Heritage Weaves
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="hover:text-[#C5A880] transition-colors cursor-pointer">Mayil (Peacock) Jacquards</li>
              <li className="hover:text-[#C5A880] transition-colors cursor-pointer">Gopuram Temple Borders</li>
              <li className="hover:text-[#C5A880] transition-colors cursor-pointer">Pochampally Double Ikat</li>
              <li className="hover:text-[#C5A880] transition-colors cursor-pointer">Hand-Painted Kalamkari</li>
              <li className="hover:text-[#C5A880] transition-colors cursor-pointer">Kerala Kasavu Zari Fine</li>
            </ul>
          </div>

          <div className="space-y-4" id="footer-contact">
            <h3 className="font-serif text-xs font-bold tracking-[0.15em] text-[#C5A880] uppercase">
              Artisan Trust
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-[#C5A880]" />
                <span>100% Cotton & Silk Mark Certified</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-[#C5A880]" />
                <span>Fair Trade Certified Artisan Wages</span>
              </li>
              <li className="text-stone-500 text-[11px] mt-4 leading-relaxed font-serif italic">
                For custom bridal enquiries or loom bookings, write to support@ravora.com
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-16 border-t border-stone-800/65 pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-500 tracking-wide">
          <p>© 2026 Ravora Clothing & Curations Pvt Ltd. Handcrafted in South India. All rights reserved.</p>
          <p className="mt-2 md:mt-0 font-serif italic text-[#C5A880]">Authentic Heritage Weaves • Modern Elegance</p>
        </div>
      </div>
    </footer>
  );
}
