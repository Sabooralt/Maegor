import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/contexts/authContext";
import { useMessageContext } from "@/contexts/messageContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import axiosInstance from "@/utils/axiosInstance";
import { Paperclip, Send, Smile } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
