import {
  DotSquare,
  File,
  MessageCirclePlus,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/authContext";
import { socket } from "@/socket";
import { Separator } from "@/components/ui/separator";
import {
  useAnonymousRooms,
  useFriendRooms,
  useGroupRooms,
} from "@/hooks/useFetchRooms";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";
import { ChatSidebar } from "./components/chatsidebar";

export const Chat = () => {
  return (
    <div className=" w-full font-geist ">
      <div className="grid size-full grid-cols-12">
        <ChatSidebar />

        <div className="md:col-span-10 rounded-xl px-3 col-span-9 h-screen grid size-full cube-track">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
