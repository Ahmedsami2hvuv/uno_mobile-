import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredToken, setStoredToken, getProfile } from './api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await getStoredToken();
      if (t) {
        setToken(t);
        try {
          const p = await getProfile(t);
          setUser(p);
        } catch (e) {
          await setStoredToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    })();
  }, []);

  const signIn = async (newToken, userData) => {
    await setStoredToken(newToken);
    setToken(newToken);
    setUser(userData || null);
  };

  const signOut = async () => {
    await setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const p = await getProfile(token);
      setUser(p);
    } catch (e) {
      await signOut();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('استخدم useAuth داخل AuthProvider');
  return ctx;
}
