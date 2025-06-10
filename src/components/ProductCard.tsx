
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-emerald-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-400">★</span>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews || 0})
              </span>
            </div>
          )}
        </div>
        
        <Link
          to={`/product/${product._id}`}
          className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200 font-medium"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
