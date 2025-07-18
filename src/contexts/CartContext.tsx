import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartSummary, CartContextType } from "../types/cart";
import { Product } from "../types/product";
import { useToast } from "@/hooks/use-toast";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("fashionCollection_cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("fashionCollection_cart", JSON.stringify(items));
  }, [items]);

  // Calculate cart summary
  const summary: CartSummary = React.useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const selectedItems = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const selectedPrice = items
      .filter((item) => item.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return {
      totalItems,
      selectedItems,
      totalPrice,
      selectedPrice,
    };
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1) => {
    // Basic stock check (since we don't have stock field in current Product interface)
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        // Update existing item quantity
        const newQuantity = existingItem.quantity + quantity;
        const updatedItems = prevItems.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );

        toast({
          title: "Đã cập nhật giỏ hàng",
          description: `${product.name} - Số lượng: ${newQuantity}`,
        });

        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: `${product._id}_${Date.now()}`,
          product,
          quantity,
          selected: true,
          addedAt: new Date().toISOString(),
        };

        toast({
          title: "Đã thêm vào giỏ hàng",
          description: `${product.name} - Số lượng: ${quantity}`,
        });

        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((item) => item.id === itemId);
      const updatedItems = prevItems.filter((item) => item.id !== itemId);

      if (item) {
        toast({
          title: "Đã xóa khỏi giỏ hàng",
          description: item.product.name,
        });
      }

      return updatedItems;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) => {
      return prevItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const toggleItemSelection = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectAllItems = () => {
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, selected: true }))
    );
  };

  const deselectAllItems = () => {
    setItems((prevItems) =>
      prevItems.map((item) => ({ ...item, selected: false }))
    );
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Đã xóa giỏ hàng",
      description: "Tất cả sản phẩm đã được xóa khỏi giỏ hàng.",
    });
  };

  const removeSelectedItems = () => {
    setItems((prevItems) => prevItems.filter((item) => !item.selected));
  };

  const getSelectedItems = (): CartItem[] => {
    return items.filter((item) => item.selected);
  };

  const isInCart = (productId: string): boolean => {
    return items.some((item) => item.product._id === productId);
  };

  const getCartItemQuantity = (productId: string): number => {
    const item = items.find((item) => item.product._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemSelection,
        selectAllItems,
        deselectAllItems,
        clearCart,
        removeSelectedItems,
        getSelectedItems,
        isInCart,
        getCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
