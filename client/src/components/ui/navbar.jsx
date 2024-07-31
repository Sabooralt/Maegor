import { Logo } from "@/Logo/Logo";
import { Button } from "./button";
import { MessageCircle, Plus } from "lucide-react";
import { useAuthContext } from "@/contexts/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Input } from "./input";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user } = useAuthContext();
  return (
    <div className="fixed top-0 bg-slate-50 z-50 flex w-full flex-row items-center justify-between border-b border-slate-400 px-10 py-2 shadow-sm">
      <div>
        <Logo size={40} />
      </div>

      <div>
        <Input type="search" className="flex w-full flex-auto" />
      </div>

      <div className="flex flex-row items-center gap-5">
        {user && (
          <>
            <Link to="#">
              <Button className="flex flex-row items-center gap-2">
                <Plus /> Create
              </Button>
            </Link>
            <Link to="/chat">
              <Button className="flex flex-row items-center gap-2">
                <MessageCircle /> Chat
              </Button>
            </Link>
          </>
        )}

        {user ? (
          <Avatar className="size-8 bg-neutral-950">
            <AvatarImage src={"/images/A_Avatar.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Link to="/auth/signup">
            <button className="w-fit rounded-full bg-indigo-600 px-4 py-2 text-white dark:bg-white dark:text-black">
              Sign Up
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};
