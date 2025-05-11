
export interface Category {
  id: string;
  name: string; // Arabic name
  slug: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface Product {
  id: string;
  name: string; // Arabic name
  description: string; // Arabic description
  price: number; // EGP
  imageUrls: string[]; // Changed from imageUrl: string to support multiple images
  categorySlug: string;
  stock: number;
  // Add more fields as needed, e.g., brand, specifications
}

export interface CartItem extends Product { // Product already has imageUrls, so CartItem will too
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  name?: string;
  phone?: string;
  address?: string;
}

export type Governorate = {
  name: string; // Arabic name
  shippingCost: number;
};

export interface Order {
  id: string;
  userId: string | null; 
  customerDetails: {
    name: string;
    phone: string;
    alternatePhone?: string;
    address: string;
    landmark?: string;
    email?: string;
    governorate: string;
  };
  items: CartItem[];
  totalAmount: number; // Sum of item prices * quantity
  shippingCost: number;
  finalAmount: number; // totalAmount + shippingCost
  paymentMethod: 'vodafone_cash' | 'fawry' | 'cod'; // Arabic equivalents for display
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'on_hold' | 'rejected' | 'cancelled'; // Arabic equivalents for display
  createdAt: string; // ISO date string
}

export interface AdminStats {
  totalRevenue: number;
  monthlyRevenue: number; // For current month
  dailyOrders: number;
  monthlyOrders: number; // For current month
  newCustomersToday: number;
  totalActiveCustomers: number; // Customers with orders
  totalProducts: number;
  lowStockProductsCount: number; // Count of products with stock < 10
  topSellingProducts: { name: string; count: number }[]; // Top 3-5
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: string; // ISO date string
  isRead: boolean;
}

export interface Offer {
  id: string;
  title: string; 
  description?: string;
  productId?: string; 
  categorySlug?: string; 
  discountPercentage?: number; 
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  imageUrl?: string; 
  isActive: boolean;
  couponCode?: string; // Optional coupon code for the offer
}
