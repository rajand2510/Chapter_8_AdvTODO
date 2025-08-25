import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <GoogleOAuthProvider clientId="1025632703673-tj2cv85muce8gogk9enh4t636crkmmt5.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </StrictMode>
  </BrowserRouter>
);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered");
    } catch (err) {
      console.error("Service Worker registration failed:", err);
    }
  });
}
