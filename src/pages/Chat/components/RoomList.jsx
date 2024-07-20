import { Link } from "react-router-dom";
import { Plus, Ellipsis, Dot } from "lucide-react";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { socket } from "@/socket";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateToIso } from "@/utils/formatDateToSingleString";

const RoomList = ({ data }) => {
  const { selectedRoom, selectRoom } = useSelectedRoom();
  const anonymousRooms = data.filter((room) => room.roomType === "anonymous");
  const friendRooms = data.filter((room) => room.roomType === "friend");
  const groupRooms = data.filter((room) => room.roomType === "group");

  const joinWatingRoom = () => {
    socket.emit("join_waiting_room", { userId: user._id });
  };

  return (
    <>
      <div className="relative flex w-full flex-col gap-5">
        <div className="grid gap-1 px-2">
          <h2 className="text-lg font-bold">Anonymous Rooms</h2>
          <Button
            onClick={joinWatingRoom}
            className="flex w-fit items-center gap-2 border-neutral-200 bg-slate-900 text-white"
          >
            <Plus className="size-3" />
            <span className="text-xs">New Anonymous Chat</span>
          </Button>
        </div>
        <div className="grid w-full gap-1">
          {anonymousRooms.length > 0 ? (
            anonymousRooms.map((item) => (
              <Link to={`/chat/${item.roomId}`} key={item.roomId}>
                <button
                  disabled={selectedRoom && selectedRoom.roomId === item.roomId}
                  onClick={() => selectRoom(item.roomId)}
                  className={`group flex w-full cursor-pointer items-center justify-normal gap-2 overflow-hidden rounded-md bg-transparent py-4 px-5 hover:bg-slate-100 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-200`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Avatar className="size-10 bg-black">
                      <AvatarImage src={"/images/A_Avatar.png"} alt="@User" />
                      <AvatarFallback>AU</AvatarFallback>
                    </Avatar>

                    <div className="w-full text-start text-sm">
                      <h1
                        className={
                          item.lastMessage?.seen
                            ? "font-normal"
                            : "font-semibold"
                        }
                      >
                        Unknown User
                      </h1>

                      <h1
                        className={`flex w-fit flex-row items-center gap-0 text-start text-xs ${
                          item.lastMessage?.seen
                            ? "font-nomral"
                            : "font-semibold"
                        }`}
                      >
                        <span
                          className={`${item.lastMessage ? "max-w-[75%]" : "max-w-[97%]"} truncate ${item.lastMessage?.seen && "text-slate-600"}`}
                        >
                          {item.lastMessage && item.lastMessage.message
                            ? item.lastMessage.message
                            : "No messages yet. Start the conversation!"}
                        </span>
                        {item.lastMessage?.createdAt && (
                          <p className="flex w-fit items-center gap-0 text-slate-600">
                            <Dot className="h-4 w-fit" />
                            <span>
                              {formatDateToIso(item.lastMessage?.createdAt)}
                            </span>
                          </p>
                        )}
                      </h1>
                    </div>
                  </div>
                  {!item.lastMessage?.seen && (
                    <div className="ml-auto size-2 rounded-full bg-blue-500"></div>
                  )}
                </button>
              </Link>
            ))
          ) : (
            <p>No anonymous rooms available.</p>
          )}
        </div>
      </div>

      {/* Friends Section */}
      <div className="flex w-full flex-col gap-5">
        <div className="grid gap-5 px-2">
          <h2 className="text-lg font-bold">Anonymous Rooms</h2>
        </div>
        <div className="grid w-full gap-3">
          {friendRooms.length > 0 ? (
            friendRooms.map((item) => (
              <Link to={`/chat/${item.roomId}`} key={item.roomId}>
                <button
                  disabled={selectedRoom && selectedRoom.roomId === item.roomId}
                  onClick={() => selectRoom(item.roomId)}
                  className={`group flex w-full cursor-pointer items-center justify-between rounded-md bg-transparent p-2 shadow-none hover:shadow-md disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-200`}
                >
                  <h1 className="line-clamp-1 text-sm font-normal transition-transform group-hover:translate-x-2">
                    {item.lastMessage && item.lastMessage.message
                      ? item.lastMessage.message
                      : "No messages yet. Start the conversation!"}
                  </h1>
                  <Ellipsis className="hidden size-4 text-neutral-700 transition-colors hover:text-black group-hover:block" />
                </button>
              </Link>
            ))
          ) : (
            <p className="px-2">No friend rooms available.</p>
          )}
        </div>
      </div>

      {/* Groups Section */}
      <div className="flex w-full flex-col gap-5">
        <h2 className="px-2 text-xl font-semibold">Groups</h2>
        <div className="grid w-full gap-3">
          {groupRooms.length > 0 ? (
            groupRooms.map((item) => (
              <Link to={`/chat/${item.roomId}`} key={item.roomId}>
                <button
                  disabled={selectedRoom && selectedRoom.roomId === item.roomId}
                  onClick={() => selectRoom(item.roomId)}
                  className={`group flex w-full cursor-pointer items-center justify-between rounded-md bg-transparent p-2 shadow-none hover:shadow-md disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-slate-200`}
                >
                  <h1 className="line-clamp-1 text-sm font-normal transition-transform group-hover:translate-x-2">
                    {item.lastMessage?.message
                      ? item.lastMessage.message
                      : "No messages yet. Start the conversation!"}
                  </h1>
                  <Ellipsis className="hidden size-4 text-neutral-700 transition-colors hover:text-black group-hover:block" />
                </button>
              </Link>
            ))
          ) : (
            <p className="px-2">No group rooms available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default RoomList;
