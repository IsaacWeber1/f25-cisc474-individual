import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CURRENT_USER_ID } from '../config/constants';
import type { User } from '../types/api';

interface AuthContextType {
  currentUser: User | null;
  currentUserId: string;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For now, just use the hardcoded ID from constants
    // TODO: Replace with actual session management later
    setIsLoading(false);
  }, []);

  const value = {
    currentUser,
    currentUserId: CURRENT_USER_ID, // From constants!
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
