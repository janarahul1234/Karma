import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoutes() {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
