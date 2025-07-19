import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  CreditCard,
} from "lucide-react";
import { CartItem, CustomerInfo } from "../types/cart";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import AnimatedButton from "../components/animations/AnimatedButton";
import {
  fadeVariants,
  staggerContainer,
  staggerItem,
  getReducedMotionVariants,
} from "../utils/animations";
import { orderService } from "../services/orderService";
import { parseApiError } from "../utils/errorUtils";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { removeSelectedItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  // Get selected items from navigation state
  const selectedItems: CartItem[] = location.state?.selectedItems || [];

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    notes: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để tiếp tục thanh toán.",
        variant: "destructive",
      });
      navigate("/login", {
        state: {
          from: location.pathname,
          selectedItems,
        },
      });
      return;
    }
  }, [user, navigate, toast, location.pathname, selectedItems]);

  // Redirect if no items selected
  useEffect(() => {
    if (selectedItems.length === 0) {
      toast({
        title: "Không có sản phẩm",
        description: "Vui lòng chọn sản phẩm từ giỏ hàng để thanh toán.",
        variant: "destructive",
      });
      navigate("/cart");
    }
  }, [selectedItems, navigate, toast]);

  // Calculate totals
  const subtotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
  const total = subtotal + shippingFee;

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || "/placeholder.svg";
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!customerInfo.name.trim()) {
      newErrors.name = "Họ tên là bắt buộc";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!customerInfo.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!customerInfo.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }

    if (!customerInfo.city.trim()) {
      newErrors.city = "Thành phố là bắt buộc";
    }

    if (!customerInfo.district.trim()) {
      newErrors.district = "Quận/Huyện là bắt buộc";
    }

    if (!customerInfo.ward.trim()) {
      newErrors.ward = "Phường/Xã là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare order data for API
      const orderData = {
        customerInfo,
        items: selectedItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod: "COD",
      };

      // Call API to create order
      const createdOrder = await orderService.createOrder(orderData);

      // Remove selected items from cart
      removeSelectedItems();

      toast({
        title: "Đặt hàng thành công!",
        description: `Mã đơn hàng: ${createdOrder.orderId}`,
      });

      // Navigate to order confirmation
      navigate("/order-confirmation", {
        state: {
          orderId: createdOrder.orderId,
          customerInfo: createdOrder.customerInfo,
          items: createdOrder.items,
          total: createdOrder.total,
        },
      });
    } catch (error) {
      console.error("Order creation failed:", error);

      // Parse API error response using utility
      const errorMessage = parseApiError(error);

      toast({
        title: "Đặt hàng thất bại",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4"
          >
            <ArrowLeft size={20} />
            <span>Quay lại giỏ hàng</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất thông tin để đặt hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Thông tin giao hàng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Họ và tên *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Số điện thoại *
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Địa chỉ *
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    className={`pl-10 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Số nhà, tên đường"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* City, District, Ward */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Thành phố *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleInputChange}
                    className={`px-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Thành phố"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Quận/Huyện *
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={customerInfo.district}
                    onChange={handleInputChange}
                    className={`px-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.district ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Quận/Huyện"
                  />
                  {errors.district && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.district}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="ward"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phường/Xã *
                  </label>
                  <input
                    type="text"
                    id="ward"
                    name="ward"
                    value={customerInfo.ward}
                    onChange={handleInputChange}
                    className={`px-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      errors.ward ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Phường/Xã"
                  />
                  {errors.ward && (
                    <p className="mt-1 text-sm text-red-600">{errors.ward}</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Ghi chú (tùy chọn)
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <textarea
                    id="notes"
                    name="notes"
                    value={customerInfo.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Đơn hàng của bạn
            </h2>

            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {(item.product.price * item.quantity).toLocaleString(
                      "vi-VN"
                    )}
                    ₫
                  </div>
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span className="font-medium">
                  {subtotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển:</span>
                <span className="font-medium">
                  {shippingFee === 0
                    ? "Miễn phí"
                    : `${shippingFee.toLocaleString("vi-VN")}₫`}
                </span>
              </div>
              {shippingFee === 0 && (
                <p className="text-xs text-emerald-600">
                  🎉 Miễn phí vận chuyển cho đơn hàng trên 500.000₫
                </p>
              )}
              <hr className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-emerald-600">
                  {total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="text-gray-600" size={20} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Thanh toán khi nhận hàng (COD)
                  </p>
                  <p className="text-xs text-gray-600">
                    Thanh toán bằng tiền mặt khi nhận hàng
                  </p>
                </div>
              </div>
            </div>

            {/* Place Order Button */}
            <AnimatedButton
              onClick={handleSubmit}
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="primary"
              size="lg"
              className="w-full mt-6"
            >
              {!isSubmitting && (
                <span>Đặt hàng ({selectedItems.length} sản phẩm)</span>
              )}
            </AnimatedButton>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng
              tôi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
