import NavBar, { NavBarModes } from "components/NavBar";
import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "react-auth-kit";

export default function Layout() {
  const isAuthenticated = useIsAuthenticated();

  return isAuthenticated() ? (
    <Navigate to="/home" />
  ) : (
    <>
      <NavBar mode={NavBarModes.UnAuthenticated} />
      <Outlet />
    </>
  );
}
