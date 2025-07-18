import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback mock admin data for development
const mockAdmin: User = {
  id: "1",
  email: "admin@fashioncollection.com",
  name: "Admin User",
  role: "admin",
};

const mockCredentials = {
  email: "admin@fashioncollection.com",
  password: "admin123",
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is authenticated via token
        if (authService.isAuthenticated()) {
          // Try to get current user from API
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            console.error("Failed to get current user:", error);
            // Fallback to saved user data
            const savedUser = localStorage.getItem("user");
            if (savedUser) {
              setUser(JSON.parse(savedUser));
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Try real API login first
      const authData = await authService.login({ email, password });
      setUser(authData.user);
      localStorage.setItem("user", JSON.stringify(authData.user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("API login failed, trying mock login:", error);

      // Fallback to mock login for development
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (
        email === mockCredentials.email &&
        password === mockCredentials.password
      ) {
        setUser(mockAdmin);
        localStorage.setItem("user", JSON.stringify(mockAdmin));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Try real API register
      const authData = await authService.register({ email, password, name });
      setUser(authData.user);
      localStorage.setItem("user", JSON.stringify(authData.user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("API registration failed:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
