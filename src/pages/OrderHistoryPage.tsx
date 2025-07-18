import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Search,
  Filter,
  Calendar,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
} from "lucide-react";
import { orderService } from "../services/orderService";
import {
  Order,
  OrderFilters,
  ORDER_STATUS_MAP,
  OrderStatus,
} from "../types/order";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import StaggeredList, {
  StaggeredItem,
} from "../components/animations/StaggeredList";
import AnimatedButton from "../components/animations/AnimatedButton";
import { fadeVariants, getReducedMotionVariants } from "../utils/animations";

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<OrderFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const ITEMS_PER_PAGE = 5;

  // Fetch orders
  const {
    data: orderHistory,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orderHistory", currentPage, filters],
    queryFn: () =>
      orderService.getOrderHistory(currentPage, ITEMS_PER_PAGE, filters),
    enabled: !!user,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchQuery }));
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: OrderStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status }));
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      toast({
        title: "Hủy đơn hàng thành công",
        description: `Đơn hàng ${orderId} đã được hủy.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Hủy đơn hàng thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || "/placeholder.svg";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancelOrder = (order: Order) => {
    return ["pending", "confirmed"].includes(order.status);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vui lòng đăng nhập
          </h2>
          <p className="text-gray-600 mb-8">
            Bạn cần đăng nhập để xem lịch sử đơn hàng
          </p>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <span>Đăng nhập</span>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Có lỗi xảy ra
          </h2>
          <p className="text-gray-600 mb-8">
            Không thể tải lịch sử đơn hàng. Vui lòng thử lại.
          </p>
          <button
            onClick={() => refetch()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const orders = orderHistory?.orders || [];
  const totalPages = orderHistory?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            <span>Về trang chủ</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Lịch sử đơn hàng</h1>
          <p className="text-gray-600 mt-2">
            Quản lý và theo dõi các đơn hàng của bạn
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm theo mã đơn hàng hoặc tên sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </form>

            {/* Filter Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter size={18} />
                <span>Lọc</span>
              </button>

              {(filters.status || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={18} />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleStatusFilter(undefined)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    !filters.status
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                {Object.values(ORDER_STATUS_MAP).map((statusInfo) => (
                  <button
                    key={statusInfo.status}
                    onClick={() => handleStatusFilter(statusInfo.status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.status === statusInfo.status
                        ? `${statusInfo.bgColor} ${statusInfo.color}`
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {statusInfo.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ShoppingBag size={20} />
              <span>Bắt đầu mua sắm</span>
            </Link>
          </div>
        ) : (
          <StaggeredList className="space-y-6">
            <AnimatePresence>
              {orders.map((order) => {
                const statusInfo = ORDER_STATUS_MAP[order.status];
                return (
                  <StaggeredItem key={order.id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg shadow-sm overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Đơn hàng #{order.orderId}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Đặt hàng: {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-lg font-bold text-emerald-600">
                                {order.total.toLocaleString("vi-VN")}₫
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.items.length} sản phẩm
                              </p>
                            </div>

                            <div className="flex space-x-2">
                              <Link
                                to={`/order-detail/${order.id}`}
                                className="inline-flex items-center space-x-1 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              >
                                <Eye size={16} />
                                <span>Xem</span>
                              </Link>

                              {canCancelOrder(order) && (
                                <button
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="inline-flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X size={16} />
                                  <span>Hủy</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="p-6">
                        <div className="space-y-3">
                          {order.items.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4"
                            >
                              <img
                                src={getProductImage(item.product)}
                                alt={item.product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "/placeholder.svg";
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.product.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {item.price.toLocaleString("vi-VN")}₫ x{" "}
                                  {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">
                                  {(item.price * item.quantity).toLocaleString(
                                    "vi-VN"
                                  )}
                                  ₫
                                </p>
                              </div>
                            </div>
                          ))}

                          {order.items.length > 2 && (
                            <p className="text-sm text-gray-600 text-center py-2">
                              và {order.items.length - 2} sản phẩm khác...
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </StaggeredItem>
                );
              })}
            </AnimatePresence>
          </StaggeredList>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-emerald-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
