import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginService } from "@/services/authService";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { router } from "expo-router";

interface AuthContextType {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

// Helpers para guardar/leer en móvil o web
const saveToken = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getToken = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteToken = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const savedToken = await getToken(TOKEN_KEY);
        if (savedToken) setToken(savedToken);
      } catch (error) {
        console.error("Error loading auth data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginService(email, password);

      setToken(response.token);
      await saveToken(TOKEN_KEY, response.token);

      router.replace("/(zuser)");
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      await deleteToken(TOKEN_KEY);
      router.replace("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
