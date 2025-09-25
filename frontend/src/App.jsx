import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "@/context/themeContext";

const PublicRoutes = lazy(() => import("@/utils/PublicRoutes"));
const ProtectedRoutes = lazy(() => import("@/utils/ProtectedRoutes"));

const AuthLayout = lazy(() => import("@/components/layouts/AuthLayout"));
const DashboardLayout = lazy(() =>
  import("@/components/layouts/DashboardLayout")
);

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Home = lazy(() => import("@/pages/dashboard/Home"));
const Goals = lazy(() => import("@/pages/dashboard/Goals"));
const Finances = lazy(() => import("@/pages/dashboard/Finances"));

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/finances" element={<Finances />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
