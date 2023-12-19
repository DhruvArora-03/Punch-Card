import { createRoot } from 'react-dom/client'
import { Routes } from '@generouted/react-router'
import React from 'react'
import AuthProvider from 'react-auth-kit/AuthProvider';
import createStore from 'react-auth-kit/createStore';

const store = createStore<object>({ authType: "cookie", authName: "_auth", cookieDomain: window.location.hostname, cookieSecure: false })

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <Routes />
    </AuthProvider>
  </React.StrictMode>)