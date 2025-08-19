import React from 'react';
import styled from 'styled-components';
import { theme } from '@/styles/theme';
import { useProducts, useSelectedProductId, useProductStore } from '@/store/productStore';
import { StyledButton } from '@/components/common/Button';

const ListingsContainer = styled.div`
  background: white;
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.lg};
  width: 100%;
`;

const ListingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${theme.spacing.md};
    align-items: stretch;
  }
`;

const ListingsTitle = styled.h2`
  font-size: ${theme.typography.fontSizes['2xl']};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.gray[900]};
`;

const ProductCount = styled.span`
  color: ${theme.colors.gray[600]};
  font-size: ${theme.typography.fontSizes.sm};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${theme.spacing.lg};
  
  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div<{ $isSelected: boolean }>`
  border: 2px solid ${({ $isSelected }) => 
    $isSelected ? theme.colors.primary[500] : theme.colors.gray[200]
  };
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  background: white;
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  
  &:hover {
    border-color: ${({ $isSelected }) => 
      $isSelected ? theme.colors.primary[600] : theme.colors.gray[300]
    };
    box-shadow: ${theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${theme.colors.gray[100]};
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: ${theme.spacing.lg};
`;

const ProductTitle = styled.h3`
  font-size: ${theme.typography.fontSizes.lg};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.sm};
  line-height: ${theme.typography.lineHeights.tight};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const ProductPrice = styled.div`
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.gray[900]};
  margin-bottom: ${theme.spacing.md};
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${theme.spacing.md};
  padding-top: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.gray[200]};
`;

const CreatedDate = styled.span`
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.gray[500]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing['3xl']};
  color: ${theme.colors.gray[500]};
`;

const EmptyStateIcon = styled.div`
  font-size: ${theme.typography.fontSizes['4xl']};
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${theme.typography.fontSizes.xl};
  font-weight: ${theme.typography.fontWeights.semibold};
  color: ${theme.colors.gray[700]};
  margin-bottom: ${theme.spacing.sm};
`;

const EmptyStateText = styled.p`
  color: ${theme.colors.gray[600]};
  margin-bottom: ${theme.spacing.lg};
`;

const ProductDescription = styled.p`
  color: ${theme.colors.gray[700]};
  font-size: ${theme.typography.fontSizes.sm};
  line-height: ${theme.typography.lineHeights.relaxed};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0 0 ${theme.spacing.md};
`;

export const ListingsView: React.FC = () => {
  const products = useProducts();
  const selectedProductId = useSelectedProductId();
  const { selectProduct, deleteProduct } = useProductStore();

  const handleProductClick = (productId: string) => {
    selectProduct(productId);
  };

  const handleDeleteProduct = (e: React.MouseEvent<HTMLButtonElement>, productId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  if (products.length === 0) {
    return (
      <ListingsContainer>
        <ListingsHeader>
          <ListingsTitle>My Listings</ListingsTitle>
        </ListingsHeader>
        
        <EmptyState>
          <EmptyStateIcon>📦</EmptyStateIcon>
          <EmptyStateTitle>No products yet</EmptyStateTitle>
          <EmptyStateText>
            Start by creating your first product listing using the form above.
          </EmptyStateText>
        </EmptyState>
      </ListingsContainer>
    );
  }

  return (
    <ListingsContainer>
      <ListingsHeader>
        <div>
          <ListingsTitle>My Listings</ListingsTitle>
          <ProductCount>{products.length} product{products.length !== 1 ? 's' : ''}</ProductCount>
        </div>
      </ListingsHeader>
      
      <ProductsGrid>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            $isSelected={selectedProductId === product.id}
            onClick={() => handleProductClick(product.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleProductClick(product.id);
              }
            }}
            aria-label={`Select ${product.title}`}
          >
            <ProductImage>
              <img 
                src={product.imageUrl} 
                alt={product.title}
                aria-label={`${product.title} image`}
              />
            </ProductImage>
            
            <ProductInfo>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
              {product.description && (
                <ProductDescription>{product.description}</ProductDescription>
              )}
              
              <ProductMeta>
                <CreatedDate>
                  {new Date(product.createdAt).toLocaleDateString()}
                </CreatedDate>
                <ActionButtons>
                  <StyledButton
                    variant="danger"
                    size="sm"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteProduct(e, product.id)}
                    aria-label={`Delete ${product.title}`}
                  >
                    Delete
                  </StyledButton>
                </ActionButtons>
              </ProductMeta>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductsGrid>
    </ListingsContainer>
  );
};
