import { Outlet, Navigate } from "react-router-dom";

export default function PublicRoutes() {
  const isAuthenticated = localStorage.getItem("token");

  return isAuthenticated ? <Navigate to="/" /> : <Outlet />;
}
