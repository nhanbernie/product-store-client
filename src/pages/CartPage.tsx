import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import StaggeredList, {
  StaggeredItem,
} from "../components/animations/StaggeredList";
import AnimatedButton from "../components/animations/AnimatedButton";
import {
  fadeVariants,
  scaleVariants,
  getReducedMotionVariants,
} from "../utils/animations";

const CartPage = () => {
  const {
    items,
    summary,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    getSelectedItems,
  } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const selectedItems = getSelectedItems();
  const allSelected = items.length > 0 && selectedItems.length === items.length;
  const someSelected = selectedItems.length > 0;

  const handleSelectAll = () => {
    if (allSelected) {
      deselectAllItems();
    } else {
      selectAllItems();
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "Chưa chọn sản phẩm",
        description: "Vui lòng chọn ít nhất một sản phẩm để thanh toán.",
        variant: "destructive",
      });
      return;
    }

    // Navigate to checkout with selected items
    navigate("/checkout", { state: { selectedItems } });
  };

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || "/placeholder.svg";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-600 mb-8">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <ArrowLeft size={20} />
              <span>Tiếp tục mua sắm</span>
            </Link>
          </div>
          <p className="text-gray-600 mt-2">
            {items.length} sản phẩm trong giỏ hàng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Select All Header */}
              <div className="p-4 border-b border-gray-200">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="font-medium text-gray-900">
                    Chọn tất cả ({items.length} sản phẩm)
                  </span>
                </label>
              </div>

              {/* Cart Items List */}
              <StaggeredList className="divide-y divide-gray-200">
                <AnimatePresence>
                  {items.map((item) => (
                    <StaggeredItem key={item.id}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-4"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItemSelection(item.id)}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 mt-2"
                          />

                          {/* Product Image */}
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

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {item.product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-emerald-600">
                                {item.product.price.toLocaleString("vi-VN")}₫
                              </span>

                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="p-1 hover:bg-gray-100 rounded-l-lg"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus size={16} />
                                  </motion.button>
                                  <motion.span
                                    key={item.quantity}
                                    initial={{ scale: 1.2, color: '#10b981' }}
                                    animate={{ scale: 1, color: '#000' }}
                                    transition={{ duration: 0.2 }}
                                    className="px-3 py-1 text-center min-w-[3rem]"
                                  >
                                    {item.quantity}
                                  </motion.span>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="p-1 hover:bg-gray-100 rounded-r-lg"
                                  >
                                    <Plus size={16} />
                                  </motion.button>
                                </div>

                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Subtotal */}
                            <div className="mt-2 text-right">
                              <span className="text-sm text-gray-600">Tổng: </span>
                              <span className="font-medium text-gray-900">
                                {(
                                  item.product.price * item.quantity
                                ).toLocaleString("vi-VN")}
                                ₫
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </StaggeredItem>
                  ))}
                </AnimatePresence>
              </StaggeredList>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng sản phẩm:</span>
                  <span className="font-medium">{summary.totalItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đã chọn:</span>
                  <span className="font-medium">{summary.selectedItems}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền hàng:</span>
                  <span className="font-medium">
                    {summary.totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền hàng đã chọn:</span>
                  <span className="font-medium text-emerald-600">
                    {summary.selectedPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="text-emerald-600">
                    {summary.selectedPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              <AnimatedButton
                onClick={handleCheckout}
                disabled={!someSelected}
                variant="primary"
                size="lg"
                className="w-full"
              >
                Thanh toán ({summary.selectedItems} sản phẩm)
              </AnimatedButton>

              <p className="text-xs text-gray-500 mt-3 text-center">
                Bằng việc đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng
                tôi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
