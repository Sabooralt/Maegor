import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/contexts/authContext";
import { useMessageContext } from "@/contexts/messageContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useMessages } from "@/hooks/useMessages";
import { socket } from "@/socket";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Chatting = () => {
  const { roomId } = useParams();
  const { user } = useAuthContext();

  const { selectedRoom, selectRoom } = useSelectedRoom();

  useEffect(() => {
    if (!selectedRoom) {
      selectRoom(roomId);
    }
  }, [selectedRoom, selectedRoom]);

  useEffect(() => {
    if (roomId && user) {
      socket.emit("join_room", { roomId, userId: user._id });
    }
  }, [roomId, user]);

  if (!selectedRoom) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
        <LoaderCircle className="animate-spin size-5" />

        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="md:col-span-10 relative  flex flex-col  rounded-xl px-3 col-span-9 h-screen w-full cube-track">
      <ChattingHeader selectedRoom={selectedRoom} />

      <ChatMessages selectedRoom={selectedRoom} />

      <ChatInput />
    </div>
  );
};

export const ChattingHeader = ({ selectedRoom }) => {
  return (
    <div className="bg-gradient-to-r h-fit relative top-0 p-3 flex rounded-xl flex-row justify-between from-indigo-600 to-purple-600 w-full">
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

export const ChatMessages = ({ selectedRoom }) => {
  const { dispatch: messageDispatch, messages } = useMessageContext();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    error,
    status,
  } = useMessages(selectedRoom?.roomId);

  useEffect(() => {
    if (data) {
      messageDispatch({
        type: "FETCH_MESSAGES",
        payload: data.pages[0].messages,
      });
    }
    console.log(data);
  }, [data, messageDispatch]);

  if (isFetching) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
        <LoaderCircle className="animate-spin size-5" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error && !data) {
    console.error("Error fetching messages:", error);

    if (error.response && error.response.status === 404) {
      return (
        <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
          <span>No Messages Found.</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
        <span>Error fetching messages. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="mt-auto">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <div key={message._id}>
            <p>{message.message}</p>
          </div>
        ))
      ) : (
        <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
          <span>No Messages Found.</span>
        </div>
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  );
};

export const ChatInput = () => {
  const { user, token } = useAuthContext();
  const { selectedRoom } = useSelectedRoom();
  const { dispatch: messageDispatch } = useMessageContext();
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      const response = await axiosInstance.post(
        `/messages/newMessage`,
        { roomId: selectedRoom.roomId, senderId: user._id, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        messageDispatch({
          type: "ADD_MESSAGE",
          payload: response.data,
        });
        setMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="relative bottom-0 pb-2 h-fit w-full drop-shadow-md">
      <div className="py-3 bg-slate-50 px-4 gap-5 flex items-center justify-between w-full rounded-lg">
        <div className="flex items-center text-neutral-800 gap-2">
          <Smile className="size-6" />
          <Paperclip className="size-6" />
        </div>
        <div className="w-full">
          <Textarea
            rows="1"
            placeholder="Chat away..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="resize-none text-md w-full shadow-sm"
          />
        </div>

        <button
          onClick={sendMessage}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 size-fit rounded-md"
        >
          <Send className="size-5 text-slate-200" />
        </button>
      </div>
    </div>
  );
};
