
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => {
        authService.logout();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (payload) => {
    const userData = await authService.register(payload);
    try {
      sessionStorage.setItem("longevita_just_registered", "true");
    } catch {
      // ignore storage access issues
    }
    setUser(userData);
    return userData;
  };

  const login = async (payload) => {
    const userData = await authService.login(payload);
    setUser(userData);
    return userData;
  };

  const updateUser = (updatedFieldsOrUser) => {
    setUser((prev) => {
      if (!prev) return updatedFieldsOrUser;
      return { ...prev, ...updatedFieldsOrUser };
    });
  };

  const logout = () => {
    authService.logout();
    try {
      sessionStorage.removeItem("longevita_just_registered");
    } catch {
      // ignore
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        register,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
