import React from "react";
import { Filter, RotateCcw, Search } from "lucide-react";
import { FilterState } from "../types";

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
  availableCounts: {
    categories: Record<string, number>;
    motifs: Record<string, number>;
    colors: Record<string, number>;
  };
}

export default function Filters({
  filters,
  onFilterChange,
  onReset,
  availableCounts,
}: FiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const toggleCategory = (cat: string) => {
    const isSelected = filters.category.includes(cat);
    const newCats = isSelected
      ? filters.category.filter((c) => c !== cat)
      : [...filters.category, cat];
    onFilterChange({ ...filters, category: newCats });
  };

  const toggleMotif = (motif: string) => {
    const isSelected = filters.motif.includes(motif);
    const newMotifs = isSelected
      ? filters.motif.filter((m) => m !== motif)
      : [...filters.motif, motif];
    onFilterChange({ ...filters, motif: newMotifs });
  };

  const toggleColor = (color: string) => {
    const isSelected = filters.color.includes(color);
    const newColors = isSelected
      ? filters.color.filter((c) => c !== color)
      : [...filters.color, color];
    onFilterChange({ ...filters, color: newColors });
  };

  const selectPriceBracket = (bracket: "all" | "budget" | "mid" | "luxury") => {
    let range: [number, number] = [0, 30000];
    if (bracket === "budget") range = [0, 5000];
    else if (bracket === "mid") range = [5000, 12000];
    else if (bracket === "luxury") range = [12000, 30000];

    onFilterChange({ ...filters, priceRange: range });
  };

  const categories = ["Sarees", "Langa Voni", "Kurtas & Shirts", "Dresses & Indo-Western"];
  const motifs = ["Peacock (Mayil)", "Temple Border (Gopuram)", "Lotus (Kamalam)", "Mango (Paisley)", "Geometric (Ikat)"];
  const colors = [
    { name: "Peacock Teal", hex: "#0D9488" },
    { name: "Kanchipuram Gold", hex: "#CA8A04" },
    { name: "Temple Crimson", hex: "#991B1B" },
    { name: "Indigo Navy", hex: "#1E40AF" },
    { name: "Kerala Ivory", hex: "#FAF9F6" }
  ];

  const currentBracket = () => {
    const [min, max] = filters.priceRange;
    if (min === 0 && max === 5000) return "budget";
    if (min === 5000 && max === 12000) return "mid";
    if (min === 12000 && max === 30000) return "luxury";
    return "all";
  };

  return (
    <div className="space-y-6 rounded-3xl border border-stone-800 bg-[#121110] p-5 shadow-md" id="filters-sidebar">
      {/* Search Bar section */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block">
          Search Ensemble
        </label>
        <div className="relative rounded-lg shadow-2xs">
          <input
            type="text"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search silk, linen, motifs..."
            className="w-full rounded-lg border border-stone-800 px-3.5 py-2 pl-9 text-xs focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880] focus:outline-none bg-stone-900 text-[#FCFBF9]"
            id="filter-search-input"
          />
          <Search className="absolute top-2.5 left-3 h-4 w-4 text-stone-500" />
        </div>
      </div>

      <div className="h-px bg-stone-850" />

      {/* Categories select checklist */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A880]">
          Garment Styles
        </h3>
        <div className="space-y-2.5" id="filter-categories">
          {categories.map((cat) => {
            const count = availableCounts.categories[cat] || 0;
            return (
              <label
                key={cat}
                className="flex items-center justify-between text-xs text-stone-400 hover:text-[#FCFBF9] cursor-pointer font-sans tracking-wide"
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={filters.category.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-stone-800 text-[#C5A880] accent-[#C5A880] focus:ring-[#C5A880] h-4 w-4 cursor-pointer"
                  />
                  <span>{cat}</span>
                </div>
                <span className="text-xs font-mono text-stone-600">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-stone-850" />

      {/* Motifs pattern select checklist */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A880]">
          Cultural Motifs
        </h3>
        <div className="space-y-2.5" id="filter-motifs">
          {motifs.map((motif) => {
            const count = availableCounts.motifs[motif] || 0;
            return (
              <label
                key={motif}
                className="flex items-center justify-between text-xs text-stone-400 hover:text-[#FCFBF9] cursor-pointer font-sans tracking-wide"
              >
                <div className="flex items-center space-x-2.5">
                  <input
                    type="checkbox"
                    checked={filters.motif.includes(motif)}
                    onChange={() => toggleMotif(motif)}
                    className="rounded border-stone-800 text-[#C5A880] accent-[#C5A880] focus:ring-[#C5A880] h-4 w-4 cursor-pointer"
                  />
                  <span className="truncate max-w-[150px]">{motif}</span>
                </div>
                <span className="text-xs font-mono text-stone-600">({count})</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-stone-850" />

      {/* Colors Swatches select checkboxes */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A880]">
          Artisan Colorways
        </h3>
        <div className="flex flex-col gap-2" id="filter-colors">
          {colors.map((color) => {
            const isSelected = filters.color.includes(color.name);
            const count = availableCounts.colors[color.name] || 0;
            return (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className={`flex items-center justify-between w-full p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-stone-900 border-[#C5A880] shadow-2xs"
                    : "bg-transparent border-transparent hover:bg-stone-900/60"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-stone-800"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-stone-300 font-medium tracking-wide">{color.name}</span>
                </div>
                <span className="text-stone-500 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-stone-850" />

      {/* Price filter section */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C5A880]">
          Zari & Budget Brackets
        </h3>
        <div className="grid grid-cols-2 gap-2" id="filter-price-buttons">
          <button
            onClick={() => selectPriceBracket("all")}
            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${
              currentBracket() === "all"
                ? "bg-[#C5A880] text-[#080807] border-[#C5A880]"
                : "bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-850 hover:text-stone-300"
            }`}
          >
            All Prices
          </button>
          <button
            onClick={() => selectPriceBracket("budget")}
            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${
              currentBracket() === "budget"
                ? "bg-[#C5A880] text-[#080807] border-[#C5A880]"
                : "bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-850 hover:text-stone-300"
            }`}
          >
            Under ₹5,000
          </button>
          <button
            onClick={() => selectPriceBracket("mid")}
            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${
              currentBracket() === "mid"
                ? "bg-[#C5A880] text-[#080807] border-[#C5A880]"
                : "bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-850 hover:text-stone-300"
            }`}
          >
            ₹5k - ₹12k
          </button>
          <button
            onClick={() => selectPriceBracket("luxury")}
            className={`px-3 py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg border text-center transition-all cursor-pointer ${
              currentBracket() === "luxury"
                ? "bg-[#C5A880] text-[#080807] border-[#C5A880]"
                : "bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-850 hover:text-stone-300"
            }`}
          >
            Above ₹12k
          </button>
        </div>
        <div className="mt-2 text-[10px] text-stone-500 font-mono text-center">
          Active: ₹{filters.priceRange[0].toLocaleString("en-IN")} - ₹{filters.priceRange[1].toLocaleString("en-IN")}
        </div>
      </div>

      <div className="h-px bg-stone-850" />

      {/* Reset CTA */}
      <button
        onClick={onReset}
        className="flex w-full items-center justify-center space-x-2 py-2 text-[11px] font-bold text-[#C5A880] hover:text-[#E5C49F] transition-colors uppercase tracking-widest cursor-pointer"
        id="filter-reset-btn"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
}
