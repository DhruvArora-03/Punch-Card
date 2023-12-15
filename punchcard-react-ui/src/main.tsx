import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
// import { AuthProvider } from 'lib/auth'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <AuthProvider> */}
    <Routes />
    {/* </AuthProvider> */}
  </React.StrictMode>)