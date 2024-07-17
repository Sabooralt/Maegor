import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/authContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import axiosInstance from "@/utils/axiosInstance";
import { Separator } from "@radix-ui/react-separator";
import { useQuery } from "@tanstack/react-query";
import { DotSquare, Ellipsis, MessageCirclePlus, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const ChatSidebar = () => {
  const { user, token } = useAuthContext();
  const { selectRoom, selectedRoom } = useSelectedRoom();

  const { isPending, error, data, isFetching } = useQuery({
    queryKey: ["anonymousRoom"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/rooms/${user._id}/anonymous`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return await response.data;
    },
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  const joinWatingRoom = () => {
    socket.emit("join_waiting_room", { userId: user._id });
  };
  return (
    <div className="h-full rounded-xl shadow-xl place-items-start grid px-4 bg-[#f9f9f9] md:col-span-2 col-span-3">
      <div className="flex w-full justify-between py-2 items-center">
        <h1 className="text-2xl font-semibold">Chats</h1>

        <div>
          <button className="p-2 rounded-full bg-transparent transition-colors bg-white  ">
            <MessageCirclePlus className="size-6 " />
          </button>
        </div>
      </div>
      <Separator />

      <div className="flex flex-col gap-5 w-full">
        <h2 className="text-xl font-semibold">Anonymous Rooms</h2>

        <div className="grid gap-3 w-full">
          <Button
            onClick={joinWatingRoom}
            className=" bg-slate-900 flex items-center border-neutral-200 text-white"
          >
            <Plus className="size-5" />
            <span>New Anonymous Chat</span>
          </Button>
          {data &&
            data.map((item, index) => (
              <Link to={`/chat/${item.roomId}`} key={item.roomId}>
                <button
                  disabled={selectedRoom && selectedRoom.roomId === item.roomId}
                  onClick={() => selectRoom(item.roomId)}
                  className={`cursor-pointer disabled:cursor-not-allowed disabled:pointer-events-none disabled:bg-slate-200 group w-full flex shadow-none items-center bg-transparent justify-between rounded-md p-2 hover:shadow-md`}
                >
                  <h1 className="font-normal transition-transform group-hover:translate-x-2 text-sm line-clamp-1">
                    Anonymouse chat {index + 1}
                  </h1>

                  <Ellipsis className="size-4 hidden group-hover:block transition-colors hover:text-black text-neutral-700" />
                </button>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
