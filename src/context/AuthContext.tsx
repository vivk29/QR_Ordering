import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for session
    const savedRole = localStorage.getItem('app_role') as UserRole;
    const savedUser = localStorage.getItem('app_user');
    
    if (savedRole) {
      setRole(savedRole);
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (selectedRole: UserRole, email: string = 'guest@example.com') => {
    const newUser: UserProfile = {
      uid: Math.random().toString(36).substr(2, 9),
      email,
      role: selectedRole,
      vendorId: selectedRole === 'vendor' ? 'v1' : undefined
    };
    setUser(newUser);
    setRole(selectedRole);
    localStorage.setItem('app_role', selectedRole);
    localStorage.setItem('app_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('app_role');
    localStorage.removeItem('app_user');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
