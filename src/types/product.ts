import { z } from 'zod';

// Zod schema for form validation
export const ProductInputSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  category: z.string()
    .min(1, 'Category is required'),
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999.99, 'Price must be less than 1,000,000'),
  imageFile: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine((file) => file.type.startsWith('image/'), 'File must be an image')
});

// TypeScript types derived from Zod schemas
export type ProductInput = z.infer<typeof ProductInputSchema>;

// Extended product interface for saved products
export interface Product extends Omit<ProductInput, 'imageFile'> {
  id: string;
  imageUrl: string;
  description: string;
  meta: {
    seoKeywords: string[];
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

// AI generation response interface
export interface AIGenerationResponse {
  description: string;
  meta: {
    seoKeywords: string[];
    language: string;
  };
}

// Product categories for the select dropdown
export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Beauty & Health',
  'Toys & Games',
  'Automotive',
  'Food & Beverages',
  'Other'
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number];

// Form state interface
export interface ProductFormState {
  title: string;
  category: ProductCategory | '';
  price: number | '';
  imageFile: File | null;
  imagePreview: string | null;
}

// UI state interfaces
export interface UIState {
  isGenerating: boolean;
  error: string | null;
  success: string | null;
  selectedProductId: string | null;
}
