import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NotFound } from './pages/NotFound.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotFound />
  </StrictMode>
)
