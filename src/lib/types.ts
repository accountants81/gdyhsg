
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
  imageUrl: string;
  categorySlug: string;
  stock: number;
  // Add more fields as needed, e.g., brand, specifications
}

export interface CartItem extends Product {
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
  dailyOrders: number;
  monthlyOrders: number;
  registeredCustomers: number;
  totalProducts: number;
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
