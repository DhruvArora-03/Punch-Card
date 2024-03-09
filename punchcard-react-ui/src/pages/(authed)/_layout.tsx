import NavBar, { NavBarModes } from "components/NavBar";
import { Outlet, Navigate } from "react-router-dom";
import { RequireAuth, useAuthUser, useIsAuthenticated } from "react-auth-kit";

export default function Layout() {
  const isAuthenticated = useIsAuthenticated()
  const authState = useAuthUser()

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>
    <NavBar mode={authState()?.role.toLowerCase() == "admin" ? NavBarModes.Admin : NavBarModes.Default} />
    <RequireAuth loginPath="/login">
      <Outlet />
    </RequireAuth>
  </>
}
