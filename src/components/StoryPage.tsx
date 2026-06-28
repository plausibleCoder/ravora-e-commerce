import React, { useState } from "react";
import { Sparkles, Heart, ShieldCheck, Compass, HelpCircle, Flame, Volume2, Award, ArrowUpRight } from "lucide-react";
import RavoraLogo from "./RavoraLogo";

export default function StoryPage() {
  const [activeStorySegment, setActiveStorySegment] = useState<"heritage" | "weaving" | "zari">("heritage");
  const [isPlayingLoomSound, setIsPlayingLoomSound] = useState(false);

  // Play a mock pure audio frequency resembling high-quality organic wooden loom clicks!
  const playLoomSound = () => {
    if (isPlayingLoomSound) {
      setIsPlayingLoomSound(false);
      return;
    }
    setIsPlayingLoomSound(true);

    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Simulate rhythmic shuttle click-clacks
      let clickCount = 0;
      const interval = setInterval(() => {
        if (clickCount > 12) {
          clearInterval(interval);
          setIsPlayingLoomSound(false);
          audioCtx.close();
          return;
        }

        // Click generator
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(clickCount % 2 === 0 ? 350 : 200, audioCtx.currentTime);
        
        // Fast decay
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
        clickCount++;
      }, 500);
    } catch (e) {
      console.warn("Audio Context blocked or not supported on this browser.", e);
      setIsPlayingLoomSound(false);
    }
  };

  return (
    <div className="bg-[#080807] text-[#FAF8F5] min-h-screen relative overflow-hidden pb-16" id="story-page-view">
      
      {/* Decorative Golden Glitter/Dust Overlay Left and Right */}
      <div className="absolute top-0 left-0 w-64 h-96 bg-radial-gradient from-[#C5A880]/15 to-transparent opacity-80 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-[500px] bg-radial-gradient from-[#C5A880]/10 to-transparent opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-radial-gradient from-stone-900/40 to-transparent opacity-80 pointer-events-none" />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-16 relative z-10">
        
        {/* Editorial Luxury Header Group */}
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Glowing Majestic Golden Crown Logo Crest */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative flex items-center justify-center p-4">
              {/* Outer Golden Sparkle Rings */}
              <div className="absolute inset-0 rounded-full border border-[#C5A880]/20 animate-spin-slow" />
              <div className="absolute -inset-2 rounded-full border border-dashed border-[#C5A880]/10" />
              
              {/* Center Stage: Actual Provided Logo (Ravora_logo.png) */}
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden bg-stone-900 border border-[#C5A880]/40 p-2 flex items-center justify-center shadow-[0_0_25px_rgba(197,168,128,0.25)] luxury-glow">
                <img 
                  src="/Ravora_logo.png" 
                  alt="Ravora Authentic Logo" 
                  className="h-full w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            
            {/* Logo Subtitle & Credentials */}
            <div className="mt-2 text-center space-y-1">
              <span className="font-serif text-xs tracking-[0.45em] text-[#C5A880] uppercase font-bold block">
                Heritage Atelier • Established 1928
              </span>
              <div className="w-16 h-[1px] bg-[#C5A880]/30 mx-auto" />
            </div>
          </div>

          {/* Slogan exactly matching the style in your design */}
          <h2 
            className="font-serif text-3xl sm:text-5xl md:text-6xl tracking-wide text-[#FCFBF9] leading-[1.1] uppercase"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Wear your <span className="text-[#C5A880] italic">Drapes</span> with <br className="hidden sm:inline" />
            <span className="relative">
              Confidence.
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A880] to-transparent opacity-60" />
            </span>
          </h2>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-stone-300 font-sans leading-relaxed tracking-wide font-light">
            Namaskar. For nearly a century, Ravora has united ancestral handloom guilds with modern silhouettes, ensuring that every silk fiber carries the pulse of a master weaver.
          </p>
        </div>

        {/* Dynamic Split Editorial Showcase (Aesthetic visual mirroring your design layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Block: Narrative Detail */}
          <div className="lg:col-span-5 bg-[#121110]/50 border border-stone-800/80 rounded-3xl p-8 sm:p-12 flex flex-col justify-between space-y-8 shadow-xl relative overflow-hidden backdrop-blur-md">
            
            {/* Subtle background graphic */}
            <div className="absolute -bottom-10 -right-10 text-[10rem] font-serif font-extralight text-stone-900/20 select-none pointer-events-none">
              R
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#C5A880]/10 border border-[#C5A880]/30 rounded-full text-[9px] text-[#C5A880] uppercase tracking-widest font-mono">
                <Sparkles className="h-3 w-3" />
                <span>The Loom Oath</span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FCFBF9] font-light leading-snug uppercase">
                Bridging Ancestral Wefts <br />
                With <span className="text-[#C5A880] italic">Sovereign Style</span>
              </h3>

              <p className="text-xs text-stone-300 leading-relaxed font-light">
                To draping a Ravora creation is to feel the patient rhythmic cadence of the loom shuttle. Since 1928, our guild has operated from the outskirts of Madurai and the handloom hubs of South India. 
              </p>

              <p className="text-xs text-stone-400 leading-relaxed font-light">
                By bypassing industrial middlemen, we return <span className="text-[#C5A880] font-semibold">72% of each purchase value</span> directly back to the weaving households, ensuring this heritage art remains vibrant for generations.
              </p>
            </div>

            {/* Interactive Audio Experience */}
            <div className="pt-6 border-t border-stone-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">
                  Atmospheric Soundscape
                </p>
                <h4 className="text-xs font-serif font-bold text-[#FCFBF9] mt-0.5">
                  Sounds of the Loom Atelier
                </h4>
              </div>
              
              <button
                onClick={playLoomSound}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isPlayingLoomSound
                    ? "bg-[#C5A880] text-[#080807] border-[#C5A880] animate-pulse"
                    : "border-stone-800 text-stone-300 hover:border-[#C5A880] hover:text-[#FAF8F5]"
                }`}
                id="story-play-audio"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{isPlayingLoomSound ? "Playing Loom..." : "Listen Craft"}</span>
              </button>
            </div>

          </div>

          {/* Right Block: Pure High Fashion Portrait */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden relative min-h-[380px] sm:min-h-[460px] bg-stone-900 border border-stone-800 shadow-xl group">
            {/* Visual Portrait */}
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
              alt="Elite heritage bridal couture drape"
              className="absolute inset-0 h-full w-full object-cover object-top scale-[1.03] group-hover:scale-100 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
            {/* Dark Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            {/* Bottom Floating Legend Tag */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/45 backdrop-blur-md rounded-2xl border border-[#C5A880]/20 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono text-[#C5A880] uppercase tracking-wider">
                  Model Wearing
                </span>
                <p className="text-xs font-serif font-bold text-white mt-0.5">
                  Mayil Peacock Pure Kanchipuram Silk Saree
                </p>
              </div>
              <span className="text-[9px] font-mono text-stone-400 bg-stone-950/80 px-2.5 py-1 rounded-full">
                Heritage Series 01
              </span>
            </div>
          </div>

        </div>

        {/* Striking Satin-Gold Statistics Ribbon Banner (As shown in your shared layout) */}
        <div 
          className="rounded-3xl bg-gradient-to-r from-[#AA7C11] via-[#F3E5AB] to-[#C5A880] p-0.5 shadow-2xl relative overflow-hidden"
          id="story-stats-ribbon"
        >
          {/* Inner Glossy Surface */}
          <div className="rounded-[22px] bg-gradient-to-r from-[#B5945B] via-[#E9D098] to-[#9E7A3E] px-6 py-10 sm:py-12 text-[#080807] relative overflow-hidden">
            
            {/* Light glare sweeps */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-[#080807]/10 text-center items-center">
              
              {/* Stat 1 */}
              <div className="space-y-1 py-4 md:py-0">
                <span className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight block">
                  35
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#080807]/80">
                  Master Loom Guilds
                </p>
                <p className="text-[10px] text-[#080807]/60 max-w-xs mx-auto font-sans">
                  Sustaining localized hand-weaving circles throughout South India.
                </p>
              </div>

              {/* Stat 2 */}
              <div className="space-y-1 py-4 md:py-0">
                <span className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight block">
                  120+
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#080807]/80">
                  Generational Artisans
                </p>
                <p className="text-[10px] text-[#080807]/60 max-w-xs mx-auto font-sans">
                  Honoring the hereditary techniques passed down over seven generations.
                </p>
              </div>

              {/* Stat 3 */}
              <div className="space-y-1 py-4 md:py-0">
                <span className="font-serif text-4xl sm:text-5xl font-extrabold tracking-tight block">
                  1928
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#080807]/80">
                  Established Heritage
                </p>
                <p className="text-[10px] text-[#080807]/60 max-w-xs mx-auto font-sans">
                  Rooted in Madurai, building timeless textiles with modern cuts.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Section: Exclusive Materials & Craft Details (Equivalent to Exclusive Products centered heading) */}
        <div className="space-y-10">
          <div className="text-center space-y-3.5">
            <span className="inline-block h-0.5 w-12 bg-[#C5A880]" />
            <p className="text-[10px] text-[#C5A880] uppercase tracking-[0.3em] font-bold">
              Exclusive Materials
            </p>
            <h3 
              className="font-serif text-3xl sm:text-4xl text-[#FCFBF9] font-light tracking-wide uppercase"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              The DNA of Ravora
            </h3>
            <p className="max-w-xl mx-auto text-xs text-stone-400 font-sans leading-relaxed">
              Every single product we place in our active stock register carries pristine structural integrity because we refuse synthetic thread fillers.
            </p>
          </div>

          {/* Interactive Material Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Mulberry Silk */}
            <div 
              onClick={() => setActiveStorySegment("heritage")}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-80 relative overflow-hidden group ${
                activeStorySegment === "heritage"
                  ? "bg-[#121110] border-[#C5A880] shadow-md shadow-[#C5A880]/5"
                  : "bg-[#121110]/40 border-stone-850 hover:border-stone-800"
              }`}
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#C5A880]">
                  <Heart className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#FCFBF9] uppercase tracking-wide">
                  Pure Mulberry Thread
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Sourced ethically from accredited sericulture farmers in South India. Features high fiber elasticity, natural shimmering luster, and a high-twist tensile strength.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-850">
                <span className="text-[10px] font-mono text-[#C5A880]">Silk Mark Certified</span>
                <ArrowUpRight className="h-4 w-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
              </div>
              {/* Image background hint */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-t from-stone-950/20 to-transparent opacity-10 group-hover:opacity-20 transition-opacity" />
            </div>

            {/* Card 2: Metallic Silver Zari */}
            <div 
              onClick={() => setActiveStorySegment("zari")}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-80 relative overflow-hidden group ${
                activeStorySegment === "zari"
                  ? "bg-[#121110] border-[#C5A880] shadow-md shadow-[#C5A880]/5"
                  : "bg-[#121110]/40 border-stone-850 hover:border-stone-800"
              }`}
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#C5A880]">
                  <Award className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#FCFBF9] uppercase tracking-wide">
                  Antique Silver-Plated Zari
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Our gold threading consists of fine metallic silver-plated copper wire, finished with a 24-karat antique liquid gold bath. It never tarnishes and holds permanent heirloom value.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-850">
                <span className="text-[10px] font-mono text-[#C5A880]">100% Precious Alloy</span>
                <ArrowUpRight className="h-4 w-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
              </div>
              {/* Image background hint */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-t from-stone-950/20 to-transparent opacity-10 group-hover:opacity-20 transition-opacity" />
            </div>

            {/* Card 3: Traditional Wood Looms */}
            <div 
              onClick={() => setActiveStorySegment("weaving")}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-80 relative overflow-hidden group ${
                activeStorySegment === "weaving"
                  ? "bg-[#121110] border-[#C5A880] shadow-md shadow-[#C5A880]/5"
                  : "bg-[#121110]/40 border-stone-850 hover:border-stone-800"
              }`}
            >
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-[#C5A880]">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#FCFBF9] uppercase tracking-wide">
                  Ancestral Wooden Looms
                </h4>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  Using traditional wooden fly-shuttle frames, each drape requires patient hand-tensioning of up to 10,000 threads. A single saree represents up to 18 days of manual mastercraft.
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-stone-850">
                <span className="text-[10px] font-mono text-[#C5A880]">100% Pure Handloom</span>
                <ArrowUpRight className="h-4 w-4 text-stone-500 group-hover:text-[#C5A880] transition-colors" />
              </div>
              {/* Image background hint */}
              <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-t from-stone-950/20 to-transparent opacity-10 group-hover:opacity-20 transition-opacity" />
            </div>

          </div>
        </div>

        {/* Footer Emblem Pledge */}
        <div className="rounded-3xl border border-stone-850 bg-stone-950/35 p-8 text-center max-w-2xl mx-auto space-y-4">
          <p className="font-serif text-lg font-semibold text-[#FCFBF9] uppercase">
            The Ravora Pledge
          </p>
          <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
            "We build only what we love, we honor those who weave, and we never compromise on zari purity."
          </p>
          <div className="flex justify-center space-x-1.5 pt-2">
            <span className="h-1 w-1 rounded-full bg-[#C5A880]" />
            <span className="h-1 w-6 rounded-full bg-[#C5A880]" />
            <span className="h-1 w-1 rounded-full bg-[#C5A880]" />
          </div>
        </div>

      </div>
    </div>
  );
}
