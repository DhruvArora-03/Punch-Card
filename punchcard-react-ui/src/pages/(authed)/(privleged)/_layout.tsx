import { Outlet, Navigate } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";

export default function Layout() {
  const authState = useAuthUser();

  if (authState()?.role.toLowerCase() !== "admin") {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
}
