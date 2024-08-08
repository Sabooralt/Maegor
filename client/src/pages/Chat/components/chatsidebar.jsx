import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/authContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { socket } from "@/socket";
import axiosInstance from "@/utils/axiosInstance";
import { Separator } from "@radix-ui/react-separator";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DotSquare, Ellipsis, MessageCirclePlus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useAnonymousSocketEvents } from "@/hooks/useAnonymousSocket";
import RoomList from "./RoomList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRoomContext } from "@/contexts/roomContext";
import { SmallLoading } from "@/components/ui/SmallLoading";

export const ChatSidebar = () => {
  const { user, token } = useAuthContext();
  const { dispatch, rooms } = useRoomContext();

  useAnonymousSocketEvents();

  const { isPending, error, data, isLoading, isFetching } = useQuery({
    queryKey: ["anonymousRoom"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/rooms/${user._id}/user_rooms`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return await response.data;
    },
    retry: 3,
  });

  useEffect(() => {
    if (data) {
      dispatch({ type: "FETCH_ROOMS", payload: data });
    }
  }, [dispatch, data]);

  return (
    <ScrollArea className="h-screen w-full min-w-[20rem] border-r border-black/50 bg-white shadow-xl">
      <div className="flex w-full items-center justify-between p-2">
        <h1 className="text-2xl font-semibold">Chats</h1>

        <div>
          <button className="rounded-full bg-transparent bg-white p-2 transition-colors">
            <MessageCirclePlus className="size-6" />
          </button>
        </div>
      </div>
      <Separator />

      <div className="relative grid gap-5 py-6">
        <RoomList loading={isLoading} />
      </div>
    </ScrollArea>
  );
};
