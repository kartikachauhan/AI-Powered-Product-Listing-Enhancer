import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: number;
  onClose?: () => void;
}

const slideInRight = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const ToastContainer = styled.div<Required<Pick<ToastProps, 'position'>> & { $type: ToastType; $offset: number }>`
  position: fixed;
  z-index: 1000;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.lg};
  color: white;
  font-weight: ${theme.typography.fontWeights.medium};
  box-shadow: ${theme.shadows.xl};
  max-width: 420px;
  animation: ${slideInRight} 0.25s ease-out both;

  ${({ position, $offset }) => {
    const base = `${theme.spacing.lg}`;
    switch (position) {
      case 'top-left': return `top: calc(${base} + ${$offset}px); left: ${base};`;
      case 'bottom-right': return `bottom: calc(${base} + ${$offset}px); right: ${base};`;
      case 'bottom-left': return `bottom: calc(${base} + ${$offset}px); left: ${base};`;
      case 'top-right':
      default: return `top: calc(${base} + ${$offset}px); right: ${base};`;
    }
  }}

  ${({ $type }) => {
    const bg = ($type === 'success') ? theme.colors.success?.[500]
             : ($type === 'error') ? theme.colors.error?.[500]
             : ($type === 'warning') ? (theme.colors.warning?.[500] || theme.colors.primary[600])
             : theme.colors.primary[600];
    return `background-color: ${bg};`;
  }}
`;

const MessageText = styled.p`
  margin: 0;
  line-height: ${theme.typography.lineHeights.tight};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.xs};
  right: ${theme.spacing.sm};
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: ${theme.typography.fontSizes.lg};
  line-height: 1;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  &:hover { background-color: rgba(255, 255, 255, 0.2); }
`;

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  position = 'top-right',
  offset = 0,
  onClose,
}) => {
  React.useEffect(() => {
    if (!duration) return;
    const t = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <ToastContainer role="status" aria-live="polite" position={position} $type={type} $offset={offset}>
      <MessageText>{message}</MessageText>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close message">×</CloseButton>
      )}
    </ToastContainer>
  );
};

export default Toast;