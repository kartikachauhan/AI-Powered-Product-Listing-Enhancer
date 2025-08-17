import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
}

const getVariantStyles = (variant: ButtonProps['variant']) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary[600]};
        color: white;
        border: 1px solid ${theme.colors.primary[600]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
          border-color: ${theme.colors.primary[700]};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: ${theme.shadows.sm};
        }
      `;
    
    case 'secondary':
      return css`
        background-color: white;
        color: ${theme.colors.gray[700]};
        border: 1px solid ${theme.colors.gray[300]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray[50]};
          border-color: ${theme.colors.gray[400]};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: ${theme.shadows.sm};
        }
      `;
    
    case 'danger':
      return css`
        background-color: ${theme.colors.error[600]};
        color: white;
        border: 1px solid ${theme.colors.error[600]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.error[700]};
          border-color: ${theme.colors.error[700]};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: ${theme.shadows.sm};
        }
      `;
    
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${theme.colors.gray[600]};
        border: 1px solid transparent;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        }
      `;
    
    default:
      return css`
        background-color: ${theme.colors.primary[600]};
        color: white;
        border: 1px solid ${theme.colors.primary[600]};
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primary[700]};
          border-color: ${theme.colors.primary[700]};
          transform: translateY(-1px);
          box-shadow: ${theme.shadows.md};
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: ${theme.shadows.sm};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonProps['size']) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing.sm} ${theme.spacing.md};
        font-size: ${theme.typography.fontSizes.sm};
        border-radius: ${theme.borderRadius.md};
      `;
    
    case 'lg':
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.xl};
        font-size: ${theme.typography.fontSizes.lg};
        border-radius: ${theme.borderRadius.lg};
      `;
    
    default: // md
      return css`
        padding: ${theme.spacing.md} ${theme.spacing.lg};
        font-size: ${theme.typography.fontSizes.base};
        border-radius: ${theme.borderRadius.md};
      `;
  }
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  line-height: ${theme.typography.lineHeights.tight};
  white-space: nowrap;
  cursor: pointer;
  transition: all ${theme.transitions.normal};
  position: relative;
  
  ${({ variant }) => getVariantStyles(variant)}
  ${({ size }) => getSizeStyles(size)}
  
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  ${({ disabled, isLoading }) => (disabled || isLoading) && css`
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  `}
  
  &:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

// Loading spinner component
const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Button content wrapper
const ButtonContent = styled.span<{ isLoading?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  
  ${({ isLoading }) => isLoading && css`
    opacity: 0;
  `}
`;

// Main button component with loading state
interface StyledButtonProps extends ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export const StyledButton: React.FC<StyledButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  ...props
}) => {
  return (
    <Button
      {...props}
      disabled={disabled || isLoading}
      isLoading={isLoading}
    >
      <ButtonContent isLoading={isLoading}>
        {children}
      </ButtonContent>
      {isLoading && <Spinner />}
    </Button>
  );
};
