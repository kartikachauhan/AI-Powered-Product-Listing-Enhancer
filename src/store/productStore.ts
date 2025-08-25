import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Product, ProductInput, AIGenerationResponse } from '@/types/product';
import { generateDescription } from '@/api/productApi';

const memoryFallback = new Map<string, string>();

const resilientStorage = createJSONStorage(() => ({
  getItem: (name: string) => {
    try {
      return localStorage.getItem(name);
    } catch {
      return memoryFallback.get(name) ?? null;
    }
  },
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
    } catch (e) {
      console.warn('[persist] falling back to memory:', e);
      memoryFallback.set(name, value);
    }
  },
  removeItem: (name: string) => {
    try {
      localStorage.removeItem(name);
    } catch {
      memoryFallback.delete(name);
    }
  },
}));

const resizeToDataURL = async (
  file: File,
  maxDim = 1024,
  quality = 0.7
): Promise<string> => {
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = URL.createObjectURL(file);
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);

  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  URL.revokeObjectURL(img.src);
  return dataUrl;
};

const MAX_ITEMS = 50;

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
      products: [],
      selectedProductId: null,
      isGenerating: false,
      error: null,
      success: null,

      addProduct: async (productInput: ProductInput) => {
        try {
          set({ isGenerating: true, error: null, success: null });

          const aiResponse = await get().generateDescriptionForProduct(productInput);

          const imageUrl = await resizeToDataURL(productInput.imageFile);

          const newProduct: Product = {
            id: uuidv4(),
            title: productInput.title,
            category: productInput.category,
            price: productInput.price,
            imageUrl,
            description: aiResponse.description,
            meta: aiResponse.meta,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            products: [...state.products, newProduct].slice(-MAX_ITEMS),
            selectedProductId: newProduct.id,
            isGenerating: false,
            success: 'Product description generated successfully!',
          }));

          setTimeout(() => {
            set({ success: null });
          }, 3000);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to generate product description',
            isGenerating: false,
          });
        }
      },

      addProductWithDescription: async (productInput: ProductInput, description: string) => {
        try {
          set({ isGenerating: true, error: null, success: null });

          const imageUrl = await resizeToDataURL(productInput.imageFile);

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
                'top rated',
              ],
              language: 'en',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            products: [...state.products, newProduct].slice(-MAX_ITEMS),
            selectedProductId: newProduct.id,
            isGenerating: false,
            success: 'Product listing saved successfully!',
          }));

          setTimeout(() => {
            set({ success: null });
          }, 3000);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to save product listing',
            isGenerating: false,
          });
        }
      },

      updateProduct: (id: string, updates: Partial<Product>) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id
              ? { ...product, ...updates, updatedAt: new Date().toISOString() }
              : product
          ),
        }));
      },

      deleteProduct: (id: string) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          selectedProductId: state.selectedProductId === id ? null : state.selectedProductId,
          success: 'Product deleted successfully!',
        }));

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
        } catch {
          throw new Error('Failed to generate AI description. Please try again.');
        }
      },
    }),
    {
      name: 'product-store',
      partialize: (state) => ({
        products: state.products,
        selectedProductId: state.selectedProductId,
      }),
      storage: resilientStorage,
      onRehydrateStorage: () => (state) => {
        console.log('Product store rehydrated:', state);
      },
    }
  )
);

export const useProducts = () => useProductStore((state) => state.products);
export const useSelectedProduct = () =>
  useProductStore(s => s.products.find(p => p.id === s.selectedProductId) ?? null);
export const useIsGenerating = () => useProductStore((state) => state.isGenerating);
export const useError = () => useProductStore((state) => state.error);
export const useSuccess = () => useProductStore((state) => state.success);
export const useSelectedProductId = () => useProductStore((state) => state.selectedProductId);