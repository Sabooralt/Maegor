import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedRoom } from "@/contexts/selectRoomContext";

export const ChattingHeader = () => {
  const { selectedRoom } = useSelectedRoom();
  return (
    <div className="relative top-0 flex h-fit w-full flex-row justify-between rounded-br-lg border-b border-black/50 bg-white bg-gradient-to-r p-3 text-black shadow-lg">
      <div className="flex w-full items-center justify-between gap-2 rounded-lg">
        <div className="flex items-center gap-2 text-black">
          <div className="size-6 rounded-full bg-black">
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
          <p>
            {selectedRoom.roomType === "anonymous"
              ? "Anonymous User"
              : selectedRoom.members.username}
          </p>
        </div>
        <p className="text-xs text-black">Online 3 hours ago</p>
      </div>
    </div>
  );
};
