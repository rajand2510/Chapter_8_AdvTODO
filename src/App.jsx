import React from "react";
import { Route, Routes } from "react-router-dom";
import Hero from "./Page/Hero";
import Login from "./Page/Login";
import Home from "./Page/Home";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

function App() {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Hero />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
