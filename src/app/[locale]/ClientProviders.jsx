// ClientProviders.jsx
'use client';

import { Toaster } from 'sonner';
import QueryProvider from '../../lib/providers/QueryProvider';
// import { AuthProvider } from '../../context/AuthContext';


export default function ClientProviders({ children }) {
  return (
    <QueryProvider>
      {/* <AuthProvider> */}
        {children}
        <Toaster richColors position="top-center" />
      {/* </AuthProvider> */}
    </QueryProvider>
  );
}
