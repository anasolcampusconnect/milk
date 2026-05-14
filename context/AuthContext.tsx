import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
 
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}
 
const AuthContext = createContext<AuthContextType | undefined>(undefined);
 
// Safe Storage Helper to prevent "Native module is null" errors
const SafeStorage = {
  getItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch (e) {
      console.warn('Storage getItem error:', e);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (e) {
      console.warn('Storage setItem error:', e);
    }
  },
  removeItem: async (key: string) => {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('Storage removeItem error:', e);
    }
  }
};
 
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
 
  // Check if user was already logged in when the app loads
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedState = await SafeStorage.getItem('isLoggedIn');
        if (storedState === 'true') {
          setIsLoggedIn(true);
          // REMOVED auto-routing here so the user can press the button on the index page!
        }
      } catch (error) {
        console.error("Failed to load auth state", error);
      } finally {
        setIsLoading(false);
      }
    };
 
    loadAuthState();
  }, []);
 
  const login = async (email: string, pass: string) => {
    try {
      // Save to safe storage
      await SafeStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };
 
  const logout = async () => {
    try {
      // Clear from safe storage
      await SafeStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
      router.replace('/login');
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };
 
  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


