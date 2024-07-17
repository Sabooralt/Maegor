import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/contexts/authContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Paperclip, Send, Smile } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const Chatting = () => {
  const { user } = useAuthContext();
  const { roomId } = useParams();

  const { selectedRoom, selectRoom } = useSelectedRoom();

  useEffect(() => {
    if (!selectedRoom) {
      selectRoom(roomId);
    }
  }, [selectedRoom, selectedRoom]);

  if (!selectedRoom) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
        <LoaderCircle className="animate-spin size-5" />

        <span>Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r h-fit p-3 flex rounded-xl flex-row justify-between from-indigo-600 to-purple-600 w-full">
        <div className="flex items-center justify-between w-full rounded-lg gap-2">
          <div className="flex gap-2 items-center text-white">
            <div className="size-6 bg-white rounded-full">
              <Avatar>
                <AvatarImage
                  src={
                    selectedRoom.roomType === "anonymous"
                      ? "/images/A_Avatar.png"
                      : selectedRoom.members.profilePicture
                  }
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <p>Anonymous User</p>
          </div>

          <p className="text-slate-100 text-xs">Online 3 hours ago</p>
        </div>
      </div>

      <div className="mt-auto">
        <h1 class="mt-2 size-fit text-3xl font-bold tracking-tight text-[#111827] sm:text-5xl">
          High Quality Next.js, Tailwind CSS and Framer Motion Templates that
          stand out
        </h1>
      </div>
      <div className="mt-auto pb-2 w-full drop-shadow-md">
        <div className="py-3 bg-slate-50 px-4 gap-5 flex items-center justify-between w-full rounded-lg">
          <div className="flex items-center text-neutral-800 gap-2">
            <Smile className="size-6" />
            <Paperclip className="size-6" />
          </div>
          <div className="w-full">
            <Textarea
              rows="1"
              placeholder="Chat away..."
              className=" resize-none text-md w-full shadow-sm"
            />
          </div>

          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2  size-fit rounded-md">
            <Send className="size-5 text-slate-200" />
          </button>
        </div>
      </div>
    </>
  );
};
