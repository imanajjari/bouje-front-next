"use client";

import { getProfile, loginUser, logoutUser, refreshToken } from "../app/[locale]/api/auth/auth";
import React, { createContext, useContext, useState, useEffect } from "react";

// ساختن context بدون TypeScript
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  refresh: async () => {},
});

// هوک سفارشی برای استفاده از context
export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تلاش برای دریافت پروفایل هنگام mount شدن
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (err) {
        try {
          await refresh();
          const profile = await getProfile();
          setUser(profile);
        } catch {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (phone, password) => {
    await loginUser(phone, password);
    const profile = await getProfile();
    setUser(profile);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const refresh = async () => {
    await refreshToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};
