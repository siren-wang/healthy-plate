import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("session_token");
    if (stored) setToken(stored);
  }, []);

  const login = (newToken) => {
    localStorage.setItem("session_token", newToken);
    setToken(newToken);
  };

  const logout = async () => {
    try {
      const storedToken = localStorage.getItem("session_token");
      if (storedToken) {
        await fetch("/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("session_token");
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
