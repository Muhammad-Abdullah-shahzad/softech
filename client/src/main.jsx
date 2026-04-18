import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import './index.css'
import App from './App.jsx'

const theme = createTheme({
  primaryColor: 'fairgig',
  colors: {
    fairgig: [
        '#e0fff8', '#b3ffeb', '#80ffd9', '#4dffc8', '#1affb8', 
        '#00e6a3', '#28e0b6', '#00b37e', '#00805a', '#004d36'
    ],
    // Force legacy indigo components to a minimalist Slate gray for cleaner monochrome aesthetics
    indigo: [
        '#f8fafc', '#f1f5f9', '#e2e8f0', '#cbd5e1', '#94a3b8', 
        '#64748b', '#475569', '#334155', '#1e293b', '#0f172a'
    ]
  },
  fontFamily: 'Inter, sans-serif',
  headings: {
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '900',
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
)
