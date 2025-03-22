import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("session_token");
    const storedUserId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");

    if (storedToken) setToken(storedToken);
    if (storedUserId) setUserId(storedUserId);
    if (storedUsername) setUsername(storedUsername);
  }, []);

  const login = (newToken, newUserId, newUsername) => {
    localStorage.setItem("session_token", newToken);
    localStorage.setItem("user_id", newUserId);
    localStorage.setItem("username", newUsername);

    setToken(newToken);
    setUserId(newUserId);
    setUsername(newUsername);
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
      localStorage.removeItem("user_id");
      localStorage.removeItem("username");

      setToken(null);
      setUserId(null);
      setUsername(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        username,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
