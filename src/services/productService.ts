import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
} from "../types/product";
import { apiClient } from "./apiClient";

class ProductService {
  getProducts = async (): Promise<Product[]> => {
    return apiClient.request<Product[]>("/products");
  };

  getProductById = async (id: string): Promise<Product> => {
    return apiClient.request<Product>(`/products/${id}`);
  };

  createProduct = async (
    productData: CreateProductRequest
  ): Promise<Product> => {
    return apiClient.request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  };

  updateProduct = async (
    id: string,
    productData: UpdateProductRequest
  ): Promise<Product> => {
    return apiClient.request<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  };

  deleteProduct = async (id: string): Promise<void> => {
    await apiClient.request(`/products/${id}`, {
      method: "DELETE",
    });
  };
}

export const productService = new ProductService();
