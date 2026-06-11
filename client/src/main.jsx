/**
 * React imports
 */
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

/**
 * Pages imports
 */
import RenderRegisterLogin from "./Components/RenderRegisterLogin.jsx";
import ChatWindow from "./Pages/Chat/ChatWindow.jsx";
import AuthWrapper from "./utils/AuthWrapper.jsx";

/**
 * Create root
 */
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<RenderRegisterLogin />} />
      <Route path="/register" element={<RenderRegisterLogin />} />
      <Route path="/login" element={<RenderRegisterLogin />} />

        <Route path="/chat" element={<ChatWindow />} />
      {/* Protected Routes */}
      <Route element={<AuthWrapper />}>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<h2>404 Page not found</h2>} />
    </Routes>
  </BrowserRouter>,
);
