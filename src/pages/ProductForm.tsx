
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, X } from 'lucide-react';
import AdminNavigation from '../components/AdminNavigation';
import { ProductFormData } from '../types/product';
import { productService } from '../services/productService';
import { useToast } from "@/hooks/use-toast";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: 'Áo Thun'
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');

  const categories = ['Áo Thun', 'Quần Jeans', 'Váy', 'Áo Khoác', 'Giày', 'Phụ kiện'];

  // Fetch product for editing
  const { data: product, isLoading: isLoadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: isEditing && !!id,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được tạo thành công.",
      });
      navigate('/admin');
    },
    onError: (error) => {
      console.error('Create error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) => 
      productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      toast({
        title: "Thành công",
        description: "Sản phẩm đã được cập nhật thành công.",
      });
      navigate('/admin');
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật sản phẩm. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  });

  // Fill form data when editing
  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews,
      });
      setImagePreview(product.imageUrl);
    }
  }, [product, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));

    if (name === 'imageUrl') {
      setImagePreview(value);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({
          ...prev,
          imageUrl: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && id) {
      updateMutation.mutate({ id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditing && isLoadingProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">Đang tải dữ liệu sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Quay lại</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Nhập tên sản phẩm"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (₫) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="1000"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="0"
                />
              </div>

              {/* Image Upload Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh sản phẩm *
                </label>
                <div className="flex space-x-4 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      uploadMethod === 'url' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    URL hình ảnh
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      uploadMethod === 'file' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Tải lên từ thiết bị
                  </button>
                </div>

                {uploadMethod === 'url' ? (
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors">
                    <input
                      type="file"
                      id="fileUpload"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="fileUpload" className="cursor-pointer">
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-emerald-600 hover:text-emerald-500">
                          Nhấp để tải lên
                        </span>{' '}
                        hoặc kéo thả hình ảnh vào đây
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF tối đa 10MB</p>
                    </label>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                  placeholder="Nhập mô tả sản phẩm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-6 rounded-lg transition-colors font-medium"
                >
                  {isSubmitting ? 'Đang lưu...' : (isEditing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg transition-colors font-medium"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Xem trước</h3>
              {imagePreview && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Xóa hình ảnh"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Xem trước sản phẩm"
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=URL+h%C3%ACnh+%E1%BA%A3nh+kh%C3%B4ng+h%E1%BB%A3p+l%E1%BB%87';
                    }}
                  />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">
                      {formData.name || 'Tên sản phẩm'}
                    </h4>
                    <p className="text-emerald-600 font-bold">
                      {formData.price.toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-gray-600 text-sm">
                      {formData.description || 'Mô tả sản phẩm sẽ hiển thị ở đây...'}
                    </p>
                    <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs">
                      {formData.category}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <p className="text-gray-500">Thêm hình ảnh để xem trước</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
