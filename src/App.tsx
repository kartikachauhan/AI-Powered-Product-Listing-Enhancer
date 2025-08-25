import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { ProductForm } from '@/components/ProductForm/ProductForm';
import { ProductPreview } from '@/components/ProductPreview/ProductPreview';
import { ListingsView } from '@/components/ListingsView/ListingsView';
import { useProductStore, useError, useSuccess } from '@/store/productStore';
import { ProductCategory, ProductInput } from '@/types/product';
import { Toast } from '@/components/common/Toast';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.gray[50]};
  padding: ${theme.spacing.lg};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${theme.typography.fontSizes['4xl']};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${theme.typography.fontSizes.lg};
  color: ${theme.colors.gray[600]};
  max-width: 600px;
  margin: 0 auto;
  line-height: ${theme.typography.lineHeights.relaxed};
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
`;

const FormSection = styled.section`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const FormContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const App: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ProductInput>>({});
  const [generatedDescription, setGeneratedDescription] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const error = useError();
  const success = useSuccess();
  const { clearMessages, isGenerating: storeIsGenerating } = useProductStore();

  useEffect(() => {
    setIsGenerating(storeIsGenerating);
  }, [storeIsGenerating]);

  useEffect(() => {
    if (!error && !success) return;

    const timer = window.setTimeout(() => {
      clearMessages();
    }, 5000);
  
    return () => window.clearTimeout(timer);
  }, [error, success, clearMessages]);

  const handleFormDataChange = useCallback((newData: Partial<ProductInput>) => {
    setFormData(newData);
  }, []);

  const handleDescriptionGenerated = useCallback((description: string) => {
    setGeneratedDescription(description);
  }, []);

  const handleDescriptionChange = useCallback((description: string) => {
    setGeneratedDescription(description);
  }, []);

  const handleSaveListing = useCallback(async (description: string) => {
    if (!formData.title || !formData.category || !formData.price || !formData.imageFile) return;

    try {
      const productData: ProductInput = {
        title: formData.title,
        category: formData.category as ProductCategory,
        price: formData.price as number,
        imageFile: formData.imageFile as File
      };

      const { addProductWithDescription } = useProductStore.getState();
      await addProductWithDescription(productData, description);

      setFormData({});
      setGeneratedDescription('');
    } catch (e) {
      console.error('Failed to save product:', e);
    }
  }, [formData.title, formData.category, formData.price, formData.imageFile]);

  return (
    <AppContainer>
      <Header>
        <Title>AI-Powered Product Listing Enhancer</Title>
        <Subtitle>
          Create compelling product listings with AI-generated descriptions.
          Upload your product, get AI suggestions, and save professional listings in minutes.
        </Subtitle>
      </Header>

      <MainContent>
        <FormSection>
          <FormContainer>
            <ProductForm
              onFormDataChange={handleFormDataChange}
              onDescriptionGenerated={handleDescriptionGenerated}
              generatedDescription={generatedDescription}
              onDescriptionChange={handleDescriptionChange}
              onSave={() => handleSaveListing(generatedDescription)}
            />
          </FormContainer>

          <PreviewContainer>
            <ProductPreview
              formData={formData}
              generatedDescription={generatedDescription}
              isGenerating={isGenerating}
            />
          </PreviewContainer>
        </FormSection>

        <ListingsView />
      </MainContent>

      {error && (
        <Toast type="error" message={error} onClose={clearMessages} duration={5000} />
      )}
      {success && (
        <Toast type="success" message={success} onClose={clearMessages} duration={5000} offset={56} />
      )}
    </AppContainer>
  );
};
