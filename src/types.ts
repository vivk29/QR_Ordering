export type UserRole = 'customer' | 'vendor' | 'admin';

export interface Vendor {
  id: string;
  name: string;
  address: string;
  phone: string;
  logo: string;
  vendorCode: string;
}

export interface MenuItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageURL: string;
  availability: boolean;
}

export type OrderStatus = 'Placed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  vendorId: string;
  vendorName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'Cash';
  createdAt: any;
  customerName?: string;
  orderNumber: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  vendorId?: string;
}
