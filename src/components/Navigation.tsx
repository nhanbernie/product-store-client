import React, { useState } from "react";
import {
  Search,
  User,
  Menu,
  X,
  Home,
  LogIn,
  LogOut,
  ShoppingCart,
  Package,
  UserPlus,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import {
  mobileMenuVariants,
  dropdownVariants,
  cartBadgeVariants,
  buttonHover,
  getReducedMotionVariants,
} from "../utils/animations";
import NumberCounter from "./animations/NumberCounter";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { summary } = useCart();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogin = () => {
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleAdminPanel = () => {
    navigate("/admin");
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FC</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Fashion Collection
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              <Home size={18} />
              <span>Trang chủ</span>
            </Link>
          </div>

          {/* Search Bar, Cart, and User Menu */}
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

            {/* Cart Icon */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-100 inline-flex items-center justify-center"
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {summary.totalItems > 0 && (
                    <motion.span
                      key={summary.totalItems}
                      variants={getReducedMotionVariants(cartBadgeVariants)}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium px-1 z-10"
                    >
                      <NumberCounter
                        value={summary.totalItems}
                        format={(val) => (val > 99 ? "99+" : val.toString())}
                      />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="p-2 text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <User size={20} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    variants={getReducedMotionVariants(dropdownVariants)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm text-gray-600">Xin chào,</p>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          {isAdmin() && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Quản trị viên
                            </p>
                          )}
                        </div>
                        <Link
                          to="/order-history"
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package size={16} />
                          <span>Lịch sử đơn hàng</span>
                        </Link>
                        {isAdmin() && (
                          <button
                            onClick={handleAdminPanel}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <User size={16} />
                            <span>Quản trị</span>
                          </button>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Đăng xuất</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleLogin}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <LogIn size={16} />
                          <span>Đăng nhập</span>
                        </button>
                        <Link
                          to="/register"
                          className="w-full text-left px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 flex items-center space-x-2"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} />
                          <span>Đăng ký</span>
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={getReducedMotionVariants(mobileMenuVariants)}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden border-t border-gray-100 bg-white shadow-lg"
            >
              <div className="px-4 pt-4 pb-6 space-y-3 max-h-screen overflow-y-auto">
                {/* Search Bar */}
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
                  />
                </div>
                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link
                    to="/"
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive("/")
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} />
                    <span className="font-medium">Trang chủ</span>
                  </Link>

                  {/* Mobile Cart Link */}
                  <Link
                    to="/cart"
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <ShoppingCart size={20} />
                      <span className="font-medium">Giỏ hàng</span>
                    </div>
                    <AnimatePresence>
                      {summary.totalItems > 0 && (
                        <motion.span
                          key={summary.totalItems}
                          variants={getReducedMotionVariants(cartBadgeVariants)}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="bg-emerald-600 text-white text-xs rounded-full min-w-[24px] h-6 flex items-center justify-center font-medium px-2"
                        >
                          <NumberCounter
                            value={summary.totalItems}
                            format={(val) =>
                              val > 99 ? "99+" : val.toString()
                            }
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </div>

                {/* User Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-3 bg-gray-50 rounded-xl">
                        <p className="text-sm text-gray-600">Xin chào,</p>
                        <p className="text-base font-semibold text-gray-900">
                          {user.name}
                        </p>
                        {isAdmin() && (
                          <p className="text-xs text-emerald-600 mt-1 font-medium">
                            Quản trị viên
                          </p>
                        )}
                      </div>
                      <Link
                        to="/order-history"
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Package size={20} />
                        <span className="font-medium">Lịch sử đơn hàng</span>
                      </Link>
                      {isAdmin() && (
                        <button
                          onClick={handleAdminPanel}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors w-full"
                        >
                          <User size={20} />
                          <span className="font-medium">Quản trị</span>
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full"
                      >
                        <LogOut size={20} />
                        <span className="font-medium">Đăng xuất</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={handleLogin}
                        className="flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors w-full font-medium"
                      >
                        <LogIn size={20} />
                        <span>Đăng nhập</span>
                      </button>
                      <Link
                        to="/register"
                        className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors w-full font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserPlus size={20} />
                        <span>Đăng ký</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Overlay for mobile user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navigation;
