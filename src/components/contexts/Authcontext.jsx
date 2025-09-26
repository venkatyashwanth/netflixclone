"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check auth token on component mount
    const token = getAuthToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false); // Loading complete
  }, []);

  const login = (token) => {
    setIsLoading(true);
    setAuthToken(token);
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const logout = () => {
    setIsLoading(true);
    removeAuthToken();
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}