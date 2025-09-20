import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useUsers } from '@/hooks/useUsers';

export const AuthContext = createContext();

const initializeAuth = () => {
  try {
    const loggedInUser = localStorage.getItem('loggedInUser');
    return loggedInUser ? JSON.parse(loggedInUser) : null;
  } catch (error) {
    console.error("Failed to initialize auth from localStorage", error);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initializeAuth);
  const { users, addUser, updateUser: updateGlobalUser, getUserById } = useUsers();

  useEffect(() => {
    try {
      const handleStorageChange = (event) => {
        if (event.key === 'loggedInUser') {
          const loggedInUser = localStorage.getItem('loggedInUser');
          setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    } catch (error) {
      console.error("Failed to set up storage listener", error);
    }
  }, []);

  const login = (email, password) => {
    try {
      const foundUser = users.find(u => u.email === email && u.password === password);
      if (foundUser) {
        const freshUser = getUserById(foundUser.id);
        localStorage.setItem('loggedInUser', JSON.stringify(freshUser));
        setUser(freshUser);
        return freshUser;
      }
      return null;
    } catch (error) {
      console.error("Login failed", error);
      return null;
    }
  };

  const register = (userData) => {
    return addUser({ ...userData, role: 'client', planId: '1' });
  };

  const logout = () => {
    try {
      localStorage.removeItem('loggedInUser');
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const updateUser = useCallback((updatedUserData) => {
    try {
      updateGlobalUser(updatedUserData.id, updatedUserData);
      
      if(user?.id === updatedUserData.id){
        localStorage.setItem('loggedInUser', JSON.stringify(updatedUserData));
        setUser(updatedUserData);
      }
    } catch(error) {
      console.error("Failed to update user", error);
    }
  }, [user, updateGlobalUser]);

  const value = { user, login, register, logout, updateUser, loading: false };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};