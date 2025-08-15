import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { CustomClerkProvider } from './components/CustomClerkProvider';

import { App } from './App';
import { DemoApp } from './DemoApp';
import './styles/globals.css';

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('Clerk Key loaded:', !!PUBLISHABLE_KEY);

// Check if Clerk is properly configured
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {isClerkConfigured ? (
          <CustomClerkProvider 
            publishableKey={PUBLISHABLE_KEY}
            signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
            signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
            afterSignInUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_IN_URL}
            afterSignUpUrl={import.meta.env.VITE_CLERK_AFTER_SIGN_UP_URL}
          >
            <App />
          </CustomClerkProvider>
        ) : (
          <DemoApp />
        )}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
