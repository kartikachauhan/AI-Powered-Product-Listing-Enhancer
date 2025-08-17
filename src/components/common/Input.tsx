import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const getSizeStyles = (size: InputProps['size']) => {
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

export const Input = styled.input<InputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  background-color: white;
  border: 1px solid ${({ error }) => error ? theme.colors.error[300] : theme.colors.gray[300]};
  color: ${theme.colors.gray[900]};
  font-family: inherit;
  font-size: inherit;
  line-height: ${theme.typography.lineHeights.normal};
  transition: all ${theme.transitions.normal};
  
  ${({ size }) => getSizeStyles(size)}
  
  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ error }) => error ? theme.colors.error[400] : theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error[100]}40` : `${theme.colors.primary[100]}40`
    };
  }
  
  &:disabled {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ error }) => 
      error ? theme.colors.error[500] : theme.colors.primary[500]
    };
    outline-offset: 2px;
  }
`;

export const Select = styled.select<InputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  background-color: white;
  border: 1px solid ${({ error }) => error ? theme.colors.error[300] : theme.colors.gray[300]};
  color: ${theme.colors.gray[900]};
  font-family: inherit;
  font-size: inherit;
  line-height: ${theme.typography.lineHeights.normal};
  transition: all ${theme.transitions.normal};
  cursor: pointer;
  
  ${({ size }) => getSizeStyles(size)}
  
  &:hover:not(:disabled) {
    border-color: ${({ error }) => error ? theme.colors.error[400] : theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error[100]}40` : `${theme.colors.primary[100]}40`
    };
  }
  
  &:disabled {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ error }) => 
      error ? theme.colors.error[500] : theme.colors.primary[500]
    };
    outline-offset: 2px;
  }
`;

export const Textarea = styled.textarea<InputProps>`
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  min-height: 100px;
  resize: vertical;
  background-color: white;
  border: 1px solid ${({ error }) => error ? theme.colors.error[300] : theme.colors.gray[300]};
  color: ${theme.colors.gray[900]};
  font-family: inherit;
  font-size: inherit;
  line-height: ${theme.typography.lineHeights.normal};
  transition: all ${theme.transitions.normal};
  
  ${({ size }) => getSizeStyles(size)}
  
  &::placeholder {
    color: ${theme.colors.gray[400]};
  }
  
  &:hover:not(:disabled) {
    border-color: ${({ error }) => error ? theme.colors.error[400] : theme.colors.gray[400]};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ error }) => error ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ error }) => 
      error ? `${theme.colors.error[100]}40` : `${theme.colors.primary[100]}40`
    };
  }
  
  &:disabled {
    background-color: ${theme.colors.gray[100]};
    color: ${theme.colors.gray[500]};
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid ${({ error }) => 
      error ? theme.colors.error[500] : theme.colors.primary[500]
    };
    outline-offset: 2px;
  }
`;

// Form group wrapper
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

// Label component
export const Label = styled.label`
  font-size: ${theme.typography.fontSizes.sm};
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.gray[700]};
  line-height: ${theme.typography.lineHeights.tight};
`;

// Error message component
export const ErrorMessage = styled.span`
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.error[600]};
  line-height: ${theme.typography.lineHeights.tight};
  margin-top: ${theme.spacing.xs};
`;

// Success message component
export const SuccessMessage = styled.span`
  font-size: ${theme.typography.fontSizes.sm};
  color: ${theme.colors.success[600]};
  line-height: ${theme.typography.lineHeights.tight};
  margin-top: ${theme.spacing.xs};
`;
