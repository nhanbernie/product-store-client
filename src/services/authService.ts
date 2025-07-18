import { apiClient } from "./apiClient";
import { getUserFromToken, isTokenExpired } from "../lib/jwt";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiAuthResponse {
  statusCode: number;
  data: AuthData[];
  message: string;
  timestamp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  statusCode: number;
  data: Array<{ resetId: string }>;
  message: string;
  timestamp: string;
}

export interface VerifyResetCodeRequest {
  resetId: string;
  resetCode: string;
}

export interface VerifyResetCodeResponse {
  statusCode: number;
  data: any[];
  message: string;
  timestamp: string;
}

export interface ResetPasswordRequest {
  resetId: string;
  resetCode: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  data: any[];
  message: string;
  timestamp: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthData> {
    try {
      const response = await apiClient.request<ApiAuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      // Extract auth data from response
      const authData = response.data[0];

      // Store tokens
      if (authData.accessToken && authData.refreshToken) {
        apiClient.setTokens(authData.accessToken, authData.refreshToken);
      }

      return authData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthData> {
    try {
      const response = await apiClient.request<ApiAuthResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
        }
      );

      // Extract auth data from response
      const authData = response.data[0];

      // Store tokens
      if (authData.accessToken && authData.refreshToken) {
        apiClient.setTokens(authData.accessToken, authData.refreshToken);
      }

      return authData;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const currentRefreshToken = apiClient.getRefreshToken();

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await apiClient.request<RefreshTokenResponse>(
        "/auth/refresh-token",
        {
          method: "POST",
          body: JSON.stringify({
            refreshToken: currentRefreshToken,
          }),
        }
      );

      // Update tokens based on your API response structure
      // Your API only returns refreshToken, so we use it as both access and refresh token
      if (response.refreshToken) {
        apiClient.setTokens(response.refreshToken, response.refreshToken);
      }

      return response;
    } catch (error) {
      console.error("Token refresh failed:", error);
      // Clear tokens and redirect to login
      this.logout();
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint with accessToken
      const accessToken = apiClient.getAccessToken();
      if (accessToken) {
        console.log("Calling logout API...");
        await apiClient.request("/auth/logout", {
          method: "POST",
        });
        console.log("Logout API call successful");
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear local tokens and all localStorage data
      apiClient.logout();
      this.clearAllLocalData();
    }
  }

  private clearAllLocalData(): void {
    // Clear all app-related data from localStorage
    const keysToRemove = [
      "user",
      "accessToken",
      "refreshToken",
      "fashionCollection_cart",
      "fashionCollection_orders",
      "fashionCollection_preferences",
    ];

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log("All local data cleared");
  }

  async getCurrentUser() {
    try {
      // First try to get user from API
      return await apiClient.request("/auth/me");
    } catch (error) {
      console.error("Get current user from API failed:", error);

      // Fallback: try to get user info from access token
      const accessToken = apiClient.getAccessToken();
      if (accessToken && !isTokenExpired(accessToken)) {
        const userFromToken = getUserFromToken(accessToken);
        if (userFromToken) {
          return userFromToken;
        }
      }

      throw error;
    }
  }

  async forgotPassword(email: string): Promise<string> {
    try {
      const response = await apiClient.request<ForgotPasswordResponse>(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );

      // Return resetId for next steps
      return response.data[0].resetId;
    } catch (error) {
      console.error("Forgot password failed:", error);
      throw error;
    }
  }

  async verifyResetCode(resetId: string, resetCode: string): Promise<boolean> {
    try {
      await apiClient.request<VerifyResetCodeResponse>(
        "/auth/verify-reset-code",
        {
          method: "POST",
          body: JSON.stringify({ resetId, resetCode }),
        }
      );

      return true;
    } catch (error) {
      console.error("Verify reset code failed:", error);
      throw error;
    }
  }

  async resetPassword(
    resetId: string,
    resetCode: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      await apiClient.request<ResetPasswordResponse>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ resetId, resetCode, newPassword }),
      });

      return true;
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  getAccessToken(): string | null {
    return apiClient.getAccessToken();
  }

  getRefreshToken(): string | null {
    return apiClient.getRefreshToken();
  }
}

export const authService = new AuthService();
