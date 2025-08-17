import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 16px;
    line-height: ${theme.typography.lineHeights.normal};
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${theme.colors.gray[50]};
    color: ${theme.colors.gray[900]};
    line-height: ${theme.typography.lineHeights.normal};
  }

  // Reset form elements
  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }

  input, select, textarea {
    border: none;
    outline: none;
    background: none;
  }

  // Image handling
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  // Link styling
  a {
    color: inherit;
    text-decoration: none;
  }

  // List styling
  ul, ol {
    list-style: none;
  }

  // Focus styles for accessibility
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  a:focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${theme.borderRadius.sm};
  }

  // Remove focus outline for mouse users
  button:focus:not(:focus-visible),
  input:focus:not(:focus-visible),
  select:focus:not(:focus-visible),
  textarea:focus:not(:focus-visible),
  a:focus:not(:focus-visible) {
    outline: none;
  }

  // Smooth transitions for interactive elements
  button, input, select, textarea {
    transition: all ${theme.transitions.normal};
  }

  // High contrast mode support
  @media (prefers-contrast: high) {
    * {
      border-color: currentColor !important;
    }
  }

  // Reduced motion support
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  // Print styles
  @media print {
    * {
      background: transparent !important;
      color: black !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
  }
`;
