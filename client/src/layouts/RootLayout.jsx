import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { Introduction } from "@/pages/Introduction";
import { Navbar } from "@/components/ui/navbar";

export const HomeLayout = () => {
  const { logout } = useAuthContext();
  return (
    <div >
      <Navbar />

      <Outlet />
    </div>
  );
};
