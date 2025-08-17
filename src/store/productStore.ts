import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductInput, AIGenerationResponse } from '@/types/product';
import { generateDescription } from '@/api/productApi';

interface ProductState {
  products: Product[];
  selectedProductId: string | null;
  isGenerating: boolean;
  error: string | null;
  success: string | null;
}

interface ProductActions {
  addProduct: (productInput: ProductInput) => Promise<void>;
  addProductWithDescription: (productInput: ProductInput, description: string) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  selectProduct: (id: string | null) => void;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
  generateDescriptionForProduct: (productInput: ProductInput) => Promise<AIGenerationResponse>;
}

type ProductStore = ProductState & ProductActions;

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      selectedProductId: null,
      isGenerating: false,
      error: null,
      success: null,

      // Actions
      addProduct: async (productInput: ProductInput) => {
        try {
          set({ isGenerating: true, error: null, success: null });
          
          // Generate AI description
          const aiResponse = await get().generateDescriptionForProduct(productInput);
          
          // Convert File to data URL for storage
          const imageUrl = await fileToDataURL(productInput.imageFile);
          
          const newProduct: Product = {
            id: uuidv4(),
            title: productInput.title,
            category: productInput.category,
            price: productInput.price,
            imageUrl,
            description: aiResponse.description,
            meta: aiResponse.meta,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set((state) => ({
            products: [...state.products, newProduct],
            selectedProductId: newProduct.id,
            isGenerating: false,
            success: 'Product description generated successfully!'
          }));

          // Clear success message after 3 seconds
          setTimeout(() => {
            set({ success: null });
          }, 3000);
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to generate product description',
            isGenerating: false 
          });
        }
      },

      addProductWithDescription: async (productInput: ProductInput, description: string) => {
        try {
          set({ isGenerating: true, error: null, success: null });
          
          // Convert File to data URL for storage
          const imageUrl = await fileToDataURL(productInput.imageFile);
          
          const newProduct: Product = {
            id: uuidv4(),
            title: productInput.title,
            category: productInput.category,
            price: productInput.price,
            imageUrl,
            description,
            meta: {
              seoKeywords: [
                productInput.title.toLowerCase(),
                productInput.category.toLowerCase(),
                'premium quality',
                'best value',
                'top rated'
              ],
              language: 'en'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          set((state) => ({
            products: [...state.products, newProduct],
            selectedProductId: newProduct.id,
            isGenerating: false,
            success: 'Product listing saved successfully!'
          }));

          // Clear success message after 3 seconds
          setTimeout(() => {
            set({ success: null });
          }, 3000);
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to save product listing',
            isGenerating: false 
          });
        }
      },

      updateProduct: (id: string, updates: Partial<Product>) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updates, updatedAt: new Date().toISOString() }
              : product
          )
        }));
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          selectedProductId: state.selectedProductId === id ? null : state.selectedProductId,
          success: 'Product deleted successfully!'
        }));

        // Clear success message after 3 seconds
        setTimeout(() => {
          set({ success: null });
        }, 3000);
      },

      selectProduct: (id: string | null) => {
        set({ selectedProductId: id });
      },

      setGenerating: (generating: boolean) => {
        set({ isGenerating: generating });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setSuccess: (success: string | null) => {
        set({ success });
      },

      clearMessages: () => {
        set({ error: null, success: null });
      },

      generateDescriptionForProduct: async (productInput: ProductInput): Promise<AIGenerationResponse> => {
        try {
          const response = await generateDescription(productInput);
          return response;
        } catch (error) {
          throw new Error('Failed to generate AI description. Please try again.');
        }
      }
    }),
    {
      name: 'product-store',
      partialize: (state) => ({ 
        products: state.products,
        selectedProductId: state.selectedProductId 
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Product store rehydrated:', state);
      }
    }
  )
);

// Helper function to convert File to data URL
const fileToDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Selector hooks for performance optimization
export const useProducts = () => useProductStore((state) => state.products);
export const useSelectedProduct = () => {
  const { products, selectedProductId } = useProductStore();
  return products.find(p => p.id === selectedProductId) || null;
};
export const useIsGenerating = () => useProductStore((state) => state.isGenerating);
export const useError = () => useProductStore((state) => state.error);
export const useSuccess = () => useProductStore((state) => state.success);
export const useSelectedProductId = () => useProductStore((state) => state.selectedProductId);
