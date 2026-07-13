import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get("/auth/profile");
        setUser(response.data.data);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = async (email, password) => {
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { user: loggedInUser, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);

      return loggedInUser;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    }
  };

  const register = async ({ name, email, password, role }) => {
    setError(null);

    try {
      const response = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
        role,
      });
      const { user: registeredUser, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(registeredUser));
      setUser(registeredUser);

      return registeredUser;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};