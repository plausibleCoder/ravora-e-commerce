import React, { useState } from "react";

interface RavoraLogoProps {
  variant?: "monogram" | "wordmark" | "full" | "horizontal";
  className?: string;
  goldColor?: string;
  useOriginalLogo?: boolean;
}

export default function RavoraLogo({
  variant = "full",
  className = "",
  goldColor = "#C5A880", // Elegant antique champagne gold
  useOriginalLogo = false,
}: RavoraLogoProps) {
  const [imageError, setImageError] = useState(false);

  const logoSrc = useOriginalLogo ? "/Ravora_logo.png" : "/Ravora_logo_remove_bg.png";

  // SVG Monogram 'R' exactly matching the split stems & swooping luxury curves
  const renderMonogram = (sizeClass = "h-16 w-16") => (
    <div className={`relative flex items-center justify-center ${sizeClass}`}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-current"
      >
        {/* Straight left stem with serif details */}
        <path
          d="M45 25 V85"
          stroke={goldColor}
          strokeWidth="3.2"
          strokeLinecap="square"
        />
        {/* Top Serif */}
        <path
          d="M38 25 H52"
          stroke={goldColor}
          strokeWidth="2.5"
        />
        {/* Bottom Serif */}
        <path
          d="M38 85 H54"
          stroke={goldColor}
          strokeWidth="2.5"
        />
        {/* Loop of R */}
        <path
          d="M45 25 C74 25 82 46 60 56 H45"
          stroke={goldColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner swooping leg curve (The decorative luxury zari stroke) */}
        <path
          d="M51 49 C57 58 72 74 95 87"
          stroke={goldColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Outer parallel sweeping leg curve */}
        <path
          d="M55 56 C62 65 77 82 101 92"
          stroke={goldColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    </div>
  );

  // If PNG logo loads successfully, render it!
  const hasUploadedLogo = !imageError;

  if (variant === "monogram") {
    return renderMonogram(className);
  }

  if (variant === "wordmark") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {hasUploadedLogo ? (
          <img 
            src={logoSrc} 
            alt="Ravora Logo" 
            className="h-10 object-contain" 
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            {/* RΛVORΛ with Greek Lambda for the high fashion crossbar-less A's */}
            <h1 
              className="font-serif tracking-[0.25em] text-[#FCFBF9] uppercase select-none leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              R<span className="text-[#C5A880] font-light">Λ</span>VOR<span className="text-[#C5A880] font-light">Λ</span>
            </h1>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#C5A880]/60 to-transparent my-1.5" />
            <span className="text-[8px] font-sans tracking-[0.35em] text-stone-400 font-bold uppercase">
              Luxury Fashion
            </span>
          </>
        )}
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className={`flex items-center space-x-3.5 cursor-pointer ${className}`}>
        {hasUploadedLogo ? (
          <img 
            src={logoSrc} 
            alt="Ravora Logo" 
            className="h-16 max-h-[64px] sm:h-18 sm:max-h-[72px] object-contain" 
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <>
            <div className="h-10 w-10 shrink-0 border border-[#C5A880]/30 rounded-full bg-stone-950/45 p-0.5 flex items-center justify-center transition-transform hover:scale-105 duration-300">
              {renderMonogram("h-8 w-8")}
            </div>
            <div className="flex flex-col">
              <h1 
                className="font-serif text-lg sm:text-xl font-semibold tracking-[0.2em] text-[#FCFBF9] leading-none uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                R<span className="text-[#C5A880]">Λ</span>VOR<span className="text-[#C5A880]">Λ</span>
              </h1>
              <span className="text-[7.5px] font-sans tracking-[0.3em] text-[#C5A880] font-extrabold block mt-1 uppercase">
                Luxury Fashion
              </span>
            </div>
          </>
        )}
      </div>
    );
  }

  // Full Stacked Logo centered precisely like the uploaded logo
  return (
    <div className={`flex flex-col items-center justify-center text-center py-4 select-none ${className}`}>
      {hasUploadedLogo ? (
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={logoSrc} 
            alt="Ravora Logo" 
            className="h-16 sm:h-20 object-contain" 
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
          <div className="relative w-64 h-[1px] bg-[#C5A880]/30 flex items-center justify-center">
            <div className="absolute h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
          </div>
          <span className="text-[9px] tracking-[0.4em] text-[#C5A880] font-sans uppercase font-bold">
            Luxury Atelier • Est. 1928
          </span>
        </div>
      ) : (
        <>
          {/* Wordmark in high-contrast gorgeous Display sizing */}
          <h1 
            className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-[0.28em] text-[#FCFBF9] font-normal uppercase leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            R<span className="text-[#C5A880]">Λ</span>VOR<span className="text-[#C5A880]">Λ</span>
          </h1>
          
          {/* Thin line with dot separator */}
          <div className="relative w-72 sm:w-80 h-[1px] bg-[#C5A880]/40 my-4 flex items-center justify-center">
            <div className="absolute h-2 w-2 rounded-full bg-[#C5A880] border border-stone-950 shadow-md" />
          </div>
          
          {/* Luxury Fashion Subtitle with extreme letter spacing */}
          <p className="text-[10px] sm:text-xs tracking-[0.45em] text-stone-300 font-sans uppercase font-medium">
            Luxury Fashion
          </p>

          {/* Large decorative Monogram block beneath it */}
          <div className="mt-8 opacity-95 transition-transform duration-500 hover:scale-[1.03]">
            {renderMonogram("h-28 w-28 sm:h-32 w-32")}
          </div>
        </>
      )}
    </div>
  );
}
