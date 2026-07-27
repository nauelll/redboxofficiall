// REDBOX types — shared across catalog, admin, API.
export type Badge = "NEW_ARRIVAL" | "BEST_SELLER" | "TRENDING" | "LIMITED_EDITION" | "SALE";

export interface ProductColor { name: string; hex: string; }

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku?: string;
  description: string;
  detailInfo?: string;
  careInfo?: string;
  material?: string;
  categoryId?: string;
  categorySlug?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategorySlug?: string;
  subcategoryName?: string;
  price?: number;
  weightGram?: number;
  images: string[];
  video?: string;
  sizes: string[];
  colors: ProductColor[];
  badge?: Badge | null;
  rating: number;
  reviewCount: number;
  popularity: number;
  shopeeUrl?: string;
  tiktokUrl?: string;
  lazadaUrl?: string;
  whatsappUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  altImage?: string;
  status: "published" | "draft" | "archived";
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description?: string;
  icon?: string;
  image?: string;
  bannerImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  sortOrder: number;
  isActive: boolean;
  subcategories: Subcategory[];
  productCount?: number;
}

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  imageDesktop: string;
  imageMobile?: string;
  placement: string;
  overlay: string;
  sortOrder: number;
  startAt?: string | null;
  endAt?: string | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  publishedAt: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
  body: string;
}

export interface SiteSettings {
  marketplace: {
    shopee: string;
    tokopedia: string;
    lazada: string;
    tiktokShop: string;
    whatsapp: string;
    whatsappNumber: string;
  };
  social: {
    instagram: string;
    instagramHandle: string;
    tiktok: string;
    facebook: string;
    whatsapp: string;
  };
  brand: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    location: string;
    address: string;
    operatingHours: string;
    mapsEmbed: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
  };
  contact: {
    formEmail: string;
  };
}
