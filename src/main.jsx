import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/authContext.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "./components/ui/toaster.jsx";
import "@fontsource/poppins";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <Sonner closeButton richColors position="bottom-right" />
      <App />
      <Toaster />
    </AuthContextProvider>
  </React.StrictMode>
);
