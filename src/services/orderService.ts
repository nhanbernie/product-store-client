import { apiClient } from "./apiClient";
import { Order, OrderFilters, OrderHistoryResponse } from "../types/order";

export interface CreateOrderRequest {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    notes?: string;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  timestamp: string;
}

class OrderService {
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      console.log("Creating order with data:", orderData);
      const response = await apiClient.request<ApiResponse<Order>>("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      console.log("Order created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw error;
    }
  }

  async getOrderHistory(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters
  ): Promise<OrderHistoryResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.status) {
        params.append("status", filters.status);
      }
      if (filters?.dateFrom) {
        params.append("dateFrom", filters.dateFrom);
      }
      if (filters?.dateTo) {
        params.append("dateTo", filters.dateTo);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }

      const response = await apiClient.request<
        ApiResponse<OrderHistoryResponse>
      >(`/orders/history?${params.toString()}`);

      return response.data;
    } catch (error) {
      console.error("Failed to fetch order history:", error);
      // Return mock data for development
      return this.getMockOrderHistory(page, limit, filters);
    }
  }

  async getOrderById(id: string): Promise<Order> {
    try {
      console.log("Fetching order by id:", id);
      const response = await apiClient.request<ApiResponse<Order>>(
        `/orders/${id}`
      );

      console.log("Order fetched successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch order:", error);
      // Return mock data for development
      return this.getMockOrder(id);
    }
  }

  async cancelOrder(id: string): Promise<Order> {
    try {
      console.log("Cancelling order with id:", id);
      const response = await apiClient.request<ApiResponse<Order>>(
        `/orders/${id}/cancel`,
        {
          method: "PUT",
        }
      );

      console.log("Order cancelled successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      throw error;
    }
  }

  // Mock data for development
  private getMockOrderHistory(
    page: number = 1,
    limit: number = 10,
    filters?: OrderFilters
  ): OrderHistoryResponse {
    // Get orders from localStorage first
    const localOrders = JSON.parse(
      localStorage.getItem("fashionCollection_orders") || "[]"
    );
    const mockOrders: Order[] = [
      {
        id: "1",
        orderId: "FC1703832177479",
        customerId: "user1",
        customerInfo: {
          name: "Nguyễn Văn A",
          email: "user@example.com",
          phone: "0123456789",
          address: "123 Đường ABC",
          city: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          notes: "Giao hàng giờ hành chính",
        },
        items: [
          {
            id: "1",
            product: {
              _id: "1",
              name: "Áo Thun Nam Basic",
              description: "Áo thun nam chất liệu cotton cao cấp",
              price: 299000,
              imageUrl: "/placeholder.svg",
              category: "Áo nam",
              rating: 4.5,
              reviews: 120,
            },
            quantity: 2,
            price: 299000,
          },
        ],
        subtotal: 598000,
        shippingFee: 30000,
        total: 628000,
        status: "delivered",
        paymentMethod: "COD",
        paymentStatus: "paid",
        createdAt: "2024-12-29T10:30:00Z",
        updatedAt: "2024-12-31T14:20:00Z",
        deliveredAt: "2024-12-31T14:20:00Z",
        trackingNumber: "VN123456789",
      },
      {
        id: "2",
        orderId: "FC1703745777479",
        customerId: "user1",
        customerInfo: {
          name: "Nguyễn Văn A",
          email: "user@example.com",
          phone: "0123456789",
          address: "123 Đường ABC",
          city: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          notes: "",
        },
        items: [
          {
            id: "2",
            product: {
              _id: "2",
              name: "Quần Jeans Slim Fit",
              description: "Quần jeans nam form slim fit",
              price: 599000,
              imageUrl: "/placeholder.svg",
              category: "Quần nam",
              rating: 4.3,
              reviews: 85,
            },
            quantity: 1,
            price: 599000,
          },
        ],
        subtotal: 599000,
        shippingFee: 0,
        total: 599000,
        status: "shipping",
        paymentMethod: "COD",
        paymentStatus: "pending",
        createdAt: "2024-12-28T15:45:00Z",
        updatedAt: "2024-12-30T09:15:00Z",
        estimatedDelivery: "2025-01-02T17:00:00Z",
        trackingNumber: "VN987654321",
      },
      {
        id: "3",
        orderId: "FC1703659377479",
        customerId: "user1",
        customerInfo: {
          name: "Nguyễn Văn A",
          email: "user@example.com",
          phone: "0123456789",
          address: "123 Đường ABC",
          city: "Hồ Chí Minh",
          district: "Quận 1",
          ward: "Phường Bến Nghé",
          notes: "",
        },
        items: [
          {
            id: "3",
            product: {
              _id: "3",
              name: "Áo Sơ Mi Trắng",
              description: "Áo sơ mi trắng công sở",
              price: 450000,
              imageUrl: "/placeholder.svg",
              category: "Áo nam",
              rating: 4.7,
              reviews: 200,
            },
            quantity: 1,
            price: 450000,
          },
        ],
        subtotal: 450000,
        shippingFee: 30000,
        total: 480000,
        status: "cancelled",
        paymentMethod: "COD",
        paymentStatus: "failed",
        createdAt: "2024-12-27T08:20:00Z",
        updatedAt: "2024-12-27T10:30:00Z",
      },
    ];

    // Combine localStorage orders with mock orders
    const allOrders = [...localOrders, ...mockOrders];

    // Apply filters
    let filteredOrders = allOrders;

    if (filters?.status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === filters.status
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredOrders = filteredOrders.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchLower) ||
          order.items.some((item) =>
            item.product.name.toLowerCase().includes(searchLower)
          )
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    return {
      orders: paginatedOrders,
      total: filteredOrders.length,
      page,
      limit,
      totalPages: Math.ceil(filteredOrders.length / limit),
    };
  }

  private getMockOrder(orderId: string): Order {
    // Check localStorage first
    const localOrders = JSON.parse(
      localStorage.getItem("fashionCollection_orders") || "[]"
    );
    const localOrder = localOrders.find(
      (o: any) => o.id === orderId || o.orderId === orderId
    );

    if (localOrder) {
      return localOrder;
    }

    // Fallback to mock orders
    const mockOrders = this.getMockOrderHistory().orders;
    const order = mockOrders.find(
      (o) => o.id === orderId || o.orderId === orderId
    );

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }
}

export const orderService = new OrderService();
