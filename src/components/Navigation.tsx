import React, { useState } from "react";
import { Search, User, Menu, X, Home, LogIn, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="p-2 text-gray-600 hover:text-emerald-600 transition-colors rounded-lg hover:bg-gray-100"
              >
                <User size={20} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm text-gray-600">Xin chào,</p>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                      </div>
                      <button
                        onClick={handleAdminPanel}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>Quản trị</span>
                      </button>
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
                </div>
              )}
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
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/")
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>Trang chủ</span>
              </Link>

              <div className="border-t border-gray-200 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-gray-700">
                      <p className="text-sm text-gray-600">Xin chào,</p>
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>
                    <button
                      onClick={handleAdminPanel}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full"
                    >
                      <User size={18} />
                      <span>Quản trị</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
                    >
                      <LogOut size={18} />
                      <span>Đăng xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full"
                    >
                      <LogIn size={18} />
                      <span>Đăng nhập</span>
                    </button>
                    <Link
                      to="/register"
                      className="flex items-center space-x-2 px-3 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      <span>Đăng ký</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
