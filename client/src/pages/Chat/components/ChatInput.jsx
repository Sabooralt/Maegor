import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/contexts/authContext";
import { useMessageContext } from "@/contexts/messageContext";
import { useRoomContext } from "@/contexts/roomContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useMessages } from "@/hooks/useMessages";
import axiosInstance from "@/utils/axiosInstance";
import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ChatInput = () => {
  const { user, token } = useAuthContext();
  const { selectedRoom } = useSelectedRoom();
  const { dispatch: messageDispatch } = useMessageContext();
  const { addMessage } = useMessages();
  const { dispatch: roomDispatch } = useRoomContext();
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
      setMessage("");
      messageDispatch({
        type: "ADD_MESSAGE",
        payload: newMessage,
        roomId: selectedRoom.roomId,
      });
      roomDispatch({
        type: "UPDATE_LASTMSG",
        payload: newMessage,
      });

      const response = await axiosInstance.post(
        `/messages/newMessage`,
        { roomId: selectedRoom.roomId, senderId: user._id, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201) {
        const serverMessage = response.data;

        messageDispatch({
          type: "UPDATE_MESSAGE",
          payload: serverMessage,
          tempId: temporaryId,
          roomId: serverMessage.roomId,
        });
        roomDispatch({
          type: "UPDATE_LASTMSG",
          payload: serverMessage,
        });
      }
    } catch (error) {
      toast.error("Failed to send message", {
        description: error.message || "An unexpected error occurred", // Ensure only string is passed
      });
    }
  };

  return (
    <div className="relative bottom-0 h-fit w-full pb-2 drop-shadow-md">
      <div className="flex w-full items-center justify-between gap-5 rounded-lg bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 text-neutral-800">
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
            className="text-md w-full resize-none shadow-sm"
          />
        </div>
        <button
          onClick={sendMessage}
          className="size-fit rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2"
        >
          <Send className="size-5 text-slate-200" />
        </button>
      </div>
    </div>
  );
};
