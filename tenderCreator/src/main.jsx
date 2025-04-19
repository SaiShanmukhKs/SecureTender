import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TenderProvider } from './context/TenderContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <TenderProvider>
      <App />
    </TenderProvider>
  </StrictMode>
)
