import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedRoom } from "@/contexts/selectRoomContext";

export const ChattingHeader = () => {
  const { selectedRoom } = useSelectedRoom();
  return (
    <div className="bg-gradient-to-r h-fit relative top-0 p-3 flex rounded-br-lg shadow-lg flex-row justify-between from-indigo-600 to-purple-600 w-full">
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
          <p>
            {selectedRoom.roomType === "anonymous"
              ? "Anonymous User"
              : selectedRoom.members.username}
          </p>
        </div>
        <p className="text-slate-100 text-xs">Online 3 hours ago</p>
      </div>
    </div>
  );
};
