import { Product } from './product';
import { CustomerInfo } from './cart';

export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number; // Price at time of order
}

export interface Order {
  id: string;
  orderId: string; // Display order ID (e.g., FC1234567890)
  customerId: string;
  customerInfo: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  trackingNumber?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending'       // Chờ xác nhận
  | 'confirmed'     // Đã xác nhận
  | 'preparing'     // Đang chuẩn bị
  | 'shipping'      // Đang giao hàng
  | 'delivered'     // Đã giao hàng
  | 'cancelled'     // Đã hủy
  | 'returned';     // Đã trả hàng

export type PaymentStatus = 
  | 'pending'       // Chờ thanh toán
  | 'paid'          // Đã thanh toán
  | 'failed'        // Thanh toán thất bại
  | 'refunded';     // Đã hoàn tiền

export interface OrderStatusInfo {
  status: OrderStatus;
  label: string;
  color: string;
  bgColor: string;
  description: string;
}

export const ORDER_STATUS_MAP: Record<OrderStatus, OrderStatusInfo> = {
  pending: {
    status: 'pending',
    label: 'Chờ xác nhận',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: 'Đơn hàng đang chờ được xác nhận'
  },
  confirmed: {
    status: 'confirmed',
    label: 'Đã xác nhận',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: 'Đơn hàng đã được xác nhận và đang được xử lý'
  },
  preparing: {
    status: 'preparing',
    label: 'Đang chuẩn bị',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: 'Đang chuẩn bị hàng hóa'
  },
  shipping: {
    status: 'shipping',
    label: 'Đang giao hàng',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: 'Đơn hàng đang được giao đến bạn'
  },
  delivered: {
    status: 'delivered',
    label: 'Đã giao hàng',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: 'Đơn hàng đã được giao thành công'
  },
  cancelled: {
    status: 'cancelled',
    label: 'Đã hủy',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: 'Đơn hàng đã bị hủy'
  },
  returned: {
    status: 'returned',
    label: 'Đã trả hàng',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: 'Đơn hàng đã được trả lại'
  }
};

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface OrderHistoryResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
