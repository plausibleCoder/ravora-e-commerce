export interface Product {
  id: string;
  name: string;
  category: "Sarees" | "Langa Voni" | "Kurtas & Shirts" | "Dresses & Indo-Western";
  price: number;
  originalPrice: number; // for displaying elegant "was" prices and discount percentages
  stock: number;
  description: string;
  fabric: string; // e.g., "Kanchipuram Silk", "Madurai Cotton", "Mangalagiri Cotton", "Pochampally Ikat"
  motif: "Peacock (Mayil)" | "Temple Border (Gopuram)" | "Lotus (Kamalam)" | "Mango (Paisley)" | "Geometric (Ikat)";
  color: string; // e.g., "Peacock Teal", "Kanchipuram Gold", "Temple Crimson", "Indigo Navy", "Kerala Ivory"
  colorHex: string; // Hex code for custom responsive color swatch filters!
  images: string[];
  isFeatured?: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "customer";
}

export interface CartItem {
  productId: string;
  quantity: number;
  selectedSize: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered";
  shippingAddress: {
    fullName: string;
    addressLine: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  };
  createdAt: string;
}

export interface FilterState {
  category: string[];
  motif: string[];
  color: string[];
  priceRange: [number, number];
  search: string;
}

export interface StorySlide {
  image: string;
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
}

export interface StoryGroup {
  id: string;
  name: string;
  iconName: string;
  slides: StorySlide[];
}
