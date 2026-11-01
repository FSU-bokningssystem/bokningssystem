import { createContext, useContext, useState, type ReactNode } from 'react';
import type { userData } from '../types/types';

interface AuthContextType {
  currentUser: userData | null;
  loginAs: (user: userData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<userData | null>(() => {
    const saved = localStorage.getItem('activeUser');
    return saved ? JSON.parse(saved) : null;
  });

  const loginAs = (user: userData) => {
    setCurrentUser(user);
    localStorage.setItem('activeUser', JSON.stringify(user));
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('activeUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth måste användas inom en AuthProvider');
  }
  return context;
};