import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TenderProvider } from './context/TenderContext';
import { BlockchainTenderingProvider } from './context/ContractContext.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <BlockchainTenderingProvider>
      <TenderProvider>
        <App />
      </TenderProvider>
    </BlockchainTenderingProvider>
  </StrictMode>
)
