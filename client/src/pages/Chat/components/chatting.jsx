import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { LoaderCircle } from "lucide-react";

import { ChattingHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useSelectedRoom } from "@/contexts/selectRoomContext";

export const Chatting = () => {
  const { roomId } = useParams();
  const { selectedRoom, selectRoom } = useSelectedRoom();

  useEffect(() => {
    if (!selectedRoom) {
      selectRoom(roomId);
    }
  }, [roomId, selectedRoom, selectRoom]);

  if (!selectedRoom) {
    return (
      <div className="flex size-full h-screen items-center justify-center gap-2 text-neutral-600">
        <LoaderCircle className="size-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col rounded-xl bg-zinc-100">
      <ChattingHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
