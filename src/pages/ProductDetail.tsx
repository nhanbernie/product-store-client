
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Edit, Trash2, User } from 'lucide-react';
import Navigation from '../components/Navigation';
import AdminNavigation from '../components/AdminNavigation';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/productService';
import { useToast } from "@/hooks/use-toast";

const mockReviews = [
  {
    id: 1,
    user: 'Sarah M.',
    rating: 5,
    comment: 'Yêu thích chiếc áo thun này! Rất thoải mái và chất lượng tuyệt vời.',
    date: '2024-01-15'
  },
  {
    id: 2,
    user: 'Mike D.',
    rating: 4,
    comment: 'Form dáng đẹp và chất liệu tốt. Hoàn hảo để mặc thường ngày.',
    date: '2024-01-10'
  },
  {
    id: 3,
    user: 'Emma L.',
    rating: 5,
    comment: 'Đúng như mô tả. Chắc chắn sẽ mua thêm nhiều màu khác!',
    date: '2024-01-08'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fetch product data from API
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa thành công.",
      });
      navigate('/admin');
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  const handleDelete = () => {
    if (product && window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      deleteMutation.mutate(product._id);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/products/edit/${id}`);
  };

  const isAdmin = user?.role === 'admin';
  const NavigationComponent = isAdmin ? AdminNavigation : Navigation;
  const backUrl = isAdmin ? '/admin' : '/';
  const backText = isAdmin ? 'Quay lại Admin' : 'Quay lại Trang chủ';

  // Mock multiple images (sử dụng cùng một hình ảnh cho demo)
  const mockImages = product ? [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ] : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationComponent />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="bg-gray-200 h-96 lg:h-[500px] rounded-xl mb-4"></div>
              <div className="flex space-x-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationComponent />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            to={backUrl}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>{backText}</span>
          </Link>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Không tìm thấy sản phẩm</h2>
            <p className="text-gray-600">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationComponent />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link 
          to={backUrl}
          className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>{backText}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="relative">
              <img
                src={mockImages[currentImageIndex]}
                alt={product.name}
                className={`w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg cursor-zoom-in transition-transform duration-300 ${
                  isZoomed ? 'scale-110' : ''
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              />
            </div>
            
            <div className="flex space-x-4 mt-4">
              {mockImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index ? 'border-emerald-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold text-emerald-600">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
              <div className="flex items-center space-x-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating || 0) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">
                  ({product.reviews || 0} đánh giá)
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            <div className="mb-8">
              <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                {product.category}
              </span>
            </div>

            {isAdmin && (
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <Edit size={18} />
                  <span>Sửa sản phẩm</span>
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  <Trash2 size={18} />
                  <span>{deleteMutation.isPending ? 'Đang xóa...' : 'Xóa sản phẩm'}</span>
                </button>
              </div>
            )}

            {!isAdmin && (
              <div className="flex space-x-4 mb-8">
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
                  Thêm vào giỏ hàng
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors">
                  Yêu thích
                </button>
              </div>
            )}

            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Đánh giá từ khách hàng
              </h3>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User size={18} className="text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900">
                            {review.user}
                          </span>
                          <div className="flex text-yellow-400 text-sm">
                            {[...Array(5)].map((_, i) => (
                              <span key={i}>
                                {i < review.rating ? '★' : '☆'}
                              </span>
                            ))}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {review.date}
                          </span>
                        </div>
                        <p className="text-gray-700">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
