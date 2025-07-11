import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import FormUser from "./pages/FormUser.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import UploadPeserta from "./pages/admin/UploadPeserta.jsx";
import EditFormPage from "./pages/admin/EditFormPage.jsx";
import Appreciate from "./pages/Apresiasi.jsx";
import ProtectedRoute from "./components/ProtectRoute/ProtectRoute.jsx";
import LoginProtectRoute from "./components/ProtectRoute/LoginProtectRoute.jsx";
import Search from "./pages/user/Search.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormUser />} />
        <Route path="/login" element={
          <LoginProtectRoute>
            <Login />
          </LoginProtectRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/Uploadpeserta" element={
          <ProtectedRoute>
            <UploadPeserta />
          </ProtectedRoute>
        } />
        <Route path="/EditFormPage" element={
          <ProtectedRoute>
            <EditFormPage />
          </ProtectedRoute>
        } />
        <Route path="/apresiasi" element={<Appreciate />} />
        <Route path="/Search" element={<Search />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </BrowserRouter>
  </StrictMode>
);