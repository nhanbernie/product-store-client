import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";
import {
  cardHover,
  heartVariants,
  buttonHover,
  getReducedMotionVariants,
} from "../utils/animations";
import AnimatedButton from "./animations/AnimatedButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load favorite status from localStorage
  React.useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem("fashionCollection_favorites") || "[]"
    );
    setIsFavorite(favorites.includes(product._id));
  }, [product._id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    setIsAddingToCart(true);
    try {
      addToCart(product, 1); // Always add 1 item
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = JSON.parse(
      localStorage.getItem("fashionCollection_favorites") || "[]"
    );
    let updatedFavorites;

    if (isFavorite) {
      // Remove from favorites
      updatedFavorites = favorites.filter((id: string) => id !== product._id);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, product._id];
    }

    localStorage.setItem(
      "fashionCollection_favorites",
      JSON.stringify(updatedFavorites)
    );
    setIsFavorite(!isFavorite);
  };

  const cardVariants = getReducedMotionVariants(cardHover);
  const heartAnimationVariants = getReducedMotionVariants(heartVariants);

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      className="bg-white rounded-xl shadow-sm overflow-hidden group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <motion.div
          className="absolute inset-0 bg-black/0"
          whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.3 }}
        />

        {/* Favorite Heart Button */}
        <motion.button
          onClick={handleToggleFavorite}
          variants={heartAnimationVariants}
          initial="initial"
          whileHover="hover"
          whileTap="animate"
          className={`absolute top-2 right-2 p-2 rounded-full transition-colors duration-200 ${
            isFavorite
              ? "bg-red-500 text-white shadow-lg"
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart size={18} className={isFavorite ? "fill-current" : ""} />
        </motion.button>
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
            {product.price.toLocaleString("vi-VN")}₫
          </span>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">
              {product.rating || 0} ({product.reviews || 0})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Add to Cart Button */}
          <AnimatedButton
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            loading={isAddingToCart}
            variant="primary"
            className="w-full"
          >
            {!isAddingToCart && <ShoppingCart size={16} className="mr-2" />}
            <span>Thêm vào giỏ</span>
          </AnimatedButton>

          {/* View Details Link */}
          <Link
            to={`/product/${product._id}`}
            className="block w-full text-center py-2 px-4 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors duration-200 font-medium"
          >
            <motion.span
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block"
            >
              Xem chi tiết
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
