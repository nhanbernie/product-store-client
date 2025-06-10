
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Users, TrendingUp, DollarSign, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { productService } from '../services/productService';
import { Product } from '../types/product';

// Mock data for charts
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 4500 },
  { month: 'May', sales: 6000 },
  { month: 'Jun', sales: 5500 },
];

const ITEMS_PER_PAGE = 10;

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products from API
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts,
  });

  console.log('Dashboard - API products:', products);
  console.log('Dashboard - Loading state:', isLoading);
  console.log('Dashboard - Error state:', error);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: productService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Đã xóa sản phẩm",
        description: "Sản phẩm đã được xóa thành công.",
      });
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

  const categories = ['All', 'Áo thun', 'Quần', 'Váy', 'Áo khoác', 'Giày', 'Phụ kiện'];

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      deleteMutation.mutate(productId);
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Get current page products
  const currentProducts = filteredProducts.slice(0, currentPage * ITEMS_PER_PAGE);
  const hasMore = currentProducts.length < filteredProducts.length;

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const stats = [
    {
      title: 'Tổng sản phẩm',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Khách hàng',
      value: '1,234',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Doanh thu',
      value: '₫125M',
      icon: DollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Tăng trưởng',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Lỗi khi tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">Không thể kết nối đến server. Vui lòng thử lại.</p>
          <button
            onClick={() => refetch()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan về cửa hàng của bạn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu theo tháng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Đã thêm sản phẩm mới: Áo thun cotton</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Khách hàng mới đăng ký</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Cập nhật giá sản phẩm</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Xóa sản phẩm hết hàng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quản lý sản phẩm</h3>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Thêm sản phẩm
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'All' ? 'Tất cả' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {isLoading 
                ? 'Đang tải...' 
                : `Hiển thị ${currentProducts.length} / ${filteredProducts.length} sản phẩm`
              }
            </p>
          </div>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-20 h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left pb-3 text-sm font-medium text-gray-600">Sản phẩm</th>
                      <th className="text-left pb-3 text-sm font-medium text-gray-600">Danh mục</th>
                      <th className="text-left pb-3 text-sm font-medium text-gray-600">Giá</th>
                      <th className="text-left pb-3 text-sm font-medium text-gray-600">Đánh giá</th>
                      <th className="text-right pb-3 text-sm font-medium text-gray-600">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {currentProducts.map((product) => (
                      <tr key={product._id} className="border-b border-gray-50">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-sm text-gray-600 line-clamp-1">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                            {product.category}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="font-medium text-gray-900">
                            {product.price.toLocaleString('vi-VN')}₫
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-1">
                            <span className="text-yellow-400">★</span>
                            <span className="text-sm text-gray-600">
                              {product.rating || 0} ({product.reviews || 0})
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditProduct(product._id)}
                              className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Sửa sản phẩm"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id, product.name)}
                              disabled={deleteMutation.isPending}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Xóa sản phẩm"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {hasMore && (
                <div className="text-center mt-6">
                  <button
                    onClick={handleLoadMore}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Hiển thị thêm sản phẩm
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
