import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // ---------------- User State ----------------
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  // ---------------- Theme State ----------------
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "orange";
  });

  // ✅ Apply theme immediately on first render (prevents blink)
  document.documentElement.setAttribute("data-theme", theme);

  // keep DOM + localStorage in sync when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---------------- On Mount ----------------
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  // ---------------- Save User ----------------
  const saveUser = (data) => {
    const { token, user } = data;
    if (!token || !user) {
      console.error("Invalid login response:", data);
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);

    if (user.preferenceTheme) {
      setTheme(user.preferenceTheme);
    }
  };

  // ---------------- Custom Toast ----------------
  const successToast = (message) => {
    toast.custom(
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md"
        style={{
          backgroundColor: "var(--icon-color)",
          color: "var(--sidebar-bg)",
        }}
      >
        <Check size={20} style={{ color: "var(--sidebar-bg)" }} />
        <span>{message}</span>
      </div>,
      { duration: 1500 }
    );
  };

  // ---------------- Login with Google ----------------
  const login = async (credential) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { credential }
      );
      saveUser(res.data);
      successToast("Login successful");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  // ---------------- Update Theme ----------------
  const updateTheme = (newTheme) => {
    setTheme(newTheme); // applies instantly + saves in localStorage

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await axios.put("http://localhost:5000/api/users/theme", {
          theme: newTheme,
        });

        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else if (user) {
          const updatedUser = { ...user, preferenceTheme: newTheme };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

       
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to update theme");
      }
    }, 800);
  };

  // ---------------- Logout ----------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    successToast("Logged out 👋");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, theme, setTheme, updateTheme }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
