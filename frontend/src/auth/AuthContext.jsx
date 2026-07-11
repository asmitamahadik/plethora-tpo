import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const readStoredUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const applyAuth = (authResponse) => {
    const { token, ...rest } = authResponse;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(rest));
    setUser(rest);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, applyAuth, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
