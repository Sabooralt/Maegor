import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";

export const HomeLayout = () => {
  const { logout } = useAuthContext();
  return (
    <div className="w-full flex justify-between">
      <Link to="/auth/login">
        <Button>Login</Button>
      </Link>
      <Link to="/chat">
        <Button>Chat</Button>
      </Link>
      <Button onClick={logout} className="bg-neutral-900 text-white">
        Logout
      </Button>
    </div>
  );
};
