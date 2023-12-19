import { useSignOut } from "react-auth-kit";

export default function LogOutPage() {
  const signOut = useSignOut();
  signOut();
  return <></>;
}