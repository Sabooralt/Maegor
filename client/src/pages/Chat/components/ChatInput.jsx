import { Textarea } from "@/components/ui/textarea";
import { useAuthContext } from "@/contexts/authContext";
import { useMessageContext } from "@/contexts/messageContext";
import { useRoomContext } from "@/contexts/roomContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { socket } from "@/socket";
import axiosInstance from "@/utils/axiosInstance";
import { Paperclip, Send, Smile } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { debounce } from "lodash";
import EmojiPicker from "emoji-picker-react";

export const ChatInput = () => {
  const { selectedRoom } = useSelectedRoom();
  const { dispatch: messageDispatch } = useMessageContext();
  const { dispatch: roomDispatch } = useRoomContext();
  const { user, token } = useAuthContext();
  const roomId = useMemo(() => selectedRoom?.roomId, [selectedRoom]);
  const userId = useMemo(() => user?._id, [user]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  // Debounced function to emit stop typing event
  const emitStopTyping = useCallback(
    debounce(() => {
      setIsTyping(false);
      socket.emit("stop_typing", { roomId, userId });
    }, 1000),
    [roomId, userId],
  );

  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { roomId, userId });
    }
    emitStopTyping.cancel();
  }, [isTyping, roomId, userId, emitStopTyping]);

  const stopTyping = useCallback(() => {
    emitStopTyping();
  }, [emitStopTyping]);

  useEffect(() => {
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(stopTyping, 1000);
    }
    return () => {
      clearTimeout(typingTimeoutRef.current);
      emitStopTyping.cancel();
    };
  }, [isTyping, stopTyping, emitStopTyping]);

  const handleMessageChange = useCallback(
    (e) => {
      setMessage(e.target.value);
      if (e.target.value) {
        startTyping();
      } else {
        stopTyping();
      }
    },
    [startTyping, stopTyping],
  );

  const sendMessage = async () => {
    if (!message.trim()) return;

    socket.emit("stop_typing", { roomId, userId });

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

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiPickerRef]);
  return (
    <div className="relative bottom-0 h-fit w-full pb-2 drop-shadow-md">
      <div className="flex w-full items-center justify-between gap-5 rounded-lg bg-slate-50 px-4 py-3">
        <div className="flex items-center gap-2 text-neutral-800">
          <Smile
            className="size-6"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          />
          {showEmojiPicker && (
            <div
              ref={emojiPickerRef}
              className="absolute bottom-16"
            >
              <EmojiPicker emojiVersion="5.0" onEmojiClick={handleEmojiClick} />
            </div>
          )}
          <Paperclip className="size-6" />
        </div>
        <div className="w-full">
          <Textarea
            rows="1"
            placeholder="Chat away..."
            value={message}
            onChange={handleMessageChange}
            onKeyDown={(e) => {
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
          className="size-fit rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 disabled:cursor-not-allowed disabled:opacity-75"
          disabled={!message.trim()}
        >
          <Send className="size-5 text-slate-200" />
        </button>
      </div>
    </div>
  );
};
