import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ContentPage } from './pages/ContentPage.tsx'
import { privacyPolicy } from './data/content.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContentPage page={privacyPolicy} />
  </StrictMode>
)
