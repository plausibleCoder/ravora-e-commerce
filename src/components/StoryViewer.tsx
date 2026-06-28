import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, Users, Image as ImageIcon } from "lucide-react";
import { StoryGroup, StorySlide } from "../types";

export function renderStoryIcon(iconName: string) {
  switch (iconName) {
    case "Sparkles":
      return <Sparkles className="h-5 w-5" />;
    case "Truck":
      return <Truck className="h-5 w-5" />;
    case "ShieldCheck":
      return <ShieldCheck className="h-5 w-5" />;
    case "Image":
      return <ImageIcon className="h-5 w-5" />;
    case "Users":
      return <Users className="h-5 w-5" />;
    default:
      return <Sparkles className="h-5 w-5" />;
  }
}

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  storyGroups?: Record<string, StoryGroup>;
}

export const STORY_GROUPS: Record<string, StoryGroup> = {
  catalog: {
    id: "catalog",
    name: "Catalog",
    iconName: "Sparkles",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
        title: "Sarees & Drapes",
        subtitle: "Heritage Series 01",
        description: "Explore our pure Kanchipuram silk sarees and Kerala Kasavu cotton weaves, featuring traditional peacock, mango, and temple borders.",
        badge: "Pure Silk Certified"
      },
      {
        image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
        title: "Modern Silhouettes",
        subtitle: "Fusion Series 02",
        description: "Indo-Western dresses and pleated summer maxis woven with high-end, breathable silk-cotton and geometric Pochampally Ikat patterns.",
        badge: "Limited Loom Stocks"
      },
      {
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        title: "Atelier Kurtas",
        subtitle: "Mandarin Series 03",
        description: "Slim-fit organic cotton and linen kurtas for men, displaying double-ikat chevrons and Kalamkari floral motifs printed with natural plant dyes.",
        badge: "Crafted for Elegance"
      }
    ]
  },
  delivery: {
    id: "delivery",
    name: "Loom Dispatch",
    iconName: "Truck",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
        title: "Atelier Inspection",
        subtitle: "Rigorous Standards",
        description: "Each finished garment is thoroughly inspected under magnifying lenses for weave density, silver zari alignments, and weight compliance.",
        badge: "100% Quality Assurance"
      },
      {
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80",
        title: "Luxury Wrapping",
        subtitle: "Sustainable Packaging",
        description: "We wrap our heritage garments in organic, starch-dipped unbleached linen sleeves, placed inside handcrafted pine wood keepsake boxes.",
        badge: "Eco-Luxury Packaging"
      },
      {
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=800&q=80",
        title: "Global Express Delivery",
        subtitle: "Hand-to-Hand Care",
        description: "Guaranteed express dispatch across major capitals and metros within 3-5 days, fully insured and shipped via luxury logistics partners.",
        badge: "Insured Courier Partners"
      }
    ]
  },
  quality: {
    id: "quality",
    name: "Loom Quality",
    iconName: "ShieldCheck",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=800&q=80",
        title: "Pure Mulberry Thread",
        subtitle: "Sourced Ethics",
        description: "We source strictly grade-A Mulberry silk from authorized sericulture farmers in South India, preserving thread strength and natural luster.",
        badge: "Silk Mark Registered"
      },
      {
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
        title: "Antique Gold Zari",
        subtitle: "Generational Value",
        description: "Our zari is authentic gold and silver plated copper wire, ensuring it never tarnishes and holds generational heirloom value for families.",
        badge: "Authentic Zari Certification"
      },
      {
        image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=800&q=80",
        title: "Ancestral Looms",
        subtitle: "The Master Weavers",
        description: "Each design is manually set onto our traditional wooden fly-shuttle looms, requiring up to 18 days of patient work by a single master weaver.",
        badge: "100% Hand-woven"
      }
    ]
  },
  photos: {
    id: "photos",
    name: "Atelier Swatches",
    iconName: "Image",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
        title: "Kanchipuram Swatch",
        subtitle: "Weave Detail 01",
        description: "A close-up of our Mayil Jacquard weave, showcasing the dual-tone contrast between the deep teal weft and the pure gold zari warp threads.",
        badge: "Real-life Swatch"
      },
      {
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
        title: "Ikat Chevron Swatch",
        subtitle: "Weave Detail 02",
        description: "Witness the exquisite geometric alignment of our crimson Ikat, where individual threads are tie-dyed before handloom alignment.",
        badge: "Geometric Precision"
      },
      {
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
        title: "Kasavu White Swatch",
        subtitle: "Weave Detail 03",
        description: "The lightweight elegance of unbleached Kasavu cotton, accented with a 4-inch wide pure gold zari gopuram temple border.",
        badge: "Ivory & Gold"
      }
    ]
  },
  about: {
    id: "about",
    name: "About Us",
    iconName: "Users",
    slides: [
      {
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80",
        title: "Our Heritage Story",
        subtitle: "Established 1928",
        description: "Rooted in Madurai, Ravora began as a humble guild of 12 traditional family weavers. Today, we sustain and empower over 120 artisan households.",
        badge: "Generational Guild"
      },
      {
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        title: "Sustaining Craft",
        subtitle: "Fair-Trade Pledge",
        description: "We bypass middlemen completely, returning 72% of each sale proceeds directly to the master weavers and their supporting dye artisans.",
        badge: "Fair-Trade Certified"
      },
      {
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        title: "The Modern Atelier",
        subtitle: "Crafting the Future",
        description: "We fuse ancestral motifs (Peacock, Temple, Mango) with contemporary cuts, ensuring these ancient arts remain alive and desired globally.",
        badge: "Ancient Craft, Modern Eyes"
      }
    ]
  }
};

export default function StoryViewer({ isOpen, onClose, groupId, storyGroups }: StoryViewerProps) {
  const activeStories = storyGroups || STORY_GROUPS;
  const group = activeStories[groupId];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen || !group) return;
    
    // Reset state on group change
    setCurrentIndex(0);
    setProgress(0);
  }, [isOpen, groupId, group]);

  // Handle slide duration / self-advancing
  useEffect(() => {
    if (!isOpen || !group || !group.slides || group.slides.length === 0) return;

    setProgress(0);
    const duration = 6000; // 6 seconds per slide
    const intervalTime = 60; // Update progress bar every 60ms
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, currentIndex, groupId, group]);

  if (!isOpen || !group) return null;

  const slides = group.slides || [];
  
  if (slides.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md transition-all duration-300">
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />
        <div className="relative w-full max-w-[420px] p-8 bg-[#0c0b0a] rounded-3xl border border-stone-800 text-center z-10 space-y-4 mx-4">
          <p className="text-sm text-stone-400">No active stories in this collection yet.</p>
          <button 
            onClick={onClose} 
            className="px-5 py-2.5 bg-[#3E59FA] hover:bg-[#2A45E2] text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    } else {
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95 backdrop-blur-md transition-all duration-300">
      
      {/* Background Dim Tap-to-Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Story Container */}
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[820px] bg-[#0c0b0a] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-stone-800 z-10 mx-4">
        
        {/* Progress Bars */}
        <div className="absolute top-4 left-0 right-0 px-4 flex space-x-1.5 z-30">
          {slides.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C5A880] transition-all duration-75 ease-linear rounded-full"
                style={{
                  width:
                    idx < currentIndex
                      ? "100%"
                      : idx === currentIndex
                      ? `${progress}%`
                      : "0%"
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-8 left-0 right-0 px-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-full border border-[#C5A880] flex items-center justify-center bg-[#080807] text-[#C5A880]">
              {group.iconName ? renderStoryIcon(group.iconName) : (group as any).icon}
            </div>
            <div>
              <p className="text-xs font-bold text-[#FCFBF9] uppercase tracking-wider leading-none">
                {group.name}
              </p>
              <p className="text-[10px] text-stone-400 mt-1 font-mono">
                Ravora Atelier
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/40 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Close Narrative"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Big Background Visual */}
        <div className="absolute inset-0 w-full h-full z-10">
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover transition-all duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Soft Dark Vignette Overlays for Elegant text reading */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0b0a] via-transparent to-black/60 opacity-90" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c0b0a] via-[#0c0b0a]/75 to-transparent" />
        </div>

        {/* Left & Right Tap Hotspots */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-pointer" onClick={handlePrev} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-pointer" onClick={handleNext} />

        {/* Manual Arrow Controls for Desktop */}
        <div className="absolute inset-y-0 left-2 flex items-center z-20 pointer-events-none">
          {currentIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="p-1 rounded-full bg-black/30 text-stone-300 hover:bg-black/60 hover:text-white pointer-events-auto transition-all cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="absolute inset-y-0 right-2 flex items-center z-20 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-1 rounded-full bg-black/30 text-stone-300 hover:bg-black/60 hover:text-white pointer-events-auto transition-all cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom Content Narrative panel */}
        <div className="relative z-20 mt-auto p-6 space-y-3.5 text-center sm:text-left">
          {currentSlide.badge && (
            <span className="inline-block px-2.5 py-0.5 bg-[#C5A880]/15 border border-[#C5A880]/30 text-[9px] text-[#C5A880] rounded-full uppercase tracking-widest font-mono font-semibold">
              {currentSlide.badge}
            </span>
          )}

          <div className="space-y-1">
            <p className="text-[10px] text-[#C5A880] uppercase tracking-[0.2em] font-bold">
              {currentSlide.subtitle}
            </p>
            <h3 className="font-serif text-2xl font-bold tracking-wide text-[#FCFBF9] leading-tight">
              {currentSlide.title}
            </h3>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed font-sans font-light">
            {currentSlide.description}
          </p>

          <div className="pt-2 text-[10px] text-stone-500 font-mono tracking-wider">
            Slide {currentIndex + 1} of {slides.length} • Tap edge to navigate
          </div>
        </div>

      </div>
    </div>
  );
}
