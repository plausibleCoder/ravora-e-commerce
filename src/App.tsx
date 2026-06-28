import React, { useState, useEffect } from "react";
import { Sparkles, ShoppingBag, ArrowRight, Library, Search, SlidersHorizontal, ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Product, Order, CartItem, FilterState, User, StoryGroup } from "./types";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import Filters from "./components/Filters";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import AdminPanel from "./components/AdminPanel";
import LoginPage from "./components/LoginPage";
import StoryViewer from "./components/StoryViewer";
import StoryPage from "./components/StoryPage";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("ravora_token"));
  const [activeView, setActiveView] = useState<"shop" | "orders" | "admin" | "login" | "story">("shop");
  const [isLoading, setIsLoading] = useState(true);

  // Stories backend database state
  const [storyGroups, setStoryGroups] = useState<Record<string, StoryGroup>>({});

  // Instagram Story Viewer state
  const [selectedStoryGroup, setSelectedStoryGroup] = useState<string | null>(null);
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("ravora_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    motif: [],
    color: [],
    priceRange: [0, 30000],
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Persist cart changes
  useEffect(() => {
    localStorage.setItem("ravora_cart", JSON.stringify(cart));
  }, [cart]);

  // Load catalog on boot
  useEffect(() => {
    fetchProducts();
    fetchStories();
  }, []);

  // Validate session when token boots
  useEffect(() => {
    if (token) {
      localStorage.setItem("ravora_token", token);
      fetchSessionUser();
    } else {
      localStorage.removeItem("ravora_token");
      setCurrentUser(null);
      setOrders([]);
    }
  }, [token]);

  // Fetch orders when user loads
  useEffect(() => {
    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error("Failed to load products from API", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        setStoryGroups(data);
      }
    } catch (e) {
      console.error("Failed to load stories from API", e);
    }
  };

  const handleUpdateStories = async (updatedStories: Record<string, StoryGroup>) => {
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stories: updatedStories }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStoryGroups(data.stories);
        }
      } else {
        throw new Error("Failed to save stories");
      }
    } catch (e) {
      console.error("Error saving story groups", e);
      throw e;
    }
  };

  const fetchSessionUser = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        // Token stale, clear
        setToken(null);
      }
    } catch (e) {
      console.error("Me verification failed", e);
      setToken(null);
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Failed to fetch order history", e);
    }
  };

  // Auth Callbacks
  const handleLoginSuccess = (newToken: string, user: User) => {
    setToken(newToken);
    setCurrentUser(user);
    if (user.role === "admin") {
      setActiveView("admin");
    } else {
      setActiveView("shop");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    setCart([]);
    setActiveView("shop");
  };

  // Shopping Ops
  const handleAddToCart = (product: Product, size: string) => {
    setCart((prevCart) => {
      const existsIndex = prevCart.findIndex(
        (item) => item.productId === product.id && item.selectedSize === size
      );

      if (existsIndex > -1) {
        const item = prevCart[existsIndex];
        // Enforce loom limits
        if (item.quantity >= product.stock) {
          alert(`Apologies! We only have ${product.stock} units of ${product.name} ready on the loom.`);
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existsIndex] = { ...item, quantity: item.quantity + 1 };
        return updated;
      } else {
        return [...prevCart, { productId: product.id, quantity: 1, selectedSize: size }];
      }
    });

    // Notify user elegantly
    setCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, size);
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.stock) {
      return; // respect stock ceilings
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.selectedSize === size))
    );
  };

  // Checkout submission
  const handlePlaceOrder = async (shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  }) => {
    if (!currentUser) {
      alert("Please login to complete your loom reserve.");
      setActiveView("login");
      setCheckoutOpen(false);
      return;
    }

    const cartWithProducts = cart.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product,
      };
    }).filter((l) => l.product !== undefined) as (CartItem & { product: Product })[];

    const subtotal = cartWithProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const shippingCost = subtotal >= 5000 ? 0 : 150;
    const totalAmount = subtotal + shippingCost;

    const orderItems = cartWithProducts.map((c) => ({
      productId: c.productId,
      name: c.product.name,
      price: c.product.price,
      quantity: c.quantity,
      size: c.selectedSize,
      image: c.product.images[0]
    }));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount,
          shippingAddress
        })
      });

      if (response.ok) {
        // Clear Cart
        setCart([]);
        setCheckoutOpen(false);
        setCartOpen(false);
        // Refresh products catalog and fetching orders list
        await fetchProducts();
        await fetchOrders();
        // Redirect to active orders tab
        setActiveView("orders");
        alert("Namaśkaram! Your reservation is placed with weaved stock secured.");
      } else {
        const errData = await response.json();
        alert(errData.error || "Order failed. Please verify stock counts.");
      }
    } catch (e) {
      alert("Loom reserving system failed. Please contact craft desk.");
    }
  };

  // Back-office operations
  const handleAdminAddProduct = async (prodData: Omit<Product, "id">) => {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(prodData)
      });

      if (response.ok) {
        await fetchProducts();
        alert("Garment catalog successfully expanded!");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to commit product");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Communication issue connecting back office");
    }
  };

  const handleAdminUpdateProduct = async (id: string, updateData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        await fetchProducts();
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update product details");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Communication issue connecting back office");
    }
  };

  const handleAdminDeleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchProducts();
        alert("Garment removed from catalog");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Communication issue connecting back office");
    }
  };

  // Filtering calculations on Frontend for smooth feel (backed by precise DB syncs)
  const filteredProducts = products.filter((p) => {
    // Categories matching
    if (filters.category.length > 0 && !filters.category.includes(p.category)) {
      return false;
    }
    // Motifs matching
    if (filters.motif.length > 0 && !filters.motif.includes(p.motif)) {
      return false;
    }
    // Colors matching
    if (filters.color.length > 0 && !filters.color.includes(p.color)) {
      return false;
    }
    // Price range matching
    if (p.price < filters.priceRange[0] || p.price > filters.priceRange[1]) {
      return false;
    }
    // Search keyword query
    if (filters.search.trim() !== "") {
      const s = filters.search.toLowerCase();
      const match =
        p.name.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.fabric.toLowerCase().includes(s) ||
        p.color.toLowerCase().includes(s) ||
        p.motif.toLowerCase().includes(s);
      if (!match) return false;
    }
    return true;
  });

  // Calculate product filter numbers based on currently fetched arrays
  const availableCounts = {
    categories: products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    motifs: products.reduce((acc, p) => {
      acc[p.motif] = (acc[p.motif] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    colors: products.reduce((acc, p) => {
      acc[p.color] = (acc[p.color] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  // Calculate pagination states
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Trigger pagerewards when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const resetFilters = () => {
    setFilters({
      category: [],
      motif: [],
      color: [],
      priceRange: [0, 30000],
      search: "",
    });
  };

  const handleCheckoutTrigger = () => {
    if (!currentUser) {
      alert("Ready to secure your loom reserves? Let's sign in to your vastram account first.");
      setActiveView("login");
    } else {
      setCheckoutOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] flex flex-col font-sans text-[#1A1A1A]" id="ravora-app">
      
      {/* Navbar component */}
      <Navbar
        currentUser={currentUser}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        activeView={activeView}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-grow">
        {activeView === "shop" && (
          <div>
                        {/* Interactive Atelier Highlights (Story Highlights Bar) */}
            <div className="bg-[#FAF8F5] border-b border-[#E6E1D6] py-8 overflow-x-auto scrollbar-none">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-start md:justify-center space-x-6 sm:space-x-10 min-w-max">
                
                {/* Highlight Bubble: Catalog */}
                <button
                  onClick={() => {
                    setSelectedStoryGroup("catalog");
                    setStoryViewerOpen(true);
                  }}
                  className="flex flex-col items-center space-y-2 group focus:outline-none cursor-pointer shrink-0"
                  id="highlight-catalog"
                >
                  <div className="relative p-0.5 rounded-full border-2 border-[#C5A880] group-hover:scale-105 group-hover:border-[#E5C49F] transition-all duration-300">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-stone-900 border border-[#FAF8F5]">
                      <img
                        src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=120&q=80"
                        alt="Catalog highlight"
                        className="h-full w-full object-cover group-hover:rotate-2 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    {/* Tiny pulsing indicator */}
                    <div className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#C5A880] text-[8px] font-bold text-[#080807] ring-2 ring-[#FAF8F5]">
                      NEW
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#080807] group-hover:text-[#C5A880] transition-colors">
                    Catalog
                  </span>
                </button>

                {/* Highlight Bubble: Quality */}
                <button
                  onClick={() => {
                    setSelectedStoryGroup("quality");
                    setStoryViewerOpen(true);
                  }}
                  className="flex flex-col items-center space-y-2 group focus:outline-none cursor-pointer shrink-0"
                  id="highlight-quality"
                >
                  <div className="relative p-0.5 rounded-full border-2 border-[#C5A880]/40 group-hover:scale-105 group-hover:border-[#C5A880] transition-all duration-300">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-stone-900 border border-[#FAF8F5]">
                      <img
                        src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=120&q=80"
                        alt="Loom Quality highlight"
                        className="h-full w-full object-cover group-hover:rotate-2 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 group-hover:text-[#080807] transition-colors">
                    Loom Quality
                  </span>
                </button>

                {/* Highlight Bubble: Swatches */}
                <button
                  onClick={() => {
                    setSelectedStoryGroup("photos");
                    setStoryViewerOpen(true);
                  }}
                  className="flex flex-col items-center space-y-2 group focus:outline-none cursor-pointer shrink-0"
                  id="highlight-swatches"
                >
                  <div className="relative p-0.5 rounded-full border-2 border-[#C5A880]/40 group-hover:scale-105 group-hover:border-[#C5A880] transition-all duration-300">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-stone-900 border border-[#FAF8F5]">
                      <img
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=120&q=80"
                        alt="Swatches highlight"
                        className="h-full w-full object-cover group-hover:rotate-2 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 group-hover:text-[#080807] transition-colors">
                    Atelier Swatches
                  </span>
                </button>

                {/* Highlight Bubble: Delivery */}
                <button
                  onClick={() => {
                    setSelectedStoryGroup("delivery");
                    setStoryViewerOpen(true);
                  }}
                  className="flex flex-col items-center space-y-2 group focus:outline-none cursor-pointer shrink-0"
                  id="highlight-delivery"
                >
                  <div className="relative p-0.5 rounded-full border-2 border-[#C5A880]/40 group-hover:scale-105 group-hover:border-[#C5A880] transition-all duration-300">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-stone-900 border border-[#FAF8F5]">
                      <img
                        src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=120&q=80"
                        alt="Dispatch highlight"
                        className="h-full w-full object-cover group-hover:rotate-2 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 group-hover:text-[#080807] transition-colors">
                    Dispatch Care
                  </span>
                </button>

                {/* Highlight Bubble: Story */}
                <button
                  onClick={() => {
                    setSelectedStoryGroup("about");
                    setStoryViewerOpen(true);
                  }}
                  className="flex flex-col items-center space-y-2 group focus:outline-none cursor-pointer shrink-0"
                  id="highlight-about"
                >
                  <div className="relative p-0.5 rounded-full border-2 border-[#C5A880]/40 group-hover:scale-105 group-hover:border-[#C5A880] transition-all duration-300">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-stone-900 border border-[#FAF8F5]">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80"
                        alt="Our Story highlight"
                        className="h-full w-full object-cover group-hover:rotate-2 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 group-hover:text-[#080807] transition-colors">
                    Our Story
                  </span>
                </button>

              </div>
            </div>

            {/* Split cover Hero Section ("Forever Classic") */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px] border-b border-[#E6E1D6]">
              {/* Left Side text & editorial layout */}
              <div className="lg:col-span-7 bg-[#0c0b0a] text-[#FAF8F5] p-8 sm:p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-stone-900/40 to-black/80 pointer-events-none" />
                
                {/* Vintage gold watermark detail in background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-serif font-light text-stone-900/10 pointer-events-none select-none uppercase">
                  R
                </div>

                <div className="relative z-10 space-y-6 max-w-xl">
                  <div className="space-y-1">
                    <p className="text-[11px] text-[#C5A880] font-mono tracking-[0.3em] uppercase">
                      01 / HERITAGE CURATION
                    </p>
                    <h2 
                      className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-wide text-[#FCFBF9] leading-[1.1]"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      Forever classic
                    </h2>
                  </div>

                  <p className="text-sm text-stone-300 leading-relaxed font-sans font-light">
                    Why does the modern eye seek solace in the ancient loom? In an era of fleeting fast-fashion, the handloom sings a deeper song. A slow, meditative luxury woven meticulously with pure Mulberry silk, authorized silver threads, and generational motifs representing the peacock plumage, sacred temples, and geometric block weaves.
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4 items-center">
                    <button
                      onClick={() => {
                        window.scrollTo({
                          top: document.getElementById("catalog-grid-top")?.offsetTop || 800,
                          behavior: "smooth"
                        });
                      }}
                      className="px-6 py-3 bg-[#3E59FA] text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full hover:bg-[#2A45E2] hover:shadow-[0_4px_25px_rgba(62,89,250,0.5)] transition-all duration-300 flex items-center space-x-2 shadow-lg group cursor-pointer"
                    >
                      <span>Explore Master-Weaves</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedStoryGroup("about");
                        setStoryViewerOpen(true);
                      }}
                      className="px-6 py-3 border border-stone-800 hover:border-[#C5A880] text-stone-300 hover:text-white text-xs font-bold uppercase tracking-[0.15em] rounded-full transition-all cursor-pointer"
                    >
                      Our Story Narrative
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side Editorial crop portrait with looping ambient craft video */}
              <div className="lg:col-span-5 relative min-h-[400px] lg:min-h-full overflow-hidden bg-[#0c0b0a] flex items-center justify-center">
                
                {/* Fallback Image */}
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80"
                  alt="High fashion luxury model in traditional draped silk"
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-40 mix-blend-luminosity lg:opacity-30"
                  referrerPolicy="no-referrer"
                />

                {/* Looping Ambient Video */}
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                >
                  <source
                    src="https://player.vimeo.com/external/459389137.sd.mp4?s=87ae3925a6e60b2cf14798e983422e1b1d830b8d&profile_id=165&oauth2_token_id=57447761"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>

                {/* Overlaid Vignette Gradients */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0c0b0a] via-transparent to-transparent hidden lg:block" />

                {/* Top Right Floating Logo Emblem Stamp using background-removed logo */}
                <div className="absolute top-4 right-4 z-20 flex items-center justify-center p-2 bg-black/70 border border-[#C5A880]/30 backdrop-blur-md rounded-2xl shadow-xl hover:border-[#C5A880]/60 transition-all duration-300">
                  <img
                    src="/Ravora_logo_remove_bg.png"
                    alt="Ravora Top Right Logo"
                    className="h-14 w-14 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Live Loom indicator badge - placed top-left */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 px-3 py-1.5 bg-black/60 border border-stone-800 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-stone-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>Atelier Loom • Live Stream</span>
                </div>
              </div>
            </div>

            {/* Asymmetric "Moodboard Of Brand" Section */}
            <div className="bg-[#FAF8F5] border-b border-[#E6E1D6] py-16 sm:py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center space-y-2.5 mb-12 sm:mb-16">
                  <p className="text-[10px] text-[#C5A880] uppercase tracking-[0.3em] font-bold">
                    VISUAL METAPHORS
                  </p>
                  <h3 
                    className="font-serif text-3xl sm:text-4xl text-[#080807] font-light tracking-wide uppercase"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Moodboard of Brand
                  </h3>
                  <div className="w-24 h-[1px] bg-[#C5A880] mx-auto mt-4" />
                </div>

                {/* Elegant Bento Collage Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Collage Item 1: Narrow, Tall image (Left) */}
                  <div className="md:col-span-4 rounded-3xl overflow-hidden bg-white border border-[#E6E1D6] p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                    <div className="aspect-3/4 rounded-2xl overflow-hidden bg-stone-100">
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"
                        alt="Traditional wood loom with gold threads"
                        className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="pt-4 px-1 pb-1">
                      <p className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">
                        Atelier Focus
                      </p>
                      <h4 className="font-serif text-base text-[#080807] font-bold mt-1">
                        Ancestral Fly-Shuttle Loom
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        Every pattern begins as a manual draft on grid sheets, then hand-spun into our antique wooden frames.
                      </p>
                    </div>
                  </div>

                  {/* Collage Item 2: Wide Central Quote and Detail box (Center) */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-6">
                    
                    {/* The Poet's Quote Card */}
                    <div className="bg-[#0c0b0a] text-[#FAF8F5] rounded-3xl p-8 sm:p-10 flex flex-col justify-between flex-1 relative overflow-hidden shadow-xs border border-stone-800">
                      <div className="absolute top-4 right-4 h-8 w-8 text-stone-800 font-serif text-5xl font-extrabold select-none opacity-40">
                        “
                      </div>
                      <div className="space-y-4">
                        <span className="inline-block h-1 w-10 bg-[#C5A880]" />
                        <blockquote 
                          className="font-serif text-xl sm:text-2xl text-[#FCFBF9] font-light italic leading-normal"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          To feel a piece of genuine handloom silk is to touch the heartbeat of a master weaver who left their soul between the gold warp threads.
                        </blockquote>
                      </div>
                      <div className="pt-6">
                        <p className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">
                          Svetlana Fomina
                        </p>
                        <p className="text-[9px] text-stone-500 font-mono mt-0.5">
                          Lead Creative Curator
                        </p>
                      </div>
                    </div>

                    {/* Small horizontal block */}
                    <div className="bg-white rounded-3xl p-5 border border-[#E6E1D6] flex items-center space-x-4 shadow-2xs">
                      <div className="h-16 w-16 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                        <img
                          src="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=150&q=80"
                          alt="Delicate thread close up"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-[#C5A880] uppercase font-bold">
                          Zari Purity Mark
                        </span>
                        <h4 className="font-serif text-sm font-bold text-[#080807] mt-0.5 leading-tight">
                          100% Certified Silver Zari Threading
                        </h4>
                        <p className="text-[10px] text-stone-500 mt-1 leading-snug">
                          Coated in pure 24-karat antique liquid gold to prevent any form of oxidation.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Collage Item 3: Secondary Elegant Image & Weave label (Right) */}
                  <div className="md:col-span-3 rounded-3xl overflow-hidden bg-white border border-[#E6E1D6] p-3 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                    <div className="aspect-3/4 rounded-2xl overflow-hidden bg-stone-100">
                      <img
                        src="https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=400&q=80"
                        alt="High fashion garment detail draped"
                        className="h-full w-full object-cover hover:scale-[1.03] transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="pt-4 px-1 pb-1">
                      <p className="text-[10px] font-mono text-[#C5A880] uppercase tracking-wider">
                        Metaphor
                      </p>
                      <h4 className="font-serif text-base text-[#080807] font-bold mt-1">
                        Golden Peacock Motif
                      </h4>
                      <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                        A celebration of life, nature, and South Indian temple structures woven with stunning silk density.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* Catalog Grid Heading Marker */}
            <div id="catalog-grid-top" />

            {/* Catalog & Filtering Grid Area */}
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              
              {/* Mobile Filter toggle */}
              <div className="flex md:hidden items-center justify-between mb-4">
                <button
                  onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                  className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#A3805B] px-4 py-2 border border-[#E6E1D6] rounded-xl bg-white"
                  id="mobile-filters-toggle"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>{mobileFiltersOpen ? "Hide Filters" : "Show Filters"}</span>
                </button>
                <span className="text-xs text-stone-500 font-mono">
                  {totalItems} garments found
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Left Side: Filtering Panel */}
                <div className={`col-span-1 ${mobileFiltersOpen ? "block" : "hidden md:block"}`}>
                  <Filters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={resetFilters}
                    availableCounts={availableCounts}
                  />
                </div>

                {/* Right Side: Product Catalog Grid & Pagination */}
                <div className="col-span-1 md:col-span-3 space-y-6">
                  
                  {/* Desktop header counts */}
                  <div className="hidden md:flex items-center justify-between border-b border-[#E6E1D6] pb-3">
                    <p className="text-[10px] font-mono text-stone-550 uppercase tracking-widest">
                      Displaying {Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}-
                      {Math.min(totalItems, currentPage * itemsPerPage)} of {totalItems} Handloom Masterpieces
                    </p>
                  </div>

                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-80 space-y-4 text-stone-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#A3805B] border-t-transparent" />
                      <span className="text-xs font-sans tracking-wide">Connecting to weavers room...</span>
                    </div>
                  ) : totalItems === 0 ? (
                    <div className="text-center py-20 space-y-3.5 bg-white border border-[#E6E1D6] rounded-3xl p-6 shadow-2xs">
                      <p className="font-serif text-base font-semibold text-[#1A1A1A]">No matching garments in register</p>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto font-sans leading-relaxed">
                        We do not find any active weaves matching your selected criteria. Reset filters or keyword query to discover other South Indian styles.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 text-xs font-bold text-[#A3805B] px-5 py-2.5 border border-[#E6E1D6] rounded-full hover:bg-[#FCFBF9] bg-transparent transition-all uppercase tracking-wider"
                        id="empty-reset-filters-btn"
                      >
                        Show All Garments
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="product-grid">
                      {paginatedProducts.map((p) => (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onAddToCart={handleAddToCart}
                          onQuickView={setQuickViewProduct}
                        />
                      ))}
                    </div>
                  )}

                  {/* Pagination Section controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center space-x-2 pt-6 border-t border-[#E6E1D6]" id="pagination-controls">
                      <button
                        onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg border border-[#E6E1D6] bg-white hover:bg-[#FCFBF9] disabled:opacity-35 transition-colors"
                        title="Previous Page"
                        id="pagination-prev"
                      >
                        <ChevronLeft className="h-4 w-4 text-stone-600" />
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(idx)}
                          className={`h-7.5 w-7.5 text-xs font-mono font-bold rounded-lg border transition-all ${
                            currentPage === idx
                              ? "bg-[#1A1A1A] text-[#FCFBF9] border-[#1A1A1A]"
                              : "bg-white text-stone-700 border-[#E6E1D6] hover:bg-[#FCFBF9]"
                          }`}
                          id={`pagination-page-${idx}`}
                        >
                          {idx}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg border border-[#E6E1D6] bg-white hover:bg-[#FCFBF9] disabled:opacity-35 transition-colors"
                        title="Next Page"
                        id="pagination-next"
                      >
                        <ChevronRight className="h-4 w-4 text-stone-600" />
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* User's Order History Page */}
        {activeView === "orders" && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" id="orders-view-container">
            <div className="pb-6 border-b border-[#E6E1D6] mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#A3805B] block">
                Artisan Reserve Records
              </span>
              <h2 className="font-serif text-2xl font-bold tracking-tight text-[#1A1A1A] mt-1.5 uppercase">
                Your Weave Reservations
              </h2>
              <p className="text-stone-500 text-xs font-sans mt-1">
                Review below the live manufacturing and dispatch status of your handcrafted garments.
              </p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 space-y-4 bg-white border border-[#E6E1D6] rounded-2xl p-6 shadow-2xs">
                <div className="h-16 w-16 bg-[#FCFBF9] border border-[#E6E1D6] rounded-full flex items-center justify-center text-[#A3805B] mx-auto shadow-3xs">
                  <Library className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#1A1A1A]">
                  No loom orders submitted yet
                </h3>
                <p className="text-xs text-stone-450 max-w-sm mx-auto font-sans leading-relaxed">
                  Your secure handloom orders and reservation history details will appear automatically once placed.
                </p>
                <button
                  onClick={() => setActiveView("shop")}
                  className="mt-2 text-xs font-bold bg-[#1A1A1A] text-white px-5 py-2.5 rounded-xl hover:bg-[#333333] transition-colors uppercase tracking-wider"
                  id="orders-place-first"
                >
                  Explore Weaves Catalog
                </button>
              </div>
            ) : (
              <div className="space-y-6" id="orders-list">
                {orders.map((o) => (
                  <div
                     key={o.id}
                     className="border border-[#E6E1D6] rounded-2xl bg-white overflow-hidden shadow-2xs"
                     id={`order-card-${o.id}`}
                  >
                    {/* Order header card */}
                    <div className="bg-[#FCFBF9] px-5 py-4 border-b border-[#E6E1D6] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <p className="text-[9px] font-bold text-[#8E7E65] uppercase tracking-[0.12em]">
                          Reserve Reference
                        </p>
                        <p className="text-xs font-bold font-mono text-stone-850 mt-0.5">
                          {o.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#8E7E65] uppercase font-bold tracking-[0.12em]">
                          Reservation Date
                        </p>
                        <p className="text-xs font-medium text-stone-700 mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-[#8E7E65] uppercase font-bold tracking-[0.12em]">
                          Reserve Status
                        </p>
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-[#A3805B]/10 border border-[#A3805B]/30 text-[#A3805B] rounded-full text-[9px] font-bold uppercase tracking-wider mt-0.5">
                          <span>{o.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order items line reviews */}
                    <div className="p-5 divide-y divide-[#E6E1D6]">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="py-3 flex items-start space-x-4 first:pt-0 last:pb-0">
                          <img
                            src={it.image}
                            alt={it.name}
                            className="h-14 w-11 object-cover rounded border border-[#E6E1D6]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1">
                            <h4 className="font-serif text-xs font-bold text-[#1A1A1A]">
                              {it.name}
                            </h4>
                            <p className="text-[10px] text-stone-500 font-sans tracking-tight mt-0.5">
                              Size selected: {it.size} • Handloom certified
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold text-stone-850">
                              ₹{it.price.toLocaleString("en-IN")}
                            </span>
                            <p className="text-[10px] text-stone-400 font-mono">Qty: {it.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order destination footer */}
                    <div className="bg-[#FCFBF9] p-5 border-t border-[#E6E1D6] flex flex-col sm:flex-row justify-between gap-4 text-xs text-stone-600 font-sans">
                      <div>
                        <p className="font-bold text-[#8E7E65] uppercase tracking-[0.12em] text-[9px] mb-1">
                          Loom Dispatch Destination
                        </p>
                        <p className="font-medium text-[#1A1A1A]">{o.shippingAddress.fullName}</p>
                        <p className="text-stone-400 mt-0.5 leading-tight text-[11px]">
                          {o.shippingAddress.addressLine}, {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.postalCode}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#8E7E65] uppercase tracking-[0.12em] text-[9px] block mb-1">
                          Consolidated Cash on Delivery
                        </span>
                        <span className="text-base font-bold text-[#A3805B] font-mono">
                          ₹{o.totalAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Back-office Administrative Management View */}
        {activeView === "admin" && (
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAdminAddProduct}
            onUpdateProduct={handleAdminUpdateProduct}
            onDeleteProduct={handleAdminDeleteProduct}
            storyGroups={storyGroups}
            onUpdateStories={handleUpdateStories}
          />
        )}

        {/* Themed login overlay screen */}
        {activeView === "login" && (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onClose={() => {
              setActiveView("shop");
            }}
          />
        )}

        {/* Improved Premium Our Story Page */}
        {activeView === "story" && (
          <StoryPage />
        )}
      </main>

      {/* Fabric Craft Popup Description Modal (Quick View) */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/45 backdrop-blur-xs" id="quickview-overlay">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#FCFBF9] border border-[#E6E1D6] shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-150 text-stone-500 transition-colors"
              id="quickview-close-btn"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6 mt-4">
              <img
                src={quickViewProduct.images[0]}
                alt={quickViewProduct.name}
                className="w-full sm:w-44 h-56 object-cover rounded-2xl border border-[#E6E1D6]"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow space-y-3">
                <span className="text-[9px] font-bold text-[#A3805B] uppercase tracking-[0.15em] block">
                  {quickViewProduct.category}
                </span>
                
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A] uppercase tracking-wide">
                  {quickViewProduct.name}
                </h3>
                
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  {quickViewProduct.description}
                </p>

                <div className="text-xs space-y-1.5 border-t border-[#E6E1D6] pt-3 font-sans">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Pure Fabric</span>
                    <strong className="text-stone-750 font-medium">{quickViewProduct.fabric}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Cultural Motif</span>
                    <strong className="text-stone-750 font-medium">{quickViewProduct.motif}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Garment Color</span>
                    <strong className="text-stone-750 font-medium">{quickViewProduct.color}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Active Stock</span>
                    <strong className={`font-medium ${quickViewProduct.stock === 0 ? "text-red-650" : "text-stone-750"}`}>
                      {quickViewProduct.stock > 0 ? `${quickViewProduct.stock} units ready` : "Out of stock"}
                    </strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E6E1D6]">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold font-sans text-[#1A1A1A]">
                      ₹{quickViewProduct.price.toLocaleString("en-IN")}
                    </span>
                    {quickViewProduct.originalPrice > quickViewProduct.price && (
                      <span className="text-xs text-stone-400 line-through">
                        ₹{quickViewProduct.originalPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleAddToCart(quickViewProduct, "M");
                      setQuickViewProduct(null);
                    }}
                    disabled={quickViewProduct.stock === 0}
                    className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#333333] text-white text-[10px] font-bold uppercase tracking-wider disabled:opacity-50 transition-colors"
                    id="quickview-add-to-cart"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Shopping Drawer slider */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckoutTrigger}
      />

      {/* Checkout Modal component */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        products={products}
        onSubmit={handlePlaceOrder}
        isSubmitting={false}
      />

      {/* Story Viewer Component */}
      <StoryViewer
        isOpen={storyViewerOpen}
        onClose={() => setStoryViewerOpen(false)}
        groupId={selectedStoryGroup || "catalog"}
        storyGroups={storyGroups}
      />

      {/* Footer component */}
      <Footer />

    </div>
  );
}
