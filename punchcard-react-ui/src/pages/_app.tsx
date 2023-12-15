import { AuthProvider } from "../lib/auth";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

// const queryClient = new QueryClient();

// function App() {
//   const [, loadingAuth] = useAuth();
//   if (loadingAuth) {
//     return null;
//   }

//   return <Outlet />;
// }

export default function AppWrapper() {
  return (
    <AuthProvider>
      {/* <QueryClientProvider client={queryClient}> */}
      <Outlet />
      {/* </QueryClientProvider> */}
    </AuthProvider>
  );
}
