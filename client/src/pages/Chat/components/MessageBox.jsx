import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthContext } from "@/contexts/authContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { format } from "date-fns";
import { Check } from "lucide-react";

export const MessageBox = ({ msg }) => {
  const { user } = useAuthContext();
  const { selectedRoom } = useSelectedRoom();
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <div
          className={`relative flex w-fit max-w-lg flex-col gap-2 ${
            msg.senderId === user._id ? "ml-auto" : "mr-auto"
          }`}
        >
          <div
            className={`flex flex-row gap-2 ${
              msg.senderId === user._id ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              key={msg._id}
              className={`relative ${
                msg.message.length >= 54 ? "py-5" : "py-2"
              } w-fit rounded-lg text-white ${
                msg.senderId === user._id
                  ? "rounded-br-none bg-neutral-900 pl-5 pr-6"
                  : "rounded-bl-none bg-gradient-to-r from-indigo-600 to-purple-600 pl-6 pr-5"
              }`}
            >
              <span className="text-lg">{msg.message}</span>
            </div>
            {!msg.seenBy.length > 0 && msg.senderId === user?._id && (
              <div className="order-first mt-auto flex size-4 items-center justify-center rounded-full border border-black">
                {msg.success && msg.success && <Check className="size-3" />}
              </div>
            )}
          </div>

          <div className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="size-6 bg-black">
                <AvatarImage src="/images/A_Avatar.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p>
                {msg.senderId === user?._id
                  ? "You"
                  : selectedRoom.roomType === "anonymous"
                    ? "User"
                    : selectedRoom.members.username}{" "}
              </p>
            </div>
            <p className="text-xs text-neutral-800">
              {format(new Date(msg.createdAt), "h:mm a")}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{format(new Date(msg.createdAt), "MMM d, yyyy, h:mm a")}</p>
      </TooltipContent>
    </Tooltip>
  );
};
