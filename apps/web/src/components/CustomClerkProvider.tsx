import { ClerkProvider } from '@clerk/clerk-react';
import { ReactNode } from 'react';

const ALLOWED_DOMAINS = ['mgit.ac.in', 'college.edu', 'university.edu'];

interface CustomClerkProviderProps {
  children: ReactNode;
  publishableKey: string;
  signInUrl?: string;
  signUpUrl?: string;
  afterSignInUrl?: string;
  afterSignUpUrl?: string;
}

export function CustomClerkProvider({ 
  children, 
  publishableKey,
  signInUrl,
  signUpUrl,
  afterSignInUrl,
  afterSignUpUrl 
}: CustomClerkProviderProps) {
  
  const validateOrganizationalEmail = (email: string): boolean => {
    const domain = email.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  };

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      afterSignInUrl={afterSignInUrl}
      afterSignUpUrl={afterSignUpUrl}
      appearance={{
        elements: {
          formButtonPrimary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
          card: "shadow-lg",
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
}
