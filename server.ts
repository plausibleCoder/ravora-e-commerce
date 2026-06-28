import express from "express";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Product, User, Order } from "./src/types";

const __filename = typeof import.meta !== "undefined" && import.meta.url ? fileURLToPath(import.meta.url) : "";
const __dirname = typeof import.meta !== "undefined" && import.meta.url ? dirname(__filename) : "";

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_FILE = path.join(process.cwd(), "db.json");
const JWT_SECRET = process.env.JWT_SECRET || "ravora_textiles_secret_jwt_key_2026";

// Ensure database file exists
const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Mayil Peacock Kanchipuram Silk Saree",
    category: "Sarees",
    price: 18500,
    originalPrice: 24000,
    stock: 8,
    description: "An extraordinary master-weave in majestic Peacock Teal and deep Gold zari. The borders feature traditional Mayil (peacock) motifs and stylized temple gopurams. Celebrates South Indian handloom craft in its highest elegance.",
    fabric: "Pure Kanchipuram Silk",
    motif: "Peacock (Mayil)",
    color: "Peacock Teal",
    colorHex: "#0D9488",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-2",
    name: "Kerala Kasavu Gold Gopuram Saree",
    category: "Sarees",
    price: 4200,
    originalPrice: 5500,
    stock: 15,
    description: "A classic cream-white fine handloom Kasavu cotton saree from Kerala, styled with a grand golden zari border depicting temple Gopuram structural patterns. Combines modern lightness with beautiful cultural aesthetics.",
    fabric: "Handloom Kasavu Cotton",
    motif: "Temple Border (Gopuram)",
    color: "Kerala Ivory",
    colorHex: "#FAF9F6",
    images: ["https://images.unsplash.com/photo-1590075865003-e48277adc558?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-3",
    name: "Pochampally Crimson Ikat Midi Dress",
    category: "Dresses & Indo-Western",
    price: 3800,
    originalPrice: 4800,
    stock: 12,
    description: "A contemporary high-neck A-line dress in radiant Temple Crimson, crafted from genuine Pochampally cotton handloom Ikat. Features iconic geometric zigzag motifs representing traditional South Indian double-ikat precision.",
    fabric: "Pochampally Handloom Ikat Cotton",
    motif: "Geometric (Ikat)",
    color: "Temple Crimson",
    colorHex: "#991B1B",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-4",
    name: "Madurai Lotus Kalamkari Kurta",
    category: "Kurtas & Shirts",
    price: 2400,
    originalPrice: 3200,
    stock: 20,
    description: "A breathable, regular-fit organic cotton linen kurta styled with handcrafted Kalamkari motifs showing full-bloom lotuses (Kamalam). The print features natural indigo dyes, paired with fine modern stitching details.",
    fabric: "Madurai Organic Linen Cotton",
    motif: "Lotus (Kamalam)",
    color: "Indigo Navy",
    colorHex: "#1E40AF",
    images: ["https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-5",
    name: "Mayil Feather Langa Voni Set",
    category: "Langa Voni",
    price: 12500,
    originalPrice: 16000,
    stock: 5,
    description: "A traditional South Indian half-saree redesigned for the modern festive season. Elegant pleated skirt in rich Indigo-Navy detailing golden zari peacocks, paired with a modern raw-silk designer blouse and a fine net gold border dupatta in Peacock Teal.",
    fabric: "Raw Silk & Soft Net",
    motif: "Peacock (Mayil)",
    color: "Peacock Teal",
    colorHex: "#115E59",
    images: ["https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-6",
    name: "Pochampally Ikat Chevron Kurta",
    category: "Kurtas & Shirts",
    price: 2800,
    originalPrice: 3800,
    stock: 18,
    description: "Slim-fit mandarin-collar men's kurta featuring custom geometric ikat chevrons in rich temple crimson and off-white. Pre-washed for a luxury touch and ultimate modern South Indian formal appeal.",
    fabric: "Pochampally Cotton Handloom",
    motif: "Geometric (Ikat)",
    color: "Temple Crimson",
    colorHex: "#BE123C",
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-7",
    name: "Royal Mango Silk-Cotton Fusion Dress",
    category: "Dresses & Indo-Western",
    price: 6500,
    originalPrice: 8000,
    stock: 10,
    description: "An elegant pleated summer maxi dress in glowing Kanchipuram golden-yellow. Celebrated with traditional Mango (Paisley/Manga) motifs along the sleeves and gopuram border hems. Offers amazing flow and breathability.",
    fabric: "Handloom Weaved Silk-Cotton",
    motif: "Mango (Paisley)",
    color: "Kanchipuram Gold",
    colorHex: "#CA8A04",
    images: ["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"]
  },
  {
    id: "prod-8",
    name: "Kanchipuram Gold Mango Border Saree",
    category: "Sarees",
    price: 15400,
    originalPrice: 19500,
    stock: 7,
    description: "Elegant traditional fusion handloom saree displaying intricate golden manga motifs elegantly spaced across deep charcoal/navy zari body. Features a majestic contrast pink pallu.",
    fabric: "Pure Handloom Silk",
    motif: "Mango (Paisley)",
    color: "Kanchipuram Gold",
    colorHex: "#D97706",
    images: ["https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=800&q=80"]
  }
];

const defaultUsers = [
  { id: "u-1", username: "admin", password: "password", email: "admin@ravora.com", role: "admin" },
  { id: "u-2", username: "customer", password: "password", email: "skan@example.com", role: "customer" }
];

interface DBStructure {
  products: Product[];
  users: typeof defaultUsers;
  orders: Order[];
  stories?: Record<string, {
    id: string;
    name: string;
    iconName: string;
    slides: {
      image: string;
      title: string;
      subtitle: string;
      description: string;
      badge?: string;
    }[];
  }>;
}

const defaultStories = {
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

function loadDB(): DBStructure {
  if (!fs.existsSync(DB_FILE)) {
    const data: DBStructure = {
      products: initialProducts,
      users: defaultUsers,
      orders: [],
      stories: defaultStories
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    return data;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    let updated = false;
    if (!parsed.stories) {
      parsed.stories = defaultStories;
      updated = true;
    }
    if (updated) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2));
    }
    return parsed;
  } catch (e) {
    console.error("Error reading database file, returning defaults", e);
    return { products: initialProducts, users: defaultUsers, orders: [], stories: defaultStories };
  }
}

function saveDB(data: DBStructure) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Ensure database is initialized
loadDB();

async function startServer() {
  const app = express();
  app.use(express.json());

  // Middleware for checking auth using JWT and attaching the user object
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }
      req.user = decoded;
      next();
    });
  };

  // Auth Endpoints
  app.post("/api/auth/register", (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const db = loadDB();
    const exists = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ error: "Username or email already in use" });
    }

    const newUser = {
      id: "u-" + Date.now(),
      username,
      password,
      email,
      role: "customer" as const
    };

    db.users.push(newUser);
    saveDB(db);

    const tokenPayload = { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: tokenPayload
    });
  });

  app.post("/api/auth/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const db = loadDB();
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const tokenPayload = { id: user.id, username: user.username, email: user.email, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: tokenPayload
    });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    res.json({ user: req.user });
  });

  // Products Endpoints
  app.get("/api/products", (req, res) => {
    const db = loadDB();
    res.json(db.products);
  });

  app.post("/api/products", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin authorization required" });
    }

    const { name, category, price, originalPrice, stock, description, fabric, motif, color, colorHex, images } = req.body;

    if (!name || !category || typeof price !== "number" || typeof stock !== "number" || !fabric || !motif || !color) {
      return res.status(400).json({ error: "Missing complete garment parameters" });
    }

    const db = loadDB();
    const newProduct: Product = {
      id: "prod-" + Date.now(),
      name,
      category,
      price,
      originalPrice: originalPrice || price,
      stock,
      description: description || "Exquisite South Indian designer textile. Meticulously hand-crafted with ancestral block weaving techniques.",
      fabric,
      motif,
      color,
      colorHex: colorHex || "#000000",
      images: images && images.length ? images : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"]
    };

    db.products.push(newProduct);
    saveDB(db);

    res.status(201).json(newProduct);
  });

  app.put("/api/products/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin authorization required" });
    }

    const productId = req.params.id;
    const updateData = req.body;

    const db = loadDB();
    const index = db.products.findIndex(p => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ error: "Product not found" });
    }

    db.products[index] = {
      ...db.products[index],
      ...updateData,
      id: productId // Keep ID constant
    };

    saveDB(db);
    res.json(db.products[index]);
  });

  app.delete("/api/products/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin authorization required" });
    }

    const productId = req.params.id;
    const db = loadDB();

    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== productId);

    if (db.products.length === initialLength) {
      return res.status(404).json({ error: "Product not found" });
    }

    saveDB(db);
    res.json({ success: true, message: "Garment successfully retired from catalog" });
  });

  // Orders Endpoints
  app.get("/api/orders", authenticateToken, (req: any, res) => {
    const db = loadDB();
    const userOrders = db.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders);
  });

  app.post("/api/orders", authenticateToken, (req: any, res) => {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || !items.length || !totalAmount || !shippingAddress) {
      return res.status(400).json({ error: "Missing complete checkout elements" });
    }

    const db = loadDB();

    // Verify stock and update inventory in-transaction
    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found in inventory` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Selected: ${item.quantity}, Available: ${product.stock}` });
      }
    }

    // Decrement stock
    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId)!;
      product.stock -= item.quantity;
    }

    const newOrder: Order = {
      id: "ord-" + Date.now(),
      userId: req.user.id,
      items,
      totalAmount,
      status: "Processing",
      shippingAddress,
      createdAt: new Date().toISOString()
    };

    db.orders.push(newOrder);
    saveDB(db);

    res.status(201).json(newOrder);
  });

  // Stories Endpoints
  app.get("/api/stories", (req, res) => {
    const db = loadDB();
    res.json(db.stories || defaultStories);
  });

  app.post("/api/stories", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin authorization required" });
    }

    const { stories } = req.body;
    if (!stories) {
      return res.status(400).json({ error: "Missing stories database payload" });
    }

    const db = loadDB();
    db.stories = stories;
    saveDB(db);

    res.json({ success: true, stories: db.stories });
  });

  // Explicitly serve uploaded logo assets
  app.get("/Ravora_logo.png", (req, res) => {
    const logoPath = path.join(process.cwd(), "Ravora_logo.png");
    if (fs.existsSync(logoPath)) {
      res.sendFile(logoPath);
    } else {
      res.status(404).json({ error: "Logo not found" });
    }
  });

  app.get("/Ravora_logo_remove_bg.png", (req, res) => {
    const logoPath = path.join(process.cwd(), "Ravora_logo_remove_bg.png");
    if (fs.existsSync(logoPath)) {
      res.sendFile(logoPath);
    } else {
      res.status(404).json({ error: "Logo not found" });
    }
  });

  // Catch-all route to serve static assets or delegate to Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Ravora Textiles Server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical server bootstrap error:", err);
});
