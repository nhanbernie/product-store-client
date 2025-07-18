import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import Hero from "../components/Hero";
import FilterBar from "../components/FilterBar";
import ProductCard from "../components/ProductCard";
import { productService } from "../services/productService";
import { Product } from "../types/product";

const ITEMS_PER_PAGE = 8;

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products from API
  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: productService.getProducts,
  });

  console.log("Homepage - API products:", products);
  console.log("Homepage - Loading state:", isLoading);
  console.log("Homepage - Error state:", error);

  // Filter products based on search query, category, and price range
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      // Price filter
      let matchesPrice = true;
      if (priceRange !== "All") {
        switch (priceRange) {
          case "0-500k":
            matchesPrice = product.price <= 500000;
            break;
          case "500k-1tr":
            matchesPrice = product.price > 500000 && product.price <= 1000000;
            break;
          case "1tr-2tr":
            matchesPrice = product.price > 1000000 && product.price <= 2000000;
            break;
          case "2tr+":
            matchesPrice = product.price > 2000000;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchQuery, selectedCategory, priceRange]);

  // Get current page products
  const currentProducts = filteredProducts.slice(
    0,
    currentPage * ITEMS_PER_PAGE
  );
  const hasMore = currentProducts.length < filteredProducts.length;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, priceRange]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Lỗi khi tải dữ liệu
            </h2>
            <p className="text-gray-600 mb-4">
              Không thể kết nối đến server. Vui lòng thử lại.
            </p>
            <button
              onClick={() => refetch()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Sản phẩm nổi bật
            </h2>
            <p className="text-gray-600 mt-1">
              {isLoading
                ? "Đang tải..."
                : `Hiển thị ${currentProducts.length} / ${filteredProducts.length} sản phẩm`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Hiển thị thêm sản phẩm
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Homepage;
