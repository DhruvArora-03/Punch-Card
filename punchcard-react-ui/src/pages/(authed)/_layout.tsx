import NavBar from "components/NavBar";
import { Outlet, Navigate } from "react-router-dom";
import { RequireAuth, useIsAuthenticated } from "react-auth-kit";

export default function Layout() {
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>
    <NavBar />
    <RequireAuth loginPath="/login">
      <Outlet />
    </RequireAuth>
  </>
}
