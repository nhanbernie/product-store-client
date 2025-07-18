import { Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selected: boolean;
  addedAt: string;
}

export interface CartSummary {
  totalItems: number;
  selectedItems: number;
  totalPrice: number;
  selectedPrice: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: CustomerInfo;
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes: string;
}

export interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleItemSelection: (itemId: string) => void;
  selectAllItems: () => void;
  deselectAllItems: () => void;
  clearCart: () => void;
  removeSelectedItems: () => void;
  getSelectedItems: () => CartItem[];
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}
