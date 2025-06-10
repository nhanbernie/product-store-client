
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating?: number;
  reviews?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  category?: string;
  rating?: number;
  reviews?: number;
}
