import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "../ProtectedRoute";
import PageTransition from "./PageTransition";
import Navigation from "../Navigation";
import Footer from "../Footer";

// Import pages
import Index from "../../pages/Index";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import ForgotPasswordPage from "../../pages/ForgotPasswordPage";
import CartPage from "../../pages/CartPage";
import CheckoutPage from "../../pages/CheckoutPage";
import OrderConfirmationPage from "../../pages/OrderConfirmationPage";
import OrderHistoryPage from "../../pages/OrderHistoryPage";
import OrderDetailPage from "../../pages/OrderDetailPage";
import AdminPanel from "../../pages/AdminPanel";
import ProductForm from "../../pages/ProductForm";
import ProductDetail from "../../pages/ProductDetail";
import NotFound from "../../pages/NotFound";

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Navigation />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Index />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPasswordPage />
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <PageTransition>
                <CartPage />
              </PageTransition>
            }
          />
          <Route
            path="/checkout"
            element={
              <PageTransition>
                <CheckoutPage />
              </PageTransition>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <PageTransition>
                <OrderConfirmationPage />
              </PageTransition>
            }
          />
          <Route
            path="/order-history"
            element={
              <PageTransition>
                <OrderHistoryPage />
              </PageTransition>
            }
          />
          <Route
            path="/order-detail/:id"
            element={
              <PageTransition>
                <OrderDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PageTransition>
                <ProductDetail />
              </PageTransition>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <PageTransition>
                  <AdminPanel />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute requireAdmin={true}>
                <PageTransition>
                  <AdminPanel />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <ProtectedRoute requireAdmin={true}>
                <PageTransition>
                  <ProductForm />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <PageTransition>
                  <ProductForm />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFound />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default AnimatedRoutes;
