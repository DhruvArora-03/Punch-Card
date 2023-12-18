import NavBar from "components/NavBar";
import { Outlet } from "react-router-dom";

// import { useAuth } from "lib/auth";
// import { Navigate, Outlet } from "react-router-dom";

export default function Layout() {
  // const { user } = useAuth();

  // if (!user) {
  //   return <Navigate to="/login" />;
  // }

  return <>
    <NavBar />
    <Outlet />
  </>;
}
