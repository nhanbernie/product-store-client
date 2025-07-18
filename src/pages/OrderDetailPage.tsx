import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Truck,
  CheckCircle,
  X,
  CreditCard,
  FileText,
} from "lucide-react";
import { orderService } from "../services/orderService";
import { ORDER_STATUS_MAP } from "../types/order";
import { useToast } from "@/hooks/use-toast";
import StaggeredList, {
  StaggeredItem,
} from "../components/animations/StaggeredList";
import AnimatedButton from "../components/animations/AnimatedButton";
import {
  staggerContainer,
  staggerItem,
  getReducedMotionVariants,
} from "../utils/animations";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
  });

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await orderService.cancelOrder(order.id);
      toast({
        title: "Hủy đơn hàng thành công",
        description: `Đơn hàng ${order.orderId} đã được hủy.`,
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

  const canCancelOrder = (order: any) => {
    return ["pending", "confirmed"].includes(order.status);
  };

  const getOrderTimeline = (order: any) => {
    const timeline = [
      {
        status: "pending",
        label: "Đơn hàng đã được tạo",
        date: order.createdAt,
        completed: true,
      },
      {
        status: "confirmed",
        label: "Đơn hàng đã được xác nhận",
        date: order.status !== "pending" ? order.updatedAt : null,
        completed: ["confirmed", "preparing", "shipping", "delivered"].includes(
          order.status
        ),
      },
      {
        status: "preparing",
        label: "Đang chuẩn bị hàng",
        date: order.status === "preparing" ? order.updatedAt : null,
        completed: ["preparing", "shipping", "delivered"].includes(
          order.status
        ),
      },
      {
        status: "shipping",
        label: "Đang giao hàng",
        date: order.status === "shipping" ? order.updatedAt : null,
        completed: ["shipping", "delivered"].includes(order.status),
      },
      {
        status: "delivered",
        label: "Đã giao hàng",
        date: order.deliveredAt,
        completed: order.status === "delivered",
      },
    ];

    if (order.status === "cancelled") {
      return [
        timeline[0],
        {
          status: "cancelled",
          label: "Đơn hàng đã bị hủy",
          date: order.updatedAt,
          completed: true,
        },
      ];
    }

    return timeline;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-8">
            Đơn hàng không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            to="/order-history"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay lại lịch sử đơn hàng</span>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = ORDER_STATUS_MAP[order.status];
  const timeline = getOrderTimeline(order);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/order-history"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            <span>Quay lại lịch sử đơn hàng</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Đơn hàng #{order.orderId}
              </h1>
              <p className="text-gray-600 mt-2">
                Đặt hàng: {formatDate(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>

              {canCancelOrder(order) && (
                <motion.button
                  onClick={handleCancelOrder}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
                >
                  <X size={16} />
                  <span>Hủy đơn hàng</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Tiến trình đơn hàng
              </h2>

              <div className="relative">
                <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>

                <StaggeredList
                  className="space-y-6"
                  delay={0.2}
                  staggerDelay={0.15}
                >
                  {timeline.map((step, index) => (
                    <StaggeredItem key={step.status}>
                      <motion.div
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            step.completed
                              ? step.status === "cancelled"
                                ? "bg-red-500"
                                : "bg-emerald-500"
                              : "bg-gray-300"
                          }`}
                        >
                          {step.completed ? (
                            step.status === "cancelled" ? (
                              <X className="w-5 h-5 text-white" />
                            ) : (
                              <CheckCircle className="w-5 h-5 text-white" />
                            )
                          ) : (
                            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3
                            className={`font-medium ${
                              step.completed ? "text-gray-900" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </h3>
                          {step.date && (
                            <p className="text-sm text-gray-600">
                              {formatDate(step.date)}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    </StaggeredItem>
                  ))}
                </StaggeredList>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="mr-2" size={20} />
                Sản phẩm đã đặt
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={getProductImage(item.product)}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {item.price.toLocaleString("vi-VN")}₫ x{" "}
                          {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-emerald-600">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}
                          ₫
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span className="font-medium">
                      {order.subtotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span className="font-medium">
                      {order.shippingFee === 0
                        ? "Miễn phí"
                        : `${order.shippingFee.toLocaleString("vi-VN")}₫`}
                    </span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-emerald-600">
                      {order.total.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Info Sidebar */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="mr-2" size={18} />
                Thông tin giao hàng
              </h2>

              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Người nhận</h3>
                  <p className="text-gray-600">{order.customerInfo.name}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Phone className="mr-1" size={14} />
                    Số điện thoại
                  </h3>
                  <p className="text-gray-600">{order.customerInfo.phone}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 flex items-center">
                    <Mail className="mr-1" size={14} />
                    Email
                  </h3>
                  <p className="text-gray-600">{order.customerInfo.email}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Địa chỉ</h3>
                  <p className="text-gray-600">
                    {order.customerInfo.address}, {order.customerInfo.ward},{" "}
                    {order.customerInfo.district}, {order.customerInfo.city}
                  </p>
                </div>

                {order.customerInfo.notes && (
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <FileText className="mr-1" size={14} />
                      Ghi chú
                    </h3>
                    <p className="text-gray-600">{order.customerInfo.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CreditCard className="mr-2" size={18} />
                Thanh toán
              </h2>

              <div className="space-y-3">
                <div>
                  <h3 className="font-medium text-gray-900">Phương thức</h3>
                  <p className="text-gray-600">{order.paymentMethod}</p>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900">Trạng thái</h3>
                  <p
                    className={`text-sm font-medium ${
                      order.paymentStatus === "paid"
                        ? "text-green-600"
                        : order.paymentStatus === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {order.paymentStatus === "paid" && "Đã thanh toán"}
                    {order.paymentStatus === "pending" && "Chờ thanh toán"}
                    {order.paymentStatus === "failed" && "Thanh toán thất bại"}
                    {order.paymentStatus === "refunded" && "Đã hoàn tiền"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {order.trackingNumber && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="mr-2" size={18} />
                  Vận chuyển
                </h2>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900">Mã vận đơn</h3>
                    <p className="text-gray-600 font-mono">
                      {order.trackingNumber}
                    </p>
                  </div>

                  {order.estimatedDelivery && (
                    <div>
                      <h3 className="font-medium text-gray-900 flex items-center">
                        <Calendar className="mr-1" size={14} />
                        Dự kiến giao hàng
                      </h3>
                      <p className="text-gray-600">
                        {formatDate(order.estimatedDelivery)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
