import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';
import { ProductInput } from '@/types/product';

interface ProductPreviewProps {
  formData: Partial<ProductInput>;
  generatedDescription?: string;
  isGenerating?: boolean;
}

const PreviewContainer = styled.div`
  background: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
`;

const PreviewTitle = styled.h3`
  font-size: ${theme.typography.fontSizes.lg};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

const ProductCard = styled.div`
  border: 1px solid ${theme.colors.gray[200]};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  background: white;
  transition: all ${theme.transitions.normal};
  &:hover { box-shadow: ${theme.shadows.lg}; transform: translateY(-2px); }
`;

const ProductImage = styled.div<{ hasImage: boolean }>`
  width: 100%; height: 200px;
  background-color: ${({ hasImage }) => (hasImage ? 'transparent' : theme.colors.gray[100])};
  display: flex; align-items: center; justify-content: center; position: relative;
  img { width: 100%; height: 100%; object-fit: cover; }
  ${({ hasImage }) => !hasImage && css`
    &::after { content: '📷'; font-size: ${theme.typography.fontSizes['3xl']}; color: ${theme.colors.gray[400]}; }
  `}
`;

const ProductInfo = styled.div` padding: ${theme.spacing.lg}; `;

const ProductTitle = styled.h4<{ isEmpty: boolean }>`
  font-size: ${theme.typography.fontSizes.lg};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.sm};
  line-height: ${theme.typography.lineHeights.tight};
  ${({ isEmpty }) => isEmpty && css` color: ${theme.colors.gray[400]}; font-style: italic; `}
`;

const ProductCategory = styled.span`
  display: inline-block;
  background-color: ${theme.colors.primary[100]};
  color: ${theme.colors.primary[700]};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  margin-bottom: ${theme.spacing.sm};
`;

const ProductPrice = styled.div<{ isEmpty: boolean }>`
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
  ${({ isEmpty }) => isEmpty && css` color: ${theme.colors.gray[400]}; font-style: italic; `}
`;

const ProductDescription = styled.div<{ $isEmpty: boolean; $isGenerating?: boolean }>`
  color: ${theme.colors.gray[700]};
  line-height: ${theme.typography.lineHeights.relaxed};
  font-size: ${theme.typography.fontSizes.sm};
  white-space: pre-wrap;
  ${({ $isEmpty, $isGenerating }) => {
    if ($isGenerating) return css` color: ${theme.colors.primary[600]}; font-style: italic; `;
    if ($isEmpty) return css` color: ${theme.colors.gray[400]}; font-style: italic; `;
    return '';
  }}
`;

const LoadingIndicator = styled.div`
  display: flex; align-items: center; gap: ${theme.spacing.sm};
  color: ${theme.colors.primary[600]}; font-style: italic;
  &::before {
    content: ''; width: 12px; height: 12px;
    border: 2px solid ${theme.colors.primary[300]}; border-top-color: ${theme.colors.primary[600]};
    border-radius: 50%; animation: spin 1s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export const ProductPreview: React.FC<ProductPreviewProps> = ({ formData, generatedDescription, isGenerating = false }) => {
  const hasTitle = !!formData.title?.trim();
  const hasPrice = typeof formData.price === 'number' && !isNaN(formData.price);
  const desc = generatedDescription?.trim() || '';
  const [objectUrl, setObjectUrl] = React.useState<string | undefined>(undefined);
  const hasImage = !!objectUrl;

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const file = formData.imageFile;
    if (!file) {
      setObjectUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.imageFile]);

  return (
    <PreviewContainer>
      <PreviewTitle>Product Preview</PreviewTitle>
      <ProductCard>
        <ProductImage hasImage={hasImage}>
          {hasImage ? (
            <img src={objectUrl} alt={formData.title || 'Product image'} aria-label="Product image preview" loading="lazy"
              decoding="async" />
          ) : null}
        </ProductImage>
        <ProductInfo>
          <ProductTitle isEmpty={!hasTitle}>{hasTitle ? formData.title : 'Product Title'}</ProductTitle>
          {formData.category && <ProductCategory>{formData.category}</ProductCategory>}
          <ProductPrice isEmpty={!hasPrice}>{hasPrice ? `$${(formData.price as number).toFixed(2)}` : 'Price'}</ProductPrice>
          <ProductDescription $isEmpty={!desc} $isGenerating={isGenerating}>
            {isGenerating ? <LoadingIndicator>Generating AI description...</LoadingIndicator> : (desc || 'Product description will appear here after AI generation')}
          </ProductDescription>
        </ProductInfo>
      </ProductCard>
    </PreviewContainer>
  );
};
