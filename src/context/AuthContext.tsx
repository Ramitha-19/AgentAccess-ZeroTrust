import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'agentaccess_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    // Default to Priya HR for initial immediate view of the personalized AI agent concept, or Admin
    return DEMO_USERS[1]; // Priya Sharma
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_KEY);
      }
    } catch {}
  }, [user]);

  const login = (email: string): boolean => {
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (found) {
      setUser(found);
      return true;
    }
    // Fallback: if user types an admin-like email or custom, allow login
    if (email.toLowerCase().includes('admin')) {
      setUser(DEMO_USERS[0]);
      return true;
    }
    if (email.toLowerCase().includes('priya') || email.toLowerCase().includes('hr')) {
      setUser(DEMO_USERS[1]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'ADMIN') {
      setUser(DEMO_USERS[0]); // Vikram Malhotra (Admin)
    } else {
      setUser(DEMO_USERS[1]); // Priya Sharma (HR)
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : null,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
        availableUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
