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
  }, [roomId, selectedRoom]);

  if (!selectedRoom) {
    return (
      <div className="flex items-center gap-2 h-screen text-neutral-600 justify-center size-full">
        <LoaderCircle className="animate-spin size-5" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col rounded-xl  h-screen w-full cube-track">
      <ChattingHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};
