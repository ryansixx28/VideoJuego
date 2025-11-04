import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// ✅ Inicializa Firebase ANTES de tocar auth/redirect
import { initFirebase } from './services/firebase'
import { getAuth, getRedirectResult } from 'firebase/auth'

initFirebase()
getRedirectResult(getAuth()).catch(console.error)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)