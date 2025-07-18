import React, { createContext, useContext, useState, useEffect } from "react";
import { authService, type User } from "../services/authService";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

            // Check if error is due to invalid/expired token
            if (
              error instanceof Error &&
              (error.message.includes("401") ||
                error.message.includes("403") ||
                error.message.includes("token"))
            ) {
              console.log("Token appears to be invalid, performing cleanup...");
              // Force logout to clear corrupted/expired tokens
              authService.forceLogout();
              setUser(null);
            } else {
              // Fallback to saved user data for other errors
              try {
                const savedUser = localStorage.getItem("user");
                if (savedUser) {
                  setUser(JSON.parse(savedUser));
                }
              } catch (parseError) {
                console.error("Failed to parse saved user data:", parseError);
                // Clear corrupted user data
                localStorage.removeItem("user");
              }
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        // If initialization completely fails, clear everything
        authService.forceLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const authData = await authService.login({ email, password });
      setUser(authData.user);
      localStorage.setItem("user", JSON.stringify(authData.user));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
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
      console.log("Starting logout process...");
      await authService.logout();
      console.log("Logout service completed");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout service fails, continue with local cleanup
    } finally {
      // Always clear user state regardless of API call success
      console.log("Clearing user state...");
      setUser(null);

      // Force reload to clear all app state and redirect to home
      console.log("Redirecting to home page...");
      window.location.href = "/";
    }
  };

  const isAdmin = (): boolean => {
    return user?.role === "admin";
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, isLoading, isAdmin }}
    >
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
