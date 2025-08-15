import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName?: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function DemoAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      // Check localStorage for demo user
      const savedUser = localStorage.getItem('demo-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Demo sign in
    const demoUser: User = {
      id: '1',
      email,
      firstName: email.split('@')[0],
      lastName: 'User'
    };
    setUser(demoUser);
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
  };

  const signUp = async (email: string, password: string, firstName?: string) => {
    // Demo sign up
    const demoUser: User = {
      id: '1',
      email,
      firstName: firstName || email.split('@')[0],
      lastName: 'User'
    };
    setUser(demoUser);
    localStorage.setItem('demo-user', JSON.stringify(demoUser));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('demo-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoaded,
        isSignedIn: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within DemoAuthProvider');
  }
  return context;
}
