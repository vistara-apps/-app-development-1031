import { css } from '@emotion/react';

const globalStyles = css`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
    font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
  }
  
  main {
    flex: 1;
    padding-bottom: 2rem;
  }
  
  a {
    text-decoration: none;
    color: inherit;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #a1a1a1;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .slide-up {
    animation: slideUp 0.4s ease-out;
  }
`;

export default globalStyles;

