
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Latest Fashion
            <span className="block text-emerald-600">Collection</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our curated selection of premium clothing that combines style, 
            comfort, and affordability for the modern wardrobe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="#products"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Shop Now
            </Link>
            <Link
              to="/admin"
              className="bg-white hover:bg-gray-50 text-emerald-600 px-8 py-3 rounded-lg font-semibold border-2 border-emerald-600 transition-colors duration-200"
            >
              Admin Panel
            </Link>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default Hero;
