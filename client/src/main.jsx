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
import Login from "./Pages/Login/Login.jsx";
import Register from "./Pages/Register/Register.jsx";
import ChatWindow from "./Pages/Chat/ChatWindow.jsx";
import AuthWrapper from './utils/AuthWrapper.jsx';

/**
 * Create root
 */
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      // Usage in Routes
      <Route path="/" element={<AuthWrapper isAuthenticated={false} />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/chat" element={<ChatWindow />} />
      <Route path="*" element={<h2>404 Page not found</h2>} />
    </Routes>
  </BrowserRouter>,
);
