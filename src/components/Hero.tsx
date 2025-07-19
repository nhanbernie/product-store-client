import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import AnimatedButton from "./animations/AnimatedButton";
import {
  staggerContainer,
  staggerItem,
  getReducedMotionVariants,
} from "../utils/animations";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const containerVariants = getReducedMotionVariants(staggerContainer);
  const itemVariants = getReducedMotionVariants(staggerItem);

  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="relative z-10 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            Latest Fashion
            <span className="block text-emerald-600">Collection</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Discover our curated selection of premium clothing that combines
            style, comfort, and affordability for the modern wardrobe.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <AnimatedButton
              as={Link}
              to="#products"
              variant="primary"
              size="lg"
              className="shadow-lg hover:shadow-xl"
            >
              Shop Now
            </AnimatedButton>
            {isAdmin() && (
              <AnimatedButton
                onClick={() => navigate("/admin")}
                as={Link}
                to="/admin"
                variant="secondary"
                size="lg"
                className="border-2 border-emerald-600"
              >
                Admin Panel
              </AnimatedButton>
            )}
          </motion.div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full animate-pulse"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-20 right-10 w-32 h-32 bg-teal-200 rounded-full animate-pulse"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ delay: 0.75, duration: 1 }}
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-200 rounded-full animate-pulse"
        />
      </div>
    </div>
  );
};

export default Hero;
