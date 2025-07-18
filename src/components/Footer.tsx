import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Heart,
  ShoppingBag
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    initial: { opacity: 0, y: 50 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      variants={footerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      className="bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-emerald-500" />
              <span className="text-2xl font-bold">Fashion Collection</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Khám phá bộ sưu tập thời trang cao cấp với phong cách hiện đại và chất lượng tuyệt vời. 
              Mang đến cho bạn những trải nghiệm mua sắm tuyệt vời nhất.
            </p>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Facebook size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors"
              >
                <Twitter size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Giỏ hàng
                </Link>
              </li>
              <li>
                <Link to="/order-history" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Lịch sử đơn hàng
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-emerald-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-emerald-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  +84 3756 13 793
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-emerald-500 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  ttnhanbernie@gmail.com
                </span>
              </div>
            </div>
            
            {/* Admin Demo Info */}
            <div className="mt-6 p-3 bg-gray-800 rounded-lg">
              <h4 className="text-sm font-medium text-emerald-400 mb-2">Demo Admin Account:</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Email: ttnhanbernie@gmail.com</div>
                <div>Password: Bernie123</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={itemVariants}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Fashion Collection. All rights reserved.
          </div>
          <div className="flex items-center space-x-1 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart size={14} className="text-red-500" />
            <span>by Nhan Bernie </span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
