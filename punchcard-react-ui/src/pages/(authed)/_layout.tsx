import NavBar from "components/NavBar";
import { Outlet } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";

export default function Layout() {

  return <>
    <NavBar />
    <RequireAuth loginPath="/login">
      <Outlet />
    </RequireAuth>;
  </>
}
