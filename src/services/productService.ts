import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product";
import { apiClient } from "./apiClient";

// API Response interfaces
interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  timestamp: string;
}

class ProductService {
  getProducts = async (): Promise<Product[]> => {
    const response = await apiClient.request<ApiResponse<Product[]>>(
      "/products"
    );
    return response.data;
  };

  getProductById = async (id: string): Promise<Product> => {
    const response = await apiClient.request<ApiResponse<Product[]>>(
      `/products/${id}`
    );
    // API trả về array, lấy phần tử đầu tiên
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error("Product not found");
  };

  createProduct = async (
    productData: CreateProductRequest
  ): Promise<Product> => {
    const response = await apiClient.request<ApiResponse<Product>>(
      "/products",
      {
        method: "POST",
        body: JSON.stringify(productData),
      }
    );
    return response.data;
  };

  updateProduct = async (
    id: string,
    productData: UpdateProductRequest
  ): Promise<Product> => {
    const response = await apiClient.request<ApiResponse<Product>>(
      `/products/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(productData),
      }
    );
    return response.data;
  };

  deleteProduct = async (id: string): Promise<void> => {
    await apiClient.request<ApiResponse<any>>(`/products/${id}`, {
      method: "DELETE",
    });
  };
}

export const productService = new ProductService();
