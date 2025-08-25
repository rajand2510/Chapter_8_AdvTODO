import React from "react";
import { Route, Routes } from "react-router-dom";
import Hero from "./Page/Hero";
import Login from "./Page/Login";
import Home from "./Page/Home";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />} />
          <Route path="/home" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
