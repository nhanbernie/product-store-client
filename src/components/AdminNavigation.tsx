import React, { useState } from "react";
import {
  Search,
  User,
  Menu,
  X,
  Home,
  Package,
  Plus,
  LogOut,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Admin Panel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-emerald-600"
            >
              <Home size={18} />
              <span>Về trang chủ</span>
            </Link>
            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Package size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/admin/products/add"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/admin/products/add")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Plus size={18} />
              <span>Thêm sản phẩm</span>
            </Link>
          </div>

          {/* Search Bar and User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User size={16} className="text-gray-600" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="relative mb-3">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Về trang chủ</span>
              </Link>
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/admin")
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Package size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/admin/products/add"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/admin/products/add")
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus size={18} />
                <span>Thêm sản phẩm</span>
              </Link>

              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-gray-700">
                  <User size={16} />
                  <span className="text-sm">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                >
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavigation;
