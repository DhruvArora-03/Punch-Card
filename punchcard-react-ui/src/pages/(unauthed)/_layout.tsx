import { useAuth } from "lib/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}
