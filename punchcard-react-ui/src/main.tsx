import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
import React from 'react'
import { AuthProvider } from 'react-auth-kit';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider
      authType='cookie'
      authName='_auth'
      cookieDomain={window.location.hostname}
      cookieSecure={false}
    >
      <Routes />
    </AuthProvider>
  </React.StrictMode>)