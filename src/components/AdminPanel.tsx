import React, { useState, useMemo } from "react";
import { 
  Plus, Edit3, Trash2, Check, X, ShieldAlert, Library, Sparkles, 
  ReceiptText, BarChart3, TrendingUp, DollarSign, AlertTriangle, 
  Percent, Grid, Tag, SlidersHorizontal, Image as ImageIcon, FileText, Palette,
  Truck, ShieldCheck, Users
} from "lucide-react";
import { Product, Order, StoryGroup, StorySlide } from "../types";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, "id">) => Promise<void>;
  onUpdateProduct: (id: string, updateData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  storyGroups: Record<string, StoryGroup>;
  onUpdateStories: (updated: Record<string, StoryGroup>) => Promise<void>;
}

export default function AdminPanel({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  storyGroups,
  onUpdateStories,
}: AdminPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Admin sub-tabs state: "inventory" vs "stories"
  const [adminSubTab, setAdminSubTab] = useState<"inventory" | "stories">("inventory");

  // Story management editing state
  const [selectedGroupKey, setSelectedGroupKey] = useState<string>("catalog");
  const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);

  // Form states for adding a new story slide
  const [newSlideImage, setNewSlideImage] = useState("");
  const [newSlideTitle, setNewSlideTitle] = useState("");
  const [newSlideSubtitle, setNewSlideSubtitle] = useState("");
  const [newSlideDescription, setNewSlideDescription] = useState("");
  const [newSlideBadge, setNewSlideBadge] = useState("");

  // Form states for editing a story slide
  const [editSlideImage, setEditSlideImage] = useState("");
  const [editSlideTitle, setEditSlideTitle] = useState("");
  const [editSlideSubtitle, setEditSlideSubtitle] = useState("");
  const [editSlideDescription, setEditSlideDescription] = useState("");
  const [editSlideBadge, setEditSlideBadge] = useState("");

  // Story action message
  const [storyMsg, setStoryMsg] = useState("");
  
  // Modal Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for new product
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<Product["category"]>("Sarees");
  const [newPrice, setNewPrice] = useState("");
  const [newOriginalPrice, setNewOriginalPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newFabric, setNewFabric] = useState("");
  const [newMotif, setNewMotif] = useState<Product["motif"]>("Peacock (Mayil)");
  const [newColor, setNewColor] = useState("Peacock Teal");
  const [newColorHex, setNewColorHex] = useState("#0D9488");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [formMsg, setFormMsg] = useState("");

  // Modal form states for editing product
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState<Product["category"]>("Sarees");
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editFabric, setEditFabric] = useState("");
  const [editMotif, setEditMotif] = useState<Product["motif"]>("Peacock (Mayil)");
  const [editColor, setEditColor] = useState("");
  const [editColorHex, setEditColorHex] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editIsFeatured, setEditIsFeatured] = useState(false);

  // Stock table search and filter states
  const [adminSearch, setAdminSearch] = useState("");
  const [adminCategory, setAdminCategory] = useState<string>("All");
  const [adminMotif, setAdminMotif] = useState<string>("All");
  const [adminStockStatus, setAdminStockStatus] = useState<string>("All"); // All, Out of Stock, Low Stock (<=5), High Stock (>5)

  // Handlers for dynamic discount updates in the editing popup
  const [discountVal, setDiscountVal] = useState<number>(0);
  const [discountPct, setDiscountPct] = useState<number>(0);

  // Setup the modal form with the selected product's data
  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(product.price);
    setEditOriginalPrice(product.originalPrice || product.price);
    setEditStock(product.stock);
    setEditFabric(product.fabric);
    setEditMotif(product.motif);
    setEditColor(product.color);
    setEditColorHex(product.colorHex);
    setEditImageUrl(product.images[0] || "");
    setEditDescription(product.description);
    setEditIsFeatured(product.isFeatured || false);

    // Initial discount values
    const original = product.originalPrice || product.price;
    const finalPrice = product.price;
    const val = Math.max(0, original - finalPrice);
    const pct = original > 0 ? Math.round((val / original) * 100) : 0;
    setDiscountVal(val);
    setDiscountPct(pct);
  };

  // Synchronize pricing fields: Original Price changed
  const handleOriginalPriceChange = (value: number) => {
    const orig = Math.max(0, value);
    setEditOriginalPrice(orig);
    // Keep discount percentage constant to calculate new selling price
    const newPriceVal = Math.round(orig * (1 - discountPct / 100));
    setEditPrice(newPriceVal);
    setDiscountVal(orig - newPriceVal);
  };

  // Synchronize pricing fields: Discount Value (INR) changed
  const handleDiscountValChange = (value: number) => {
    const dVal = Math.max(0, value);
    setDiscountVal(dVal);
    const finalPrice = Math.max(0, editOriginalPrice - dVal);
    setEditPrice(finalPrice);
    const pct = editOriginalPrice > 0 ? Math.round((dVal / editOriginalPrice) * 100) : 0;
    setDiscountPct(pct);
  };

  // Synchronize pricing fields: Discount Percentage (%) changed
  const handleDiscountPctChange = (value: number) => {
    const dPct = Math.min(100, Math.max(0, value));
    setDiscountPct(dPct);
    const finalPrice = Math.round(editOriginalPrice * (1 - dPct / 100));
    setEditPrice(finalPrice);
    setDiscountVal(editOriginalPrice - finalPrice);
  };

  // Synchronize pricing fields: Final Selling Price changed
  const handleSellingPriceChange = (value: number) => {
    const sPrice = Math.max(0, value);
    setEditPrice(sPrice);
    const dVal = Math.max(0, editOriginalPrice - sPrice);
    setDiscountVal(dVal);
    const pct = editOriginalPrice > 0 ? Math.round((dVal / editOriginalPrice) * 100) : 0;
    setDiscountPct(pct);
  };

  // Save changes from Modal
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (!editName.trim() || !editFabric.trim() || !editColor.trim()) {
      alert("Name, Fabric specification, and Color name cannot be empty.");
      return;
    }

    if (editPrice <= 0 || editOriginalPrice <= 0) {
      alert("Price variables must be positive values.");
      return;
    }

    if (editStock < 0) {
      alert("Stock cannot be negative.");
      return;
    }

    try {
      await onUpdateProduct(editingProduct.id, {
        name: editName,
        category: editCategory,
        price: editPrice,
        originalPrice: editOriginalPrice,
        stock: editStock,
        fabric: editFabric,
        motif: editMotif,
        color: editColor,
        colorHex: editColorHex,
        images: [editImageUrl.trim() || "https://images.unsplash.com/photo-1590075865003-e48277adc558?auto=format&fit=crop&w=800&q=80"],
        description: editDescription,
        isFeatured: editIsFeatured,
      });
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to save product edits. Please verify variables.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg("");

    if (!newName.trim() || !newFabric.trim() || !newColor.trim()) {
      setFormMsg("Please provide title, fabric and color names.");
      return;
    }

    const priceNum = parseFloat(newPrice);
    const stockNum = parseInt(newStock);

    if (isNaN(priceNum) || priceNum <= 0) {
      setFormMsg("Invalid garment price definition.");
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      setFormMsg("Stock count must be a non-negative integer.");
      return;
    }

    const imgResolved = newImageUrl.trim() || "https://images.unsplash.com/photo-1590075865003-e48277adc558?auto=format&fit=crop&w=800&q=80";

    try {
      await onAddProduct({
        name: newName,
        category: newCategory,
        price: priceNum,
        originalPrice: parseFloat(newOriginalPrice) || priceNum,
        stock: stockNum,
        description: newDescription || "Authentic South Indian garments curated with modern silhouettes.",
        fabric: newFabric,
        motif: newMotif,
        color: newColor,
        colorHex: newColorHex,
        images: [imgResolved]
      });

      // Reset form
      setNewName("");
      setNewPrice("");
      setNewOriginalPrice("");
      setNewStock("");
      setNewFabric("");
      setNewDescription("");
      setNewImageUrl("");
      setShowAddForm(false);
    } catch (err: any) {
      setFormMsg(err.message || "Failed to add product.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to retire "${name}" from the loom active catalog?`)) {
      try {
        await onDeleteProduct(id);
      } catch (e) {
        alert("Failed to delete product.");
      }
    }
  };

  // Stories handlers
  const handleAddStorySlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoryMsg("");

    if (!newSlideImage.trim() || !newSlideTitle.trim() || !newSlideSubtitle.trim() || !newSlideDescription.trim()) {
      setStoryMsg("Please fill in image URL, title, subtitle, and description.");
      return;
    }

    const group = storyGroups[selectedGroupKey];
    if (!group) return;

    const newSlide: StorySlide = {
      image: newSlideImage.trim(),
      title: newSlideTitle.trim(),
      subtitle: newSlideSubtitle.trim(),
      description: newSlideDescription.trim(),
      badge: newSlideBadge.trim() || undefined,
    };

    const updatedSlides = [...(group.slides || []), newSlide];
    const updatedGroup = { ...group, slides: updatedSlides };
    const updatedStories = { ...storyGroups, [selectedGroupKey]: updatedGroup };

    try {
      await onUpdateStories(updatedStories);
      setNewSlideImage("");
      setNewSlideTitle("");
      setNewSlideSubtitle("");
      setNewSlideDescription("");
      setNewSlideBadge("");
      setStoryMsg("Story slide successfully added!");
      setTimeout(() => setStoryMsg(""), 3000);
    } catch (err) {
      setStoryMsg("Failed to add story slide.");
    }
  };

  const handleStartEditSlide = (slide: StorySlide, index: number) => {
    setEditingSlideIndex(index);
    setEditSlideImage(slide.image);
    setEditSlideTitle(slide.title);
    setEditSlideSubtitle(slide.subtitle);
    setEditSlideDescription(slide.description);
    setEditSlideBadge(slide.badge || "");
  };

  const handleSaveSlideEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoryMsg("");

    if (editingSlideIndex === null) return;
    if (!editSlideImage.trim() || !editSlideTitle.trim() || !editSlideSubtitle.trim() || !editSlideDescription.trim()) {
      setStoryMsg("Image, title, subtitle, and description are required.");
      return;
    }

    const group = storyGroups[selectedGroupKey];
    if (!group) return;

    const updatedSlide: StorySlide = {
      image: editSlideImage.trim(),
      title: editSlideTitle.trim(),
      subtitle: editSlideSubtitle.trim(),
      description: editSlideDescription.trim(),
      badge: editSlideBadge.trim() || undefined,
    };

    const updatedSlides = [...(group.slides || [])];
    updatedSlides[editingSlideIndex] = updatedSlide;

    const updatedGroup = { ...group, slides: updatedSlides };
    const updatedStories = { ...storyGroups, [selectedGroupKey]: updatedGroup };

    try {
      await onUpdateStories(updatedStories);
      setEditingSlideIndex(null);
      setStoryMsg("Story slide updated successfully!");
      setTimeout(() => setStoryMsg(""), 3000);
    } catch (err) {
      setStoryMsg("Failed to update story slide.");
    }
  };

  const handleDeleteSlide = async (index: number) => {
    if (!confirm("Are you sure you want to delete this story slide?")) return;
    setStoryMsg("");

    const group = storyGroups[selectedGroupKey];
    if (!group) return;

    const updatedSlides = (group.slides || []).filter((_, idx) => idx !== index);
    const updatedGroup = { ...group, slides: updatedSlides };
    const updatedStories = { ...storyGroups, [selectedGroupKey]: updatedGroup };

    try {
      await onUpdateStories(updatedStories);
      setStoryMsg("Story slide deleted successfully.");
      setTimeout(() => setStoryMsg(""), 3000);
    } catch (err) {
      setStoryMsg("Failed to delete story slide.");
    }
  };

  // --- Dynamic calculations for Advanced Analytics & Intelligent Metrics ---
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const totalItemsSold = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);
  }, [orders]);

  const inventoryValuation = useMemo(() => {
    return products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  }, [products]);

  const averageOrderValue = useMemo(() => {
    return orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  }, [orders, totalRevenue]);

  // Top products sold ranking
  const topSellingProducts = useMemo(() => {
    const tracking: { [key: string]: { name: string; units: number; revenue: number } } = {};
    orders.forEach(o => {
      o.items.forEach(item => {
        if (!tracking[item.productId]) {
          tracking[item.productId] = { name: item.name, units: 0, revenue: 0 };
        }
        tracking[item.productId].units += item.quantity;
        tracking[item.productId].revenue += (item.price * item.quantity);
      });
    });

    return Object.entries(tracking)
      .map(([id, stats]) => ({ id, ...stats }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 3);
  }, [orders]);

  // Categories distribution
  const categoryStats = useMemo(() => {
    const breakdown = {
      "Sarees": { units: 0, revenue: 0 },
      "Langa Voni": { units: 0, revenue: 0 },
      "Kurtas & Shirts": { units: 0, revenue: 0 },
      "Dresses & Indo-Western": { units: 0, revenue: 0 }
    };

    orders.forEach(o => {
      o.items.forEach(item => {
        // Find category of item from products if available, else infer
        const originalP = products.find(p => p.id === item.productId);
        const categoryKey = originalP ? originalP.category : "Sarees";
        if (breakdown[categoryKey]) {
          breakdown[categoryKey].units += item.quantity;
          breakdown[categoryKey].revenue += (item.price * item.quantity);
        }
      });
    });

    return Object.entries(breakdown).map(([cat, val]) => ({
      name: cat,
      units: val.units,
      revenue: val.revenue,
      pct: totalRevenue > 0 ? Math.round((val.revenue / totalRevenue) * 100) : 0
    }));
  }, [orders, products, totalRevenue]);

  // Low stock counter
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock <= 5);
  }, [products]);

  // Filtered products for stock register table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search match
      const sMatches = 
        p.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
        p.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
        p.fabric.toLowerCase().includes(adminSearch.toLowerCase());

      // Category match
      const cMatches = adminCategory === "All" || p.category === adminCategory;

      // Motif match
      const mMatches = adminMotif === "All" || p.motif.includes(adminMotif);

      // Stock status match
      let sStatusMatches = true;
      if (adminStockStatus === "Out of Stock") {
        sStatusMatches = p.stock === 0;
      } else if (adminStockStatus === "Low Stock") {
        sStatusMatches = p.stock > 0 && p.stock <= 5;
      } else if (adminStockStatus === "In Stock") {
        sStatusMatches = p.stock > 5;
      }

      return sMatches && cMatches && mMatches && sStatusMatches;
    });
  }, [products, adminSearch, adminCategory, adminMotif, adminStockStatus]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-stone-300" id="admin-panel-container">
      
      {/* Admin Title Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-stone-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#3E59FA] block font-mono">
            Administrative Back-Office
          </span>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#FCFBF9] mt-1">
            Atelier Back-Office Console
          </h2>
        </div>
        
        {adminSubTab === "inventory" && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="mt-4 md:mt-0 flex items-center space-x-2 rounded-xl bg-[#3E59FA] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#2A45E2] hover:shadow-[0_4px_20px_rgba(62,89,250,0.4)] transition-all active:scale-98 cursor-pointer"
            id="admin-toggle-add-form"
          >
            {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            <span>{showAddForm ? "Close Form" : "Add New Garment"}</span>
          </button>
        )}
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex space-x-2 border-b border-stone-850 pb-px">
        <button
          onClick={() => {
            setAdminSubTab("inventory");
            setShowAddForm(false);
          }}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all cursor-pointer relative ${
            adminSubTab === "inventory"
              ? "text-[#3E59FA] font-extrabold"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Inventory Register
          {adminSubTab === "inventory" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E59FA] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setAdminSubTab("stories")}
          className={`px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] transition-all cursor-pointer relative ${
            adminSubTab === "stories"
              ? "text-[#3E59FA] font-extrabold"
              : "text-stone-400 hover:text-stone-200"
          }`}
        >
          Highlights Stories
          {adminSubTab === "stories" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3E59FA] rounded-full" />
          )}
        </button>
      </div>

      {adminSubTab === "inventory" ? (
        <div className="space-y-8" id="admin-inventory-tab-content">
          {/* --- Part 1: Interactive Advanced Analytics Section --- */}
          <div className="space-y-6" id="admin-analytics-dashboard">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-[#3E59FA]" />
              <h3 className="font-serif text-lg font-bold text-[#FCFBF9]">
                Atelier Sales & Stock Intelligence
              </h3>
            </div>

        {/* Analytics Key Numbers */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="analytics-key-metrics">
          
          {/* Revenue */}
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-4 flex flex-col justify-between shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Total Revenue
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-xl sm:text-2xl font-bold text-[#FCFBF9] font-mono">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-[10px] text-stone-500 mt-1 font-sans">
              From {orders.length} order reservations.
            </p>
          </div>

          {/* Asset Valuation */}
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-4 flex flex-col justify-between shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Inventory Assets
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-xl sm:text-2xl font-bold text-[#C5A880] font-mono">
                ₹{inventoryValuation.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1 font-sans">
              Value of {products.reduce((acc, curr) => acc + curr.stock, 0)} on-loom garments.
            </p>
          </div>

          {/* Garments Sold */}
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-4 flex flex-col justify-between shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Garments Dispatched
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className="text-xl sm:text-2xl font-bold text-[#FCFBF9] font-mono">
                {totalItemsSold} Units
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1 font-sans">
              Average {averageOrderValue > 0 ? `₹${averageOrderValue.toLocaleString("en-IN")}` : "N/A"} order cart.
            </p>
          </div>

          {/* Low Stock count */}
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-4 flex flex-col justify-between shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">
              Low Stock Alerts
            </span>
            <div className="flex items-baseline space-x-1.5 mt-2">
              <span className={`text-xl sm:text-2xl font-bold font-mono ${lowStockProducts.length > 0 ? "text-amber-500" : "text-emerald-500"}`}>
                {lowStockProducts.length} Items
              </span>
              {lowStockProducts.length > 0 && <AlertTriangle className="h-4 w-4 text-amber-500 animate-bounce" />}
            </div>
            <p className="text-[10px] text-stone-500 mt-1 font-sans">
              Products with 5 or fewer on-loom items.
            </p>
          </div>

        </div>

        {/* Visual Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart 1: Revenue by Category (HTML/CSS Progress Graphic) */}
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-850 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#FCFBF9]">
                Revenue Distribution by Category
              </h4>
              <span className="text-[9px] font-mono text-[#C5A880]">Loom Breakdown</span>
            </div>
            
            <div className="space-y-4 pt-1">
              {categoryStats.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-sans">
                    <span className="text-stone-300 font-medium">{cat.name}</span>
                    <span className="font-mono text-stone-400">
                      ₹{cat.revenue.toLocaleString("en-IN")} ({cat.pct}%)
                    </span>
                  </div>
                  {/* Custom Progress Bar */}
                  <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#C5A880]/60 to-[#C5A880]" 
                      style={{ width: `${Math.max(3, cat.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 2: Top Performing Products & Critical Loom Replenishment */}
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-5 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-850 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#FCFBF9]">
                  Loom Alert: Critical Low Stock (<span className="font-mono">&lt;=5</span>)
                </h4>
                <span className="text-[9px] font-mono text-amber-500">Replenishment List</span>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-stone-500 text-xs">
                  All active handlooms hold healthy stock levels.
                </div>
              ) : (
                <div className="divide-y divide-stone-850/50 max-h-48 overflow-y-auto pr-1">
                  {lowStockProducts.map(p => (
                    <div key={p.id} className="flex justify-between items-center py-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${p.stock === 0 ? "bg-red-500" : "bg-amber-500"}`} />
                        <span className="text-stone-300 font-serif truncate max-w-[200px]">{p.name}</span>
                      </div>
                      <div className="flex items-center space-x-3 font-mono">
                        <span className={`font-semibold ${p.stock === 0 ? "text-red-400" : "text-amber-400"}`}>
                          {p.stock === 0 ? "Out of Loom" : `${p.stock} left`}
                        </span>
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="text-[#C5A880] hover:underline hover:text-white text-[10px] uppercase font-bold cursor-pointer"
                        >
                          Refill
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick stats on top products */}
            <div className="border-t border-stone-850 pt-3 mt-4">
              <span className="text-[9px] uppercase tracking-widest text-stone-500 font-bold block mb-1.5">
                Top Selling Garment Models
              </span>
              {topSellingProducts.length === 0 ? (
                <p className="text-[10px] text-stone-500 italic">No reservation records recorded yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {topSellingProducts.map((p, idx) => (
                    <div key={p.id} className="bg-stone-950/40 border border-stone-850 rounded-lg p-1.5 text-center">
                      <span className="text-[9px] font-mono text-[#C5A880] font-bold">#{idx + 1} {p.units} Sold</span>
                      <p className="text-[10px] text-stone-300 font-serif truncate mt-0.5" title={p.name}>
                        {p.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Adding a new custom traditional product form */}
      {showAddForm && (
        <form 
          onSubmit={handleCreate} 
          className="rounded-3xl border border-stone-800 bg-[#0d0c0b] p-6 space-y-6 shadow-xl"
          id="admin-add-garment-form"
        >
          <div className="flex items-center space-x-2 border-b border-stone-800 pb-3 mb-2">
            <Sparkles className="h-5 w-5 text-[#C5A880]" />
            <h3 className="font-serif text-lg font-bold text-[#FCFBF9]">
              New Handloom Creation Setup
            </h3>
          </div>

          {formMsg && (
            <div className="rounded-lg bg-red-950/40 border border-red-900/40 p-3 text-xs text-red-300 font-semibold">
              {formMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Title */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Apparel / Garment Title *
              </label>
              <input
                type="text"
                required
                placeholder="Mayil Jacquard Handloom Weave"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                id="form-add-title"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Category *
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Product["category"])}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                id="form-add-category"
              >
                <option value="Sarees">Sarees</option>
                <option value="Langa Voni">Langa Voni</option>
                <option value="Kurtas & Shirts">Kurtas & Shirts</option>
                <option value="Dresses & Indo-Western">Dresses & Indo-Western</option>
              </select>
            </div>

            {/* Motif */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Heritage Motif *
              </label>
              <select
                value={newMotif}
                onChange={(e) => setNewMotif(e.target.value as Product["motif"])}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                id="form-add-motif"
              >
                <option value="Peacock (Mayil)">Peacock (Mayil)</option>
                <option value="Temple Border (Gopuram)">Temple Border (Gopuram)</option>
                <option value="Lotus (Kamalam)">Lotus (Kamalam)</option>
                <option value="Mango (Paisley)">Mango (Paisley)</option>
                <option value="Geometric (Ikat)">Geometric (Ikat)</option>
              </select>
            </div>

            {/* Fabric */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Fabric Raw Material Specification *
              </label>
              <input
                type="text"
                required
                placeholder="Pure Mulberry Silk"
                value={newFabric}
                onChange={(e) => setNewFabric(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                id="form-add-fabric"
              />
            </div>

            {/* Color */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Color Shade Name *
              </label>
              <input
                type="text"
                required
                placeholder="Temple Crimson"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                id="form-add-color-name"
              />
            </div>

            {/* Color Hex */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Color Swatch Hex
              </label>
              <div className="flex space-x-2">
                <input
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="h-8 w-10 p-0 rounded-md border border-stone-800 bg-stone-900 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#0D9488"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                  id="form-add-color-hex"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="18500"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                id="form-add-price"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Original Retail Price (₹)
              </label>
              <input
                type="number"
                min={1}
                placeholder="24000 (leave empty for same as selling)"
                value={newOriginalPrice}
                onChange={(e) => setNewOriginalPrice(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                id="form-add-original-price"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Loom Stock Level (Units) *
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="8"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                id="form-add-stock"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Garment Editorial Photo URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                id="form-add-image"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#C5A880] block mb-1">
                Garment Catalog Description
              </label>
              <textarea
                rows={3}
                placeholder="Tell the textile's story, weaving details, and styling suggestions..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                id="form-add-description"
              />
            </div>

          </div>

          <div className="pt-3 border-t border-stone-800 flex justify-end">
            <button
              type="submit"
              className="bg-[#C5A880] text-[#080807] font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl hover:bg-[#E5C49F] transition-colors cursor-pointer"
              id="form-add-submit"
            >
              Commit to Weave List
            </button>
          </div>
        </form>
      )}

      {/* --- Part 2: Dynamic Stock Table with Filter Controls ("Also the filter details as well") --- */}
      <div className="space-y-4">
        
        {/* Dynamic Filters Bar */}
        <div className="bg-[#121110] border border-stone-800 rounded-2xl p-4 space-y-4" id="stock-registry-filters">
          <div className="flex items-center justify-between border-b border-stone-850 pb-2">
            <div className="flex items-center space-x-2 text-[#C5A880]">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Registry Live Filters & Details
              </span>
            </div>
            <span className="text-[10px] font-mono text-stone-400">
              Showing {filteredProducts.length} of {products.length} Garments
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Search */}
            <div>
              <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">Search Registry</label>
              <input
                type="text"
                placeholder="Search name, fabric, ID..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="w-full rounded-lg border border-stone-850 bg-stone-950 px-3 py-1.5 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">Category</label>
              <select
                value={adminCategory}
                onChange={(e) => setAdminCategory(e.target.value)}
                className="w-full rounded-lg border border-stone-850 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Sarees">Sarees</option>
                <option value="Langa Voni">Langa Voni</option>
                <option value="Kurtas & Shirts">Kurtas & Shirts</option>
                <option value="Dresses & Indo-Western">Dresses & Indo-Western</option>
              </select>
            </div>

            {/* Motif Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">Heritage Motif</label>
              <select
                value={adminMotif}
                onChange={(e) => setAdminMotif(e.target.value)}
                className="w-full rounded-lg border border-stone-850 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
              >
                <option value="All">All Motifs</option>
                <option value="Peacock">Peacock (Mayil)</option>
                <option value="Temple">Temple Border (Gopuram)</option>
                <option value="Lotus">Lotus (Kamalam)</option>
                <option value="Mango">Mango (Paisley)</option>
                <option value="Geometric">Geometric (Ikat)</option>
              </select>
            </div>

            {/* Stock Level Filter */}
            <div>
              <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">Stock Level Alert</label>
              <select
                value={adminStockStatus}
                onChange={(e) => setAdminStockStatus(e.target.value)}
                className="w-full rounded-lg border border-stone-850 bg-stone-950 px-3 py-1.5 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
              >
                <option value="All">All Stock Levels</option>
                <option value="In Stock">Healthy (Over 5 units)</option>
                <option value="Low Stock">Low (1-5 units)</option>
                <option value="Out of Stock">Out of Stock (0 units)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Inventory management table layout */}
        <div className="rounded-3xl border border-stone-800 bg-[#121110] overflow-hidden shadow-md">
          <div className="p-5 border-b border-stone-800 bg-[#121110]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <h3 className="font-serif text-base font-bold text-[#FCFBF9]">
              On-Loom Active Stock Register
            </h3>
            <p className="text-xs text-[#C5A880] font-sans tracking-tight mt-1 sm:mt-0">
              Click the gold edit pen icon to open the complete detail editor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-950/40 text-[#C5A880] font-bold border-b border-stone-800 text-[10px] uppercase tracking-wider">
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Loom Specs</th>
                  <th className="p-4 w-36">Price Structure (₹)</th>
                  <th className="p-4 w-32">Stock Levels</th>
                  <th className="p-4 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-850/60">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-stone-500 text-xs">
                      No loom active garments match the active filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const discountValue = Math.max(0, p.originalPrice - p.price);
                    const discountPercent = p.originalPrice > 0 ? Math.round((discountValue / p.originalPrice) * 100) : 0;

                    return (
                      <tr key={p.id} className="hover:bg-stone-900/20 transition-colors">
                        
                        {/* Item title and thumbnail */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="h-12 w-10 object-cover rounded border border-stone-800 shadow-3xs"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <p className="font-semibold text-[#FCFBF9] font-serif">{p.name}</p>
                              <div className="flex items-center space-x-1.5 mt-0.5">
                                <span className="text-[10px] text-stone-500 font-mono">{p.id}</span>
                                {p.isFeatured && (
                                  <span className="bg-[#C5A880]/15 text-[#C5A880] px-1 rounded text-[8px] font-bold uppercase tracking-wide">
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category, motif and fabric specifications */}
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="inline-block text-[9px] font-bold text-[#C5A880] tracking-wider">
                              {p.category}
                            </span>
                            <p className="text-stone-300 font-medium">{p.fabric}</p>
                            <p className="text-[10px] text-stone-500 font-sans italic">{p.motif}</p>
                          </div>
                        </td>

                        {/* Price settings and discount calculations */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#FCFBF9] text-sm font-mono">
                              ₹{p.price.toLocaleString("en-IN")}
                            </span>
                            
                            {discountValue > 0 ? (
                              <div className="flex items-center space-x-1.5 mt-0.5">
                                <span className="text-[10px] text-stone-500 line-through font-mono">
                                  ₹{p.originalPrice.toLocaleString("en-IN")}
                                </span>
                                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-tight bg-amber-950/20 px-1 rounded">
                                  -{discountPercent}% (₹{discountValue.toLocaleString("en-IN")} off)
                                </span>
                              </div>
                            ) : (
                              <span className="text-[9px] text-stone-600">Full Price</span>
                            )}
                          </div>
                        </td>

                        {/* Stock level settings */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`inline-block h-2.5 w-2.5 rounded-full ${
                                p.stock === 0
                                  ? "bg-red-500"
                                  : p.stock <= 5
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                            <span className="font-semibold text-stone-300 font-mono text-sm">
                              {p.stock} units
                            </span>
                          </div>
                        </td>

                        {/* Action buttons (Modal popup trigger or Delete) */}
                        <td className="p-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-1.5">
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="p-1.5 text-[#C5A880] hover:bg-[#C5A880]/10 rounded-lg transition-colors cursor-pointer"
                              title="Full Modal Detail Editor"
                              id={`btn-start-edit-${p.id}`}
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-900 rounded-lg transition-colors cursor-pointer"
                              title="Retire Garment Style"
                              id={`btn-delete-${p.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    ) : (
      /* Highlights Stories Tab Management Console */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="admin-stories-dashboard">
        
        {/* Left Column: Narrative groups list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-stone-800 bg-[#121110] p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#3E59FA] mb-4">
              Narrative Collections
            </h3>
            <div className="space-y-2">
              {Object.keys(storyGroups || {}).map((key) => {
                const grp = storyGroups[key];
                if (!grp) return null;
                const isActive = selectedGroupKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedGroupKey(key);
                      setEditingSlideIndex(null);
                      setStoryMsg("");
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? "border-[#3E59FA] bg-[#3E59FA]/5 text-[#FCFBF9]"
                        : "border-stone-850 hover:border-stone-800 bg-[#0d0c0b] text-stone-400"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                        isActive ? "border-[#3E59FA] bg-[#3E59FA]/10 text-[#3E59FA]" : "border-stone-800 bg-stone-900 text-stone-400"
                      }`}>
                        {grp.iconName ? (
                          grp.iconName === "Sparkles" ? <Sparkles className="h-4 w-4" /> :
                          grp.iconName === "Truck" ? <Truck className="h-4 w-4" /> :
                          grp.iconName === "ShieldCheck" ? <ShieldCheck className="h-4 w-4" /> :
                          grp.iconName === "Users" ? <Users className="h-4 w-4" /> :
                          grp.iconName === "Image" ? <ImageIcon className="h-4 w-4" /> :
                          <Sparkles className="h-4 w-4" />
                        ) : (grp as any).icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider">
                          {grp.name}
                        </p>
                        <p className="text-[10px] text-stone-500 mt-0.5">
                          {grp.id} collection
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-900 border border-stone-850 font-mono text-stone-400">
                      {grp.slides?.length || 0} {grp.slides?.length === 1 ? "slide" : "slides"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-900/40 p-4 text-xs space-y-2.5 text-stone-200 leading-relaxed">
            <p className="font-bold text-amber-400">💡 Pro-Tip for Admin:</p>
            <p className="text-stone-300">Stories appear on the home page as interactive Instagram-style circular bubbles. Keep slides visual, high-resolution, and use badges sparingly for certificate callouts.</p>
          </div>
        </div>

        {/* Right Column: Group Details & Slide Manager */}
        <div className="lg:col-span-8 space-y-6">
          
          {storyMsg && (
            <div className="p-3 bg-[#3E59FA]/10 border border-[#3E59FA]/30 rounded-xl text-xs text-[#3E59FA] font-medium animate-pulse">
              {storyMsg}
            </div>
          )}

          {/* Header of Active Group */}
          {(() => {
            const grp = storyGroups[selectedGroupKey];
            if (!grp) return <p className="text-stone-400 text-xs">No story collection selected.</p>;
            
            return (
              <div className="space-y-6">
                
                {/* Slides List Card */}
                <div className="rounded-2xl border border-stone-800 bg-[#121110] p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-850 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-[#3E59FA]/10 text-[#3E59FA] flex items-center justify-center border border-[#3E59FA]/20">
                        {grp.iconName ? (
                          grp.iconName === "Sparkles" ? <Sparkles className="h-5 w-5" /> :
                          grp.iconName === "Truck" ? <Truck className="h-5 w-5" /> :
                          grp.iconName === "ShieldCheck" ? <ShieldCheck className="h-5 w-5" /> :
                          grp.iconName === "Users" ? <Users className="h-5 w-5" /> :
                          grp.iconName === "Image" ? <ImageIcon className="h-5 w-5" /> :
                          <Sparkles className="h-5 w-5" />
                        ) : (grp as any).icon}
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-[#FCFBF9]">
                          {grp.name} Slide Sequence
                        </h4>
                        <p className="text-[11px] text-stone-400 font-mono">
                          Currently showing {(grp.slides || []).length} sequential cards
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slides List */}
                  <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                    {(!grp.slides || grp.slides.length === 0) ? (
                      <div className="text-center py-8 border border-dashed border-stone-850 rounded-2xl">
                        <ImageIcon className="h-8 w-8 text-stone-600 mx-auto mb-2" />
                        <p className="text-xs text-stone-500">This story collection is currently empty.</p>
                        <p className="text-[10px] text-stone-600 mt-1">Add your first slide using the form below.</p>
                      </div>
                    ) : (
                      grp.slides.map((slide, idx) => {
                        const isEditing = editingSlideIndex === idx;
                        return (
                          <div 
                            key={idx} 
                            className={`flex flex-col sm:flex-row items-start justify-between p-4 rounded-xl border transition-all gap-4 ${
                              isEditing 
                                ? "border-[#3E59FA] bg-[#3E59FA]/5" 
                                : "border-stone-850 bg-[#0d0c0b]"
                            }`}
                          >
                            <div className="flex items-start space-x-4 flex-1">
                              <img 
                                src={slide.image} 
                                alt={slide.title} 
                                className="w-16 h-20 object-cover rounded-lg border border-stone-800 bg-stone-900 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[10px] font-mono text-[#3E59FA] font-bold bg-[#3E59FA]/10 px-1.5 py-0.5 rounded">
                                    Card {idx + 1}
                                  </span>
                                  {slide.badge && (
                                    <span className="text-[9px] font-mono text-amber-400 border border-amber-400/30 px-1 rounded uppercase tracking-wider font-semibold">
                                      {slide.badge}
                                    </span>
                                  )}
                                </div>
                                <h5 className="text-xs font-bold text-[#FCFBF9] truncate">
                                  {slide.title}
                                </h5>
                                <p className="text-[10px] text-stone-400 font-medium italic">
                                  {slide.subtitle}
                                </p>
                                <p className="text-[11px] text-stone-500 line-clamp-2">
                                  {slide.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-end">
                              <button
                                type="button"
                                onClick={() => handleStartEditSlide(slide, idx)}
                                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg border border-stone-800 bg-stone-900 text-stone-300 hover:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                <Edit3 className="h-3 w-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSlide(idx)}
                                className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3 py-1.5 rounded-lg border border-rose-950/50 bg-rose-950/10 text-rose-400 hover:bg-rose-950/30 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Active Form: Either Edit Card or Add Card */}
                {editingSlideIndex !== null ? (
                  /* Edit Slide Form */
                  <div className="rounded-2xl border border-stone-800 bg-[#121110] p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-stone-850 pb-3">
                      <h4 className="font-serif text-sm font-bold text-[#FCFBF9] flex items-center space-x-2">
                        <Edit3 className="h-4 w-4 text-[#3E59FA]" />
                        <span>Modify Slide {editingSlideIndex + 1} of {grp.name}</span>
                      </h4>
                      <button 
                        type="button"
                        onClick={() => setEditingSlideIndex(null)}
                        className="text-stone-500 hover:text-stone-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveSlideEdit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Slide Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editSlideTitle}
                            onChange={(e) => setEditSlideTitle(e.target.value)}
                            placeholder="e.g. Sarees & Drapes"
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Slide Subtitle
                          </label>
                          <input
                            type="text"
                            required
                            value={editSlideSubtitle}
                            onChange={(e) => setEditSlideSubtitle(e.target.value)}
                            placeholder="e.g. Heritage Series 01"
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Image URL
                          </label>
                          <input
                            type="url"
                            required
                            value={editSlideImage}
                            onChange={(e) => setEditSlideImage(e.target.value)}
                            placeholder="e.g. https://images.unsplash.com/..."
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Accent Badge (Optional)
                          </label>
                          <input
                            type="text"
                            value={editSlideBadge}
                            onChange={(e) => setEditSlideBadge(e.target.value)}
                            placeholder="e.g. Certificated Loom"
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                          Narrative Description
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editSlideDescription}
                          onChange={(e) => setEditSlideDescription(e.target.value)}
                          placeholder="Introduce the weaver backstory or delivery commitment detail..."
                          className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none font-sans"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingSlideIndex(null)}
                          className="px-4 py-2 border border-stone-800 text-stone-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#3E59FA] text-white hover:bg-[#2A45E2] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                        >
                          Save Slide Changes
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Add New Slide Form */
                  <div className="rounded-2xl border border-stone-800 bg-[#121110] p-6 space-y-4">
                    <div className="border-b border-stone-850 pb-3">
                      <h4 className="font-serif text-sm font-bold text-[#FCFBF9] flex items-center space-x-2">
                        <Plus className="h-4 w-4 text-[#3E59FA]" />
                        <span>Append New Narrative Slide to {grp.name}</span>
                      </h4>
                    </div>

                    <form onSubmit={handleAddStorySlide} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Slide Title
                          </label>
                          <input
                            type="text"
                            required
                            value={newSlideTitle}
                            onChange={(e) => setNewSlideTitle(e.target.value)}
                            placeholder="e.g. Master Artisan Weaving"
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Slide Subtitle
                          </label>
                          <input
                            type="text"
                            required
                            value={newSlideSubtitle}
                            onChange={(e) => setNewSlideSubtitle(e.target.value)}
                            placeholder="e.g. Heritage Series 03"
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Image URL
                          </label>
                          <input
                            type="url"
                            required
                            value={newSlideImage}
                            onChange={(e) => setNewSlideImage(e.target.value)}
                            placeholder="e.g. https://images.unsplash.com/..."
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                            Accent Badge (Optional)
                          </label>
                          <input
                            type="text"
                            value={newSlideBadge}
                            onChange={(e) => setNewSlideBadge(e.target.value)}
                            placeholder="e.g. Handloom Certified"
                            className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 font-mono">
                          Narrative Description
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={newSlideDescription}
                          onChange={(e) => setNewSlideDescription(e.target.value)}
                          placeholder="Introduce the weaver backstory or delivery commitment detail..."
                          className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#3E59FA] focus:outline-none font-sans"
                        />
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-6 py-2.5 bg-[#3E59FA] text-white hover:bg-[#2A45E2] text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md hover:shadow-[0_4px_20px_rgba(62,89,250,0.4)]"
                        >
                          Append Slide
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            );
          })()}

        </div>

      </div>
    )}

      {/* --- Part 3: Custom Backdrop-blurred Product Editing Modal Pop-up --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" id="edit-product-modal">
          <div className="relative w-full max-w-2xl bg-[#0d0c0b] border border-stone-800 rounded-3xl p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-[#C5A880]" />
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#FCFBF9] uppercase">
                    Detail Editor
                  </h3>
                  <span className="text-[10px] font-mono text-stone-500 block">
                    Garment ID: {editingProduct.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-stone-400 hover:text-[#C5A880] hover:bg-stone-850 rounded-full transition-all cursor-pointer"
                id="edit-modal-close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveChanges} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Apparel / Garment Title
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-500">
                      <FileText className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-stone-800 bg-stone-900 pl-10 pr-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                      id="modal-edit-name"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Product["category"])}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                    id="modal-edit-category"
                  >
                    <option value="Sarees">Sarees</option>
                    <option value="Langa Voni">Langa Voni</option>
                    <option value="Kurtas & Shirts">Kurtas & Shirts</option>
                    <option value="Dresses & Indo-Western">Dresses & Indo-Western</option>
                  </select>
                </div>

                {/* Motif */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Heritage Motif
                  </label>
                  <select
                    value={editMotif}
                    onChange={(e) => setEditMotif(e.target.value as Product["motif"])}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-300 focus:ring-1 focus:ring-[#C5A880] focus:outline-none"
                    id="modal-edit-motif"
                  >
                    <option value="Peacock (Mayil)">Peacock (Mayil)</option>
                    <option value="Temple Border (Gopuram)">Temple Border (Gopuram)</option>
                    <option value="Lotus (Kamalam)">Lotus (Kamalam)</option>
                    <option value="Mango (Paisley)">Mango (Paisley)</option>
                    <option value="Geometric (Ikat)">Geometric (Ikat)</option>
                  </select>
                </div>

                {/* Fabric Specs */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Fabric Raw Specification
                  </label>
                  <input
                    type="text"
                    required
                    value={editFabric}
                    onChange={(e) => setEditFabric(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                    id="modal-edit-fabric"
                  />
                </div>

                {/* Color Shade Name */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Color Shade Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editColor}
                    onChange={(e) => setEditColor(e.target.value)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                    id="modal-edit-color"
                  />
                </div>

                {/* Color Hex Picker */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Color Swatch Hex
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={editColorHex}
                      onChange={(e) => setEditColorHex(e.target.value)}
                      className="h-8 w-12 p-0 rounded border border-stone-800 bg-stone-900 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editColorHex}
                      onChange={(e) => setEditColorHex(e.target.value)}
                      className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                      id="modal-edit-colorhex"
                    />
                  </div>
                </div>

                {/* Stock Count */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    On-Loom Stock Levels (Units)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editStock}
                    onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                    id="modal-edit-stock"
                  />
                </div>

              </div>

              {/* --- REAL-TIME SYNCHRONIZED PRICING & DISCOUNTS ENGINE --- */}
              <div className="rounded-2xl border border-stone-800 bg-stone-950/50 p-4 space-y-4">
                <div className="flex items-center space-x-2 text-[#C5A880] border-b border-stone-850 pb-2">
                  <Percent className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Interactive Pricing & Discounts Engine
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  {/* Original Retail Price */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">
                      Original Retail (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editOriginalPrice}
                      onChange={(e) => handleOriginalPriceChange(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-850 bg-stone-900 px-3 py-1.5 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                      id="modal-edit-originalprice"
                    />
                  </div>

                  {/* Discount Value in currency */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">
                      Discount Value (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={discountVal}
                      onChange={(e) => handleDiscountValChange(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-850 bg-stone-900 px-3 py-1.5 text-xs text-amber-400 focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono"
                      id="modal-edit-discountval"
                    />
                  </div>

                  {/* Discount Percentage */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">
                      Discount rate (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPct}
                      onChange={(e) => handleDiscountPctChange(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-850 bg-stone-900 px-3 py-1.5 text-xs text-amber-400 focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono"
                      id="modal-edit-discountpct"
                    />
                  </div>

                  {/* Final Selling Price */}
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-stone-400 block mb-1">
                      Final Selling Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={editPrice}
                      onChange={(e) => handleSellingPriceChange(parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-stone-850 bg-stone-900 px-3 py-1.5 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                      id="modal-edit-price"
                    />
                  </div>

                </div>

                {/* Visual discount guide helper banner */}
                <div className="text-[10px] text-stone-400 flex items-center space-x-1.5 bg-stone-900/50 p-2 rounded-lg">
                  <Tag className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>
                    {discountVal > 0 ? (
                      <span>
                        Applying a <strong className="text-amber-400">₹{discountVal.toLocaleString("en-IN")} (-{discountPct}%)</strong> discount. Original item tag is ₹{editOriginalPrice.toLocaleString("en-IN")}, sells at ₹{editPrice.toLocaleString("en-IN")}.
                      </span>
                    ) : (
                      <span>Item will sell at full retail tag of ₹{editOriginalPrice.toLocaleString("en-IN")} with no markdown discount.</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Image URL & Featured Checklist */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                <div className="md:col-span-9">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                    Garment Photo URL
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-500">
                      <ImageIcon className="h-4 w-4" />
                    </span>
                    <input
                      type="url"
                      value={editImageUrl}
                      onChange={(e) => setEditImageUrl(e.target.value)}
                      className="w-full rounded-lg border border-stone-800 bg-stone-900 pl-10 pr-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-mono"
                      id="modal-edit-image"
                    />
                  </div>
                </div>

                <div className="md:col-span-3 flex items-end">
                  <label className="flex items-center space-x-2.5 p-2 bg-stone-900 border border-stone-800 rounded-lg cursor-pointer w-full select-none justify-center">
                    <input
                      type="checkbox"
                      checked={editIsFeatured}
                      onChange={(e) => setEditIsFeatured(e.target.checked)}
                      className="rounded border-stone-800 bg-[#0d0c0b] text-[#C5A880] focus:ring-[#C5A880] h-4 w-4 cursor-pointer"
                    />
                    <span className="text-xs text-[#FAF8F5] uppercase tracking-wide font-bold">Featured?</span>
                  </label>
                </div>

              </div>

              {/* Description textarea */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Garment Catalog Description
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-[#FCFBF9] focus:ring-1 focus:ring-[#C5A880] focus:outline-none font-sans"
                  id="modal-edit-description"
                />
              </div>

              {/* Save & Cancel Buttons */}
              <div className="pt-4 border-t border-stone-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2 rounded-xl border border-stone-850 text-stone-400 hover:text-white hover:bg-stone-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#C5A880] text-[#080807] hover:bg-[#E5C49F] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  id="modal-edit-save-btn"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
