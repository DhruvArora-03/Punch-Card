import NavBar, { NavBarModes } from "components/NavBar";
import { Outlet } from "react-router-dom";
import { RequireAuth, useAuthUser } from "react-auth-kit";

export default function Layout() {
  const authState = useAuthUser();

  return (
    <>
      <NavBar
        mode={
          authState()?.role.toLowerCase() == "admin"
            ? NavBarModes.Admin
            : NavBarModes.Default
        }
      />
      <RequireAuth loginPath="/login">
        <Outlet />
      </RequireAuth>
    </>
  );
}
