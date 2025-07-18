import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Phone, Mail, Home, ShoppingBag } from 'lucide-react';
import { CartItem, CustomerInfo } from '../types/cart';

const OrderConfirmationPage = () => {
  const location = useLocation();
  
  // Get order data from navigation state
  const orderId: string = location.state?.orderId || '';
  const customerInfo: CustomerInfo = location.state?.customerInfo || {};
  const items: CartItem[] = location.state?.items || [];
  const total: number = location.state?.total || 0;

  const getProductImage = (product: any) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return product.imageUrl || '/placeholder.svg';
  };

  // If no order data, redirect to home
  if (!orderId || items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy đơn hàng
          </h2>
          <p className="text-gray-600 mb-8">
            Không có thông tin đơn hàng để hiển thị
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home size={20} />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua sắm tại Fashion Collection
          </p>
        </div>

        {/* Order Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Thông tin đơn hàng
            </h2>
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              Đã xác nhận
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Mã đơn hàng</h3>
              <p className="text-gray-600 font-mono">{orderId}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Ngày đặt hàng</h3>
              <p className="text-gray-600">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Phương thức thanh toán</h3>
              <p className="text-gray-600">Thanh toán khi nhận hàng (COD)</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tổng tiền</h3>
              <p className="text-emerald-600 font-bold text-lg">
                {total.toLocaleString('vi-VN')}₫
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2" size={20} />
              Thông tin giao hàng
            </h2>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-gray-900">Người nhận</h3>
                <p className="text-gray-600">{customerInfo.name}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Phone className="mr-1" size={16} />
                  Số điện thoại
                </h3>
                <p className="text-gray-600">{customerInfo.phone}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 flex items-center">
                  <Mail className="mr-1" size={16} />
                  Email
                </h3>
                <p className="text-gray-600">{customerInfo.email}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900">Địa chỉ giao hàng</h3>
                <p className="text-gray-600">
                  {customerInfo.address}, {customerInfo.ward}, {customerInfo.district}, {customerInfo.city}
                </p>
              </div>
              
              {customerInfo.notes && (
                <div>
                  <h3 className="font-medium text-gray-900">Ghi chú</h3>
                  <p className="text-gray-600">{customerInfo.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Package className="mr-2" size={20} />
              Sản phẩm đã đặt
            </h2>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex-shrink-0">
                    <img
                      src={getProductImage(item.product)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.product.price.toLocaleString('vi-VN')}₫ x {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {(item.product.price * item.quantity).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tiến trình giao hàng
          </h2>
          
          <div className="relative">
            <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Đơn hàng đã được xác nhận</h3>
                  <p className="text-sm text-gray-600">Hôm nay</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Đang chuẩn bị hàng</h3>
                  <p className="text-sm text-gray-600">1-2 ngày làm việc</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Đang giao hàng</h3>
                  <p className="text-sm text-gray-600">2-3 ngày làm việc</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-gray-900">Giao hàng thành công</h3>
                  <p className="text-sm text-gray-600">3-5 ngày làm việc</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home size={20} />
            <span>Tiếp tục mua sắm</span>
          </Link>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors"
          >
            <Package size={20} />
            <span>In đơn hàng</span>
          </button>
        </div>

        {/* Contact Info */}
        <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            Có thắc mắc về đơn hàng? Liên hệ với chúng tôi:
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">1900 1234</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700">support@fashioncollection.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
