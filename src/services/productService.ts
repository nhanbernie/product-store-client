import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product";

const API_BASE_URL = process.env.VITE_API_BASE_URL;

class ProductService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making API request to: ${url}`, config);

    const response = await fetch(url, config);

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
  }

  getProducts = async (): Promise<Product[]> => {
    return this.request<Product[]>("/products");
  };

  getProductById = async (id: string): Promise<Product> => {
    return this.request<Product>(`/products/${id}`);
  };

  createProduct = async (
    productData: CreateProductRequest
  ): Promise<Product> => {
    return this.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  };

  updateProduct = async (
    id: string,
    productData: UpdateProductRequest
  ): Promise<Product> => {
    return this.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  };

  deleteProduct = async (id: string): Promise<void> => {
    await this.request(`/products/${id}`, {
      method: "DELETE",
    });
  };
}

export const productService = new ProductService();
