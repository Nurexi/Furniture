document.addEventListener("DOMContentLoaded", function () {
  var cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", function () {
      window.location.href = "Cart.html";
    });
  }
});
// Enhanced Store Page JavaScript - Complete functionality for furniture store

// Utility Functions
const utils = {
  formatPrice: (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  },

  generateStars: (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = "";

    for (let i = 0; i < fullStars; i++) {
      stars += "★";
    }

    if (hasHalfStar) {
      stars += "☆";
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars += "☆";
    }

    return stars;
  },

  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  saveToLocalStorage: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  animateElement: (element, animationClass) => {
    element.classList.add(animationClass);
    setTimeout(() => {
      element.classList.remove(animationClass);
    }, 600);
  },
};

// State Management
const storeState = {
  products: [],
  filteredProducts: [],
  cart: JSON.parse(localStorage.getItem("furnish_cart")) || [],
  wishlist: JSON.parse(localStorage.getItem("furnish_wishlist")) || [],
  compareList: JSON.parse(localStorage.getItem("furnish_compare")) || [],
  currentFilter: "all",
  currentSort: "popularity",
  searchQuery: "",
  currentPage: 1,
  productsPerPage: 9,
  theme: localStorage.getItem("furnish_theme") || "light",
};

// Enhanced Product Data - 9 products for each category
const sampleProducts = [
  // Bedroom (9 items)
  {
    id: 1,
    name: "Luxury King Platform Bed",
    price: 1599,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 124,
    badge: "bestseller",
    tags: ["new", "bestseller"],
    description:
      "Contemporary platform bed with built-in nightstands and LED lighting",
  },
  {
    id: 2,
    name: "Modern Velvet Upholstered Bed",
    price: 1299,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 203,
    badge: "bestseller",
    tags: ["bestseller"],
    description: "Queen size upholstered bed with diamond tufted headboard",
  },
  {
    id: 3,
    name: "Minimalist Oak Nightstand",
    price: 349,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 87,
    badge: "new",
    tags: ["new"],
    description: "Sleek nightstand with wireless charging pad and USB ports",
  },
  {
    id: 4,
    name: "Executive Walnut Dresser",
    price: 1199,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 156,
    badge: "",
    tags: [],
    description: "Spacious 8-drawer dresser with soft-close drawers and mirror",
  },
  {
    id: 5,
    name: "Scandinavian Wardrobe",
    price: 1799,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 231,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "3-door wardrobe with interior organizers and full-length mirror",
  },
  {
    id: 6,
    name: "Luxury Reading Chair",
    price: 899,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 112,
    badge: "",
    tags: [],
    description:
      "Ergonomic reading chair with ottoman and built-in reading light",
  },
  {
    id: 7,
    name: "Hollywood Vanity Set",
    price: 799,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.4,
    reviews: 65,
    badge: "sale",
    tags: ["sale"],
    description:
      "Hollywood-style vanity with LED bulb mirror and storage stool",
  },
  {
    id: 8,
    name: "Storage Ottoman Bench",
    price: 449,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1567538096610-b3a9ec83d4b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 98,
    badge: "",
    tags: [],
    description:
      "Upholstered storage bench with hydraulic lift and safety hinges",
  },
  {
    id: 9,
    name: "Smart Bedside Table",
    price: 599,
    category: "bedroom",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.3,
    reviews: 72,
    badge: "new",
    tags: ["new"],
    description:
      "Smart nightstand with wireless charging, Bluetooth speakers, and app control",
  },

  // Living Room (9 items)
  {
    id: 10,
    name: "Premium Sectional Sofa",
    price: 2299,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 189,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "L-shaped sectional with reclining seats and built-in cup holders",
  },
  {
    id: 11,
    name: "Glass Top Coffee Table",
    price: 699,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 132,
    badge: "",
    tags: [],
    description:
      "Tempered glass coffee table with chrome legs and storage shelf",
  },
  {
    id: 12,
    name: "Entertainment Center",
    price: 1299,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 87,
    badge: "",
    tags: [],
    description:
      "75-inch TV stand with cable management and LED accent lighting",
  },
  {
    id: 13,
    name: "Mid-Century Accent Chair",
    price: 649,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 104,
    badge: "new",
    tags: ["new"],
    description:
      "Iconic mid-century modern chair with walnut frame and premium fabric",
  },
  {
    id: 14,
    name: "Industrial Bookshelf",
    price: 899,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.4,
    reviews: 76,
    badge: "sale",
    tags: ["sale"],
    description:
      "5-tier industrial bookshelf with metal frame and reclaimed wood shelves",
  },
  {
    id: 15,
    name: "Luxury Loveseat",
    price: 1199,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 121,
    badge: "",
    tags: [],
    description: "Compact two-seater sofa with premium leather upholstery",
  },
  {
    id: 16,
    name: "Modern Console Table",
    price: 549,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.3,
    reviews: 58,
    badge: "",
    tags: [],
    description: "Slim entryway console with marble top and gold accents",
  },
  {
    id: 17,
    name: "Storage Ottoman",
    price: 299,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 92,
    badge: "",
    tags: [],
    description: "Multifunctional storage ottoman with removable tray top",
  },
  {
    id: 18,
    name: "Smart TV Stand",
    price: 899,
    category: "living-room",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 143,
    badge: "new",
    tags: ["new"],
    description:
      "Smart media console with built-in soundbar and wireless charging pad",
  },

  // Dining Room (9 items)
  {
    id: 19,
    name: "Extendable Dining Table",
    price: 1899,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 167,
    badge: "bestseller",
    tags: ["bestseller"],
    description: "Solid oak dining table that extends from 6 to 10 seats",
  },
  {
    id: 20,
    name: "Counter Height Bar Stools",
    price: 349,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 94,
    badge: "",
    tags: [],
    description:
      "Set of 2 swivel bar stools with adjustable height and footrest",
  },
  {
    id: 21,
    name: "Rustic Buffet Server",
    price: 1299,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 112,
    badge: "",
    tags: [],
    description: "Reclaimed wood sideboard with wine storage and serving tray",
  },
  {
    id: 22,
    name: "Glass Dining Table",
    price: 1599,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 138,
    badge: "new",
    tags: ["new"],
    description: "Tempered glass dining table with sculptural metal base",
  },
  {
    id: 23,
    name: "Traditional China Cabinet",
    price: 1799,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 87,
    badge: "",
    tags: [],
    description:
      "Elegant china cabinet with LED lighting and adjustable shelves",
  },
  {
    id: 24,
    name: "Breakfast Nook Set",
    price: 1099,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 103,
    badge: "sale",
    tags: ["sale"],
    description: "Corner breakfast nook with built-in storage bench and table",
  },
  {
    id: 25,
    name: "Wine Storage Rack",
    price: 399,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.4,
    reviews: 76,
    badge: "",
    tags: [],
    description: "Wall-mounted wine rack with glass holder and cork storage",
  },
  {
    id: 26,
    name: "Rolling Bar Cart",
    price: 449,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 121,
    badge: "new",
    tags: ["new"],
    description: "Mobile serving cart with mirrored shelves and gold frame",
  },
  {
    id: 27,
    name: "Upholstered Dining Chairs",
    price: 599,
    category: "dining-room",
    image:
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 98,
    badge: "",
    tags: [],
    description: "Set of 4 upholstered dining chairs with nailhead trim",
  },
  // Add Chair products (IDs 28-36)
  {
    id: 28,
    name: "Executive Office Chair",
    price: 599,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 245,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "Ergonomic executive chair with lumbar support and premium leather upholstery",
  },
  {
    id: 29,
    name: "Modern Accent Chair",
    price: 399,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 189,
    badge: "new",
    tags: ["new"],
    description:
      "Contemporary accent chair with velvet upholstery and gold legs",
  },
  {
    id: 30,
    name: "Ergonomic Desk Chair",
    price: 449,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 156,
    badge: "",
    tags: [],
    description: "Adjustable height desk chair with mesh back and armrests",
  },
  {
    id: 31,
    name: "Vintage Leather Chair",
    price: 699,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 134,
    badge: "sale",
    tags: ["sale"],
    description:
      "Vintage-style leather armchair with brass studs and wooden frame",
  },
  {
    id: 32,
    name: "Swivel Bar Chair",
    price: 229,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.4,
    reviews: 98,
    badge: "",
    tags: [],
    description:
      "Adjustable height swivel bar chair with footrest and cushioned seat",
  },
  {
    id: 33,
    name: "Reclining Lounge Chair",
    price: 899,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 267,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "Premium reclining chair with ottoman and built-in massage function",
  },
  {
    id: 34,
    name: "Scandinavian Dining Chair",
    price: 179,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.3,
    reviews: 145,
    badge: "",
    tags: [],
    description:
      "Minimalist dining chair with oak wood frame and fabric cushion",
  },
  {
    id: 35,
    name: "Gaming Chair Pro",
    price: 549,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1549497538-303791108f95?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 312,
    badge: "new",
    tags: ["new"],
    description:
      "Professional gaming chair with RGB lighting and adjustable armrests",
  },
  {
    id: 36,
    name: "Outdoor Patio Chair",
    price: 149,
    category: "chairs",
    image:
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.2,
    reviews: 87,
    badge: "sale",
    tags: ["sale"],
    description:
      "Weather-resistant patio chair with UV protection and quick-dry fabric",
  },

  // Add Sofa products (IDs 37-45)
  {
    id: 37,
    name: "Premium Sectional Sofa",
    price: 2299,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 324,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "L-shaped sectional sofa with reclining seats and built-in cup holders",
  },
  {
    id: 38,
    name: "Modern 3-Seater Sofa",
    price: 1599,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90byhttps://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 198,
    badge: "new",
    tags: ["new"],
    description:
      "Contemporary 3-seater sofa with premium fabric and solid wood frame",
  },
  {
    id: 39,
    name: "Chesterfield Sofa",
    price: 1899,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 156,
    badge: "",
    tags: [],
    description:
      "Classic Chesterfield sofa with button tufting and genuine leather",
  },
  {
    id: 40,
    name: "Convertible Sofa Bed",
    price: 1299,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 234,
    badge: "sale",
    tags: ["sale"],
    description:
      "Multi-functional sofa bed with storage compartment and easy conversion",
  },
  {
    id: 41,
    name: "Minimalist Loveseat",
    price: 899,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 178,
    badge: "",
    tags: [],
    description:
      "Compact 2-seater loveseat with clean lines and neutral upholstery",
  },
  {
    id: 42,
    name: "Reclining Sofa Set",
    price: 2599,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.9,
    reviews: 289,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "3-piece reclining sofa set with power recline and USB charging ports",
  },
  {
    id: 43,
    name: "Mid-Century Sofa",
    price: 1799,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.4,
    reviews: 145,
    badge: "",
    tags: [],
    description:
      "Mid-century modern sofa with walnut legs and button-tufted back",
  },
  {
    id: 44,
    name: "Modular Sofa System",
    price: 1999,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 203,
    badge: "new",
    tags: ["new"],
    description:
      "Customizable modular sofa system with interchangeable components",
  },
  {
    id: 45,
    name: "Luxury Velvet Sofa",
    price: 2199,
    category: "sofas",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 267,
    badge: "sale",
    tags: ["sale"],
    description:
      "Luxurious velvet sofa with gold accents and down-filled cushions",
  },

  // Add Kitchen products (IDs 46-54)
  {
    id: 46,
    name: "Kitchen Island Cart",
    price: 899,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 312,
    badge: "bestseller",
    tags: ["bestseller"],
    description:
      "Mobile kitchen island with granite top, storage, and towel bars",
  },
  {
    id: 47,
    name: "Pantry Storage Cabinet",
    price: 649,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 189,
    badge: "new",
    tags: ["new"],
    description:
      "Tall pantry cabinet with adjustable shelves and soft-close doors",
  },
  {
    id: 48,
    name: "Breakfast Bar Table",
    price: 449,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 156,
    badge: "",
    tags: [],
    description:
      "Counter-height breakfast table with storage shelf and wine rack",
  },
  {
    id: 49,
    name: "Spice Rack Organizer",
    price: 129,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.6,
    reviews: 234,
    badge: "sale",
    tags: ["sale"],
    description: "3-tier rotating spice rack with 30 glass jars and labels",
  },
  {
    id: 50,
    name: "Kitchen Utility Cart",
    price: 299,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.4,
    reviews: 178,
    badge: "",
    tags: [],
    description: "3-tier rolling utility cart with hooks and cutting board top",
  },
  {
    id: 51,
    name: "Microwave Stand",
    price: 199,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.7,
    reviews: 289,
    badge: "bestseller",
    tags: ["bestseller"],
    description: "Compact microwave stand with storage cabinet and open shelf",
  },
  {
    id: 52,
    name: "Kitchen Storage Bench",
    price: 349,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.3,
    reviews: 145,
    badge: "",
    tags: [],
    description: "Upholstered storage bench with lift-top and shoe storage",
  },
  {
    id: 53,
    name: "Coffee Station Cabinet",
    price: 549,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.8,
    reviews: 267,
    badge: "new",
    tags: ["new"],
    description:
      "Dedicated coffee station with cup storage and appliance shelf",
  },
  {
    id: 54,
    name: "Bakers Rack",
    price: 399,
    category: "kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by-wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    rating: 4.5,
    reviews: 198,
    badge: "sale",
    tags: ["sale"],
    description: "5-tier bakers rack with wine storage and hanging hooks",
  },
];

// Toast Notification System
const toastManager = {
  show: (message, type = "info", duration = 3000) => {
    const toastContainer = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    const icons = {
      success:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/></svg>',
      error:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/><line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/></svg>',
      warning:
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 16v-4" stroke="currentColor" stroke-width="2"/><path d="M12 8h.01" stroke="currentColor" stroke-width="2"/></svg>',
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-message">${message}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"/>
          <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"/>
        </svg>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add("show"), 100);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toastContainer.contains(toast)) {
          toastContainer.removeChild(toast);
        }
      }, 300);
    }, duration);
  },
};

// Theme Manager
const themeManager = {
  init: () => {
    document.documentElement.setAttribute("data-theme", storeState.theme);
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", themeManager.toggle);
    }
  },

  toggle: () => {
    storeState.theme = storeState.theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", storeState.theme);
    utils.saveToLocalStorage("furnish_theme", storeState.theme);
    toastManager.show(`Switched to ${storeState.theme} mode`, "info");
  },
};

// Cart Manager
const cartManager = {
  add: (product) => {
    const existingItem = storeState.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Always coerce price to a number, even if already a number
      let priceNum = product.price;
      if (typeof priceNum !== "number") {
        priceNum = Number(String(priceNum).replace(/[^\d.]/g, ""));
      }
      storeState.cart.push({
        ...product,
        price: priceNum,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });
    }

    cartManager.updateDisplay();
    utils.saveToLocalStorage("furnish_cart", storeState.cart);
    toastManager.show(`Added ${product.name} to cart`, "success");
  },

  remove: (productId) => {
    const item = storeState.cart.find((item) => item.id === productId);
    storeState.cart = storeState.cart.filter((item) => item.id !== productId);
    cartManager.updateDisplay();
    utils.saveToLocalStorage("furnish_cart", storeState.cart);

    if (item) {
      toastManager.show(`Removed ${item.name} from cart`, "info");
    }
  },

  updateDisplay: () => {
    const cartCount = document.querySelector(".cart-count");
    if (cartCount) {
      const totalItems = storeState.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      cartCount.textContent = totalItems;
      cartCount.style.display = totalItems > 0 ? "flex" : "none";
    }
  },

  getTotal: () => {
    return storeState.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
};

// Wishlist Manager
const wishlistManager = {
  toggle: (product) => {
    const existingIndex = storeState.wishlist.findIndex(
      (item) => item.id === product.id
    );

    if (existingIndex > -1) {
      storeState.wishlist.splice(existingIndex, 1);
      wishlistManager.updateDisplay();
      utils.saveToLocalStorage("furnish_wishlist", storeState.wishlist);
      toastManager.show(`Removed ${product.name} from wishlist`, "info");
      return false;
    } else {
      storeState.wishlist.push({
        ...product,
        addedAt: new Date().toISOString(),
      });
      wishlistManager.updateDisplay();
      utils.saveToLocalStorage("furnish_wishlist", storeState.wishlist);
      toastManager.show(`Added ${product.name} to wishlist`, "success");
      return true;
    }
  },

  updateDisplay: () => {
    const wishlistCount = document.querySelector(".wishlist-count");
    if (wishlistCount) {
      wishlistCount.textContent = storeState.wishlist.length;
      wishlistCount.style.display =
        storeState.wishlist.length > 0 ? "flex" : "none";
    }

    // Update wishlist button states
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      const productId = Number.parseInt(btn.dataset.productId);
      const isInWishlist = storeState.wishlist.some(
        (item) => item.id === productId
      );
      btn.classList.toggle("active", isInWishlist);
    });
  },

  isInWishlist: (productId) => {
    return storeState.wishlist.some((item) => item.id === productId);
  },
};

// Compare Manager
const compareManager = {
  maxItems: 3,

  add: (product) => {
    if (storeState.compareList.length >= compareManager.maxItems) {
      toastManager.show(
        `You can only compare up to ${compareManager.maxItems} products`,
        "warning"
      );
      return false;
    }

    const exists = storeState.compareList.some(
      (item) => item.id === product.id
    );
    if (exists) {
      toastManager.show("Product already in comparison", "warning");
      return false;
    }

    storeState.compareList.push(product);
    compareManager.updateDisplay();
    utils.saveToLocalStorage("furnish_compare", storeState.compareList);
    toastManager.show(`Added ${product.name} to comparison`, "success");
    return true;
  },

  remove: (productId) => {
    const item = storeState.compareList.find((item) => item.id === productId);
    storeState.compareList = storeState.compareList.filter(
      (item) => item.id !== productId
    );
    compareManager.updateDisplay();
    utils.saveToLocalStorage("furnish_compare", storeState.compareList);

    if (item) {
      toastManager.show(`Removed ${item.name} from comparison`, "info");
    }
  },

  clear: () => {
    storeState.compareList = [];
    compareManager.updateDisplay();
    utils.saveToLocalStorage("furnish_compare", storeState.compareList);
    toastManager.show("Comparison cleared", "info");
  },

  updateDisplay: () => {
    const compareBar = document.getElementById("compareBar");
    const compareItems = document.getElementById("compareItems");
    const compareCount = document.getElementById("compareCount");

    if (compareCount) {
      compareCount.textContent = storeState.compareList.length;
    }

    if (storeState.compareList.length > 0) {
      compareBar?.classList.add("active");

      if (compareItems) {
        compareItems.innerHTML = storeState.compareList
          .map(
            (product) => `
          <div class="compare-item">
            <img src="${product.image}" alt="${product.name}">
            <button class="remove-compare" onclick="compareManager.remove(${product.id})">&times;</button>
          </div>
        `
          )
          .join("");
      }
    } else {
      compareBar?.classList.remove("active");
    }

    // Update compare button states
    document.querySelectorAll(".compare-btn").forEach((btn) => {
      const productId = Number.parseInt(btn.dataset.productId);
      const isInComparison = storeState.compareList.some(
        (item) => item.id === productId
      );
      btn.classList.toggle("active", isInComparison);
    });
  },
};

// Product Manager
const productManager = {
  init: () => {
    storeState.products = [...sampleProducts];
    storeState.filteredProducts = [...sampleProducts];
    productManager.render();
  },

  filter: () => {
    let filtered = [...storeState.products];

    // Apply search filter
    if (storeState.searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(storeState.searchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(storeState.searchQuery.toLowerCase()) ||
          product.category
            .toLowerCase()
            .includes(storeState.searchQuery.toLowerCase())
      );
    }

    // Apply tag filter
    if (storeState.currentFilter !== "all") {
      filtered = filtered.filter((product) =>
        product.tags.includes(storeState.currentFilter)
      );
    }

    // Apply sorting
    switch (storeState.currentSort) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      default: // popularity
        filtered.sort((a, b) => b.reviews - a.reviews);
    }

    storeState.filteredProducts = filtered;
    storeState.currentPage = 1;
    productManager.render();
    productManager.updateResultsCount();
  },

  render: () => {
    const productsGrid = document.getElementById("productsGrid");
    if (!productsGrid) return;

    const startIndex =
      (storeState.currentPage - 1) * storeState.productsPerPage;
    const endIndex = startIndex + storeState.productsPerPage;
    const productsToShow = storeState.filteredProducts.slice(0, endIndex);

    productsGrid.innerHTML = productsToShow
      .map(
        (product) => `
      <div class="product-card animate-in" data-product-id="${product.id}">
        ${
          product.badge
            ? `<div class="product-badge ${product.badge}">${product.badge}</div>`
            : ""
        }
        
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-actions">
            <button class="action-btn-small wishlist-btn ${
              wishlistManager.isInWishlist(product.id) ? "active" : ""
            }" 
                    data-product-id="${product.id}" 
                    aria-label="Add to wishlist">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <button class="action-btn-small compare-btn" 
                    data-product-id="${product.id}" 
                    aria-label="Add to compare">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1v14M1 8h14" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <button class="quick-view-btn" data-product-id="${
            product.id
          }">Quick View</button>
        </div>

        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="product-price">${utils.formatPrice(product.price)}</div>
          <div class="product-rating">
            <span class="stars">${utils.generateStars(product.rating)}</span>
            <span class="rating-text">${product.rating} (${
          product.reviews
        })</span>
          </div>
          <div class="product-buttons">
            <button class="add-to-cart-btn" data-product-id="${product.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                <circle cx="20" cy="21" r="1" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="currentColor" stroke-width="2"/>
              </svg>
              Add to Cart
            </button>
            <button class="save-later-btn" data-product-id="${
              product.id
            }" aria-label="Save for later">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Update load more button
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    if (loadMoreBtn) {
      const hasMore = endIndex < storeState.filteredProducts.length;
      loadMoreBtn.style.display = hasMore ? "block" : "none";
    }

    // Add event listeners
    productManager.addEventListeners();
  },

  addEventListeners: () => {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = Number.parseInt(e.currentTarget.dataset.productId);
        const product = storeState.products.find((p) => p.id === productId);
        if (product) {
          cartManager.add(product);
          utils.animateElement(e.currentTarget, "animate-slide");
        }
      });
    });

    // Wishlist buttons
    document.querySelectorAll(".wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = Number.parseInt(e.currentTarget.dataset.productId);
        const product = storeState.products.find((p) => p.id === productId);
        if (product) {
          const isAdded = wishlistManager.toggle(product);
          e.currentTarget.classList.toggle("active", isAdded);
          utils.animateElement(e.currentTarget, "animate-slide");
        }
      });
    });

    // Compare buttons
    document.querySelectorAll(".compare-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const productId = Number.parseInt(e.currentTarget.dataset.productId);
        const product = storeState.products.find((p) => p.id === productId);
        if (product) {
          const isInComparison = storeState.compareList.some(
            (item) => item.id === productId
          );
          if (isInComparison) {
            compareManager.remove(productId);
          } else {
            compareManager.add(product);
          }
          utils.animateElement(e.currentTarget, "animate-slide");
        }
      });
    });

    // Quick view buttons removed
  },

  updateResultsCount: () => {
    const resultsCount = document.getElementById("resultsCount");
    if (resultsCount) {
      const count = storeState.filteredProducts.length;
      resultsCount.textContent = `Showing ${count} product${
        count !== 1 ? "s" : ""
      }`;
    }
  },

  loadMore: () => {
    storeState.currentPage++;
    productManager.render();
  },
};

// Modal Manager
const modalManager = {
  showQuickView: (product) => {
    const modal = document.createElement("div");
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <div class="modal-body">
          <div class="modal-image">
            <img src="${product.image}" alt="${product.name}">
          </div>
          <div class="modal-info">
            <h2>${product.name}</h2>
            <div class="product-rating">
              <span class="stars">${utils.generateStars(product.rating)}</span>
              <span class="rating-text">${product.rating} (${
      product.reviews
    } reviews)</span>
            </div>
            <div class="product-price">${utils.formatPrice(product.price)}</div>
            <p class="product-description">${product.description}</p>
            <div class="quantity-selector">
              <label for="quantity">Quantity:</label>
              <div class="qty-controls">
                <button class="qty-btn minus">-</button>
                <input type="number" id="quantity" class="qty-input" value="1" min="1" max="10">
                <button class="qty-btn plus">+</button>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-primary add-to-cart-modal" data-product-id="${
                product.id
              }">Add to Cart</button>
              <button class="btn-secondary add-to-wishlist-modal" data-product-id="${
                product.id
              }">Add to Wishlist</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Add event listeners
    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.style.overflow = "";
    };

    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Quantity controls
    const qtyInput = modal.querySelector(".qty-input");
    const minusBtn = modal.querySelector(".qty-btn.minus");
    const plusBtn = modal.querySelector(".qty-btn.plus");

    minusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(qtyInput.value);
      if (currentValue > 1) {
        qtyInput.value = currentValue - 1;
      }
    });

    plusBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(qtyInput.value);
      if (currentValue < 10) {
        qtyInput.value = currentValue + 1;
      }
    });

    // Modal actions
    modal.querySelector(".add-to-cart-modal").addEventListener("click", () => {
      const quantity = Number.parseInt(qtyInput.value);
      for (let i = 0; i < quantity; i++) {
        cartManager.add(product);
      }
      closeModal();
    });

    modal
      .querySelector(".add-to-wishlist-modal")
      .addEventListener("click", () => {
        wishlistManager.toggle(product);
        closeModal();
      });

    // Keyboard navigation
    document.addEventListener("keydown", function escapeHandler(e) {
      if (e.key === "Escape") {
        closeModal();
        document.removeEventListener("keydown", escapeHandler);
      }
    });
  },
};

// Search Manager
const searchManager = {
  init: () => {
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");

    if (searchInput) {
      const debouncedSearch = utils.debounce((query) => {
        storeState.searchQuery = query;
        productManager.filter();
        clearSearch.style.display = query ? "block" : "none";
      }, 300);

      searchInput.addEventListener("input", (e) => {
        debouncedSearch(e.target.value);
      });
    }

    if (clearSearch) {
      clearSearch.addEventListener("click", () => {
        searchInput.value = "";
        storeState.searchQuery = "";
        productManager.filter();
        clearSearch.style.display = "none";
        searchInput.focus();
      });
    }
  },
};

// Filter Manager
const filterManager = {
  init: () => {
    // Sort select
    const sortSelect = document.getElementById("sortSelect");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        storeState.currentSort = e.target.value;
        productManager.filter();
      });
    }

    // Filter tags
    document.querySelectorAll(".filter-tag").forEach((tag) => {
      tag.addEventListener("click", (e) => {
        document
          .querySelectorAll(".filter-tag")
          .forEach((t) => t.classList.remove("active"));
        e.target.classList.add("active");
        storeState.currentFilter = e.target.dataset.filter;
        productManager.filter();
      });
    });
  },

  filterByCategory: (category) => {
    storeState.filteredProducts = storeState.products.filter(
      (product) => product.category === category
    );
    productManager.render();
    productManager.updateResultsCount();
  },
};

// Category Manager
const categoryManager = {
  init: () => {
    document.querySelectorAll(".category-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.currentTarget.dataset.category;
        if (category) {
          filterManager.filterByCategory(category);

          // Scroll to products section
          document.getElementById("products").scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  },
};

// Loading Manager
const loadingManager = {
  show: () => {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.classList.add("active");
    }
  },

  hide: () => {
    const overlay = document.getElementById("loadingOverlay");
    if (overlay) {
      overlay.classList.remove("active");
    }
  },
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all managers
  themeManager.init();
  searchManager.init();
  filterManager.init();
  categoryManager.init();

  // Initialize product data
  productManager.init();

  // Update displays
  cartManager.updateDisplay();
  wishlistManager.updateDisplay();
  compareManager.updateDisplay();

  // Load more button
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      loadingManager.show();
      setTimeout(() => {
        productManager.loadMore();
        loadingManager.hide();
      }, 500);
    });
  }

  // Compare actions
  const compareBtn = document.getElementById("compareBtn");
  const clearCompareBtn = document.getElementById("clearCompareBtn");

  if (compareBtn) {
    compareBtn.addEventListener("click", () => {
      if (storeState.compareList.length < 2) {
        toastManager.show("Add at least 2 products to compare", "warning");
        return;
      }
      toastManager.show("Comparison feature coming soon!", "info");
    });
  }

  if (clearCompareBtn) {
    clearCompareBtn.addEventListener("click", () => {
      compareManager.clear();
    });
  }

  // Header actions
  document.getElementById("searchBtn")?.addEventListener("click", () => {
    document.getElementById("searchInput")?.focus();
  });

  document.getElementById("wishlistBtn")?.addEventListener("click", () => {
    const count = storeState.wishlist.length;
    toastManager.show(
      `Wishlist (${count} item${count !== 1 ? "s" : ""})`,
      "info"
    );
  });

  document.getElementById("cartBtn")?.addEventListener("click", () => {
    const count = storeState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartManager.getTotal();
    toastManager.show(
      `Cart (${count} item${count !== 1 ? "s" : ""}) - ${utils.formatPrice(
        total
      )}`,
      "info"
    );
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll(".category-card, .product-card").forEach((el) => {
    observer.observe(el);
  });

  console.log("Enhanced Furnish Store - All features loaded successfully!");
});

// Simple cart handler for localStorage and UI feedback (non-intrusive, for compatibility)
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart from localStorage or empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Update cart count in header
  function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountEl = document.querySelector(".cart-count");
    if (cartCountEl) cartCountEl.textContent = totalItems;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Add to cart functionality
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();

      const productCard = this.closest(".product-card");
      if (!productCard) return;

      const productId =
        this.getAttribute("data-product-id") ||
        productCard.getAttribute("data-product-id");
      const productName = productCard.querySelector("h3")
        ? productCard.querySelector("h3").textContent
        : "";
      const productPriceEl = productCard.querySelector(".product-price");
      const productPrice = productPriceEl ? productPriceEl.textContent : "";
      const productImageEl = productCard.querySelector(".product-image img");
      const productImage = productImageEl ? productImageEl.src : "";

      const productData = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      };

      // Save only the selected product to cart and redirect
      localStorage.setItem("furnish_cart", JSON.stringify([productData]));
      window.location.href = "cart.html";
    });
  });

  // Initialize cart count on page load
  updateCartCount();

  // Cart button functionality (you'll need to implement the cart modal/view)
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", function () {
      // Here you would show the cart with all items
      // For now, we'll just log the cart contents
      console.log("Cart contents:", cart);
      alert(
        `You have ${cart.reduce(
          (total, item) => total + item.quantity,
          0
        )} items in your cart.`
      );
    });
  }
});

// Export for potential external use
window.FurnishStore = {
  state: storeState,
  managers: {
    cart: cartManager,
    wishlist: wishlistManager,
    compare: compareManager,
    product: productManager,
    theme: themeManager,
    toast: toastManager,
  },
  utils,
};
