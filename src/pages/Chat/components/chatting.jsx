import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/contexts/authContext";
import { useMessageContext } from "@/contexts/messageContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useMessages } from "@/hooks/useMessages";
import { socket } from "@/socket";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Check, LoaderCircle, Paperclip, Send, Smile } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

export const Chatting = () => {
  const { roomId } = useParams();
  const { dispatch } = useMessageContext();
  const { selectedRoom, selectRoom } = useSelectedRoom();

  useEffect(() => {
    if (!selectedRoom) {
      selectRoom(roomId);
    }
  }, [roomId, selectedRoom]);

  if (!selectedRoom) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
        <LoaderCircle className="animate-spin size-5" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="md:col-span-10 relative flex flex-col rounded-xl col-span-9 h-screen w-full cube-track">
      <ChattingHeader selectedRoom={selectedRoom} />
      <ChatMessages />
      <ChatInput />
    </div>
  );
};

export const ChattingHeader = ({ selectedRoom }) => {
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

export const ChatMessages = () => {
  const { selectedRoom } = useSelectedRoom();

  const { state } = useMessageContext();

  const messages = state[selectedRoom.roomId] || [];
  const { fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useMessages(selectedRoom.roomId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-neutral-600 justify-center size-full">
        <LoaderCircle className="animate-spin size-5" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error && messages.length === 0) {
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
    <div className="relative w-full h-full overflow-hidden flex flex-col-reverse">
      <ScrollToBottom
        initialScrollBehavior="smooth"
        scrollViewClassName="w-full h-full flex flex-col-reverse"
        className="w-full h-full"
      >
        <AnimatePresence>
          {messages && messages.length > 0 ? (
            messages
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((message, index) => (
                <motion.div
                  key={message.messageId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`py-3 px-5 ${message._id}`}
                >
                  <MessageBox msg={message} />
                </motion.div>
              ))
          ) : (
            <div className="flex items-center gap-2 text-neutral-600 justify-center h-full">
              <span>No Messages Found.</span>
            </div>
          )}
        </AnimatePresence>

        <div>
          <button
            className="p-5 bg-neutral-900 text-white"
            onClick={() => {
              fetchNextPage();

              console.log(hasNextPage);
            }}
            disabled={!hasNextPage || isFetchingNextPage}
          >
            Load More
          </button>
        </div>
      </ScrollToBottom>
    </div>
  );
};

export const MessageBox = ({ msg }) => {
  const { user } = useAuthContext();
  const { selectedRoom } = useSelectedRoom();
  return (
    <div
      className={`relative w-fit max-w-lg flex flex-col gap-2 ${
        msg.senderId === user?._id ? "ml-auto" : "mr-auto"
      }`}
    >
      <div
        className={`flex flex-row gap-2 ${
          msg.senderId === user?._id ? "ml-auto" : "mr-auto"
        }`}
      >
        <div
          key={msg._id}
          className={`relative ${
            msg.message.length >= 54 ? "py-5" : "py-2"
          } w-fit rounded-lg text-white ${
            msg.senderId === user?._id
              ? "bg-neutral-900  rounded-br-none pl-5 pr-6"
              : "pr-5 rounded-bl-none pl-6 bg-gradient-to-r from-indigo-600 to-purple-600"
          }`}
        >
          <span className="text-lg">{msg.message}</span>
        </div>
        {msg.senderId === user?._id && (
          <div className="size-4 order-first mt-auto flex justify-center items-center rounded-full border-black border ">
            {msg.success && msg.success && <Check className="size-3" />}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center justify-between gap-2">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="bg-black size-6">
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
        <p className="text-neutral-800 text-xs">
          {format(new Date(msg.createdAt), "h:mm a")}
        </p>
      </div>
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

    const temporaryId = Date.now();
    const newMessage = {
      _id: temporaryId,
      roomId: selectedRoom.roomId,
      senderId: user._id,
      message,
      createdAt: temporaryId,
      success: false,
      messageId: temporaryId,
    };

    try {
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: newMessage,
        roomId: selectedRoom.roomId,
      });
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
        const serverMessage = response.data;

        messageDispatch({
          type: "UPDATE_MESSAGE",
          payload: serverMessage,
          tempId: temporaryId,
          roomId: serverMessage.roomId,
        });
      }
    } catch (error) {
      toast.error("Failed to send message:", {
        description: error,
      });
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
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
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
