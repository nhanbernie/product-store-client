import { isTokenExpired } from "../lib/jwt";

interface TokenResponse {
  refreshToken: string;
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || "";
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage() {
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  private saveTokensToStorage(accessToken?: string, refreshToken?: string) {
    if (accessToken) {
      this.accessToken = accessToken;
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      this.refreshToken = refreshToken;
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data: TokenResponse = await response.json();

      // Based on your API response structure, it returns refreshToken
      // We'll use this as the new access token
      const newAccessToken = data.refreshToken;

      this.saveTokensToStorage(newAccessToken, data.refreshToken);
      return newAccessToken;
    } catch (error) {
      this.clearTokens();
      // Redirect to login page
      window.location.href = "/login";
      throw error;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Check if access token is expired before making request
    if (
      this.accessToken &&
      isTokenExpired(this.accessToken) &&
      this.refreshToken
    ) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token before request:", error);
        // Continue with the request, let it fail and handle 401
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add access token to headers if available
    if (this.accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
    }

    console.log(`Making API request to: ${url}`, config);

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized - token expired
      if (response.status === 401 && this.refreshToken) {
        if (this.isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          }).then(() => {
            // Retry the original request with new token
            return this.request<T>(endpoint, options);
          });
        }

        this.isRefreshing = true;

        try {
          const newAccessToken = await this.refreshAccessToken();
          this.processQueue(null, newAccessToken);

          // Retry the original request with new token
          const newConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };

          const retryResponse = await fetch(url, newConfig);

          if (!retryResponse.ok) {
            const errorText = await retryResponse.text();
            throw new Error(
              `HTTP ${retryResponse.status}: ${
                errorText || retryResponse.statusText
              }`
            );
          }

          const data = await retryResponse.json();
          console.log(`API Response from ${url}:`, data);
          return data;
        } catch (refreshError) {
          this.processQueue(refreshError, null);
          throw refreshError;
        } finally {
          this.isRefreshing = false;
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error: ${response.status} - ${errorText}`);
        throw new Error(
          `HTTP ${response.status}: ${errorText || response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`API Response from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`API Request failed for ${url}:`, error);
      throw error;
    }
  }

  // Auth methods
  setTokens(accessToken: string, refreshToken: string) {
    this.saveTokensToStorage(accessToken, refreshToken);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  logout() {
    this.clearTokens();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

export const apiClient = new ApiClient();
