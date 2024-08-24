import { useMessageContext } from "@/contexts/messageContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useMessages } from "@/hooks/useMessages";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageBox } from "./MessageBox";
import { format, isSameDay } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TypingIndicator from "./TypingIndicator";
import { useState, useMemo } from "react";
import { useTyping } from "@/contexts/typingContext";
import { LoadingMessages } from "./LoadingMessages";
import { SeenByAndTypingIndicator } from "./seenBy_Typing";

export const ChatMessages = () => {
  const { selectedRoom } = useSelectedRoom();
  const { state } = useMessageContext();
  const { typingStatus } = useTyping();
  const [toggle, setToggle] = useState(false);

  const messages = useMemo(
    () => state[selectedRoom.roomId] || [],
    [state, selectedRoom.roomId],
  );
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    shouldFetch,
    isLoading,
    error,
  } = useMessages(selectedRoom.roomId);

  const sortedMessages = useMemo(
    () =>
      messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [messages],
  );

  const formatMessageDate = useMemo(
    () => (date) => format(new Date(date), "MMM d, yyyy"),
    [],
  );

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center gap-2 text-neutral-600">
        <LoaderCircle className="size-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex size-full items-center justify-center gap-2 text-neutral-600">
        <span>
          {error.response?.status === 404
            ? "No Messages Found."
            : "Error fetching messages. Please try again."}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col-reverse overflow-hidden">
      <ScrollToBottom
        initialScrollBehavior="smooth"
        scrollViewClassName="w-full h-full flex flex-col-reverse"
        className="h-full w-full"
        followButtonClassName="hidden"
      >
        {sortedMessages.length > 0 ? (
          sortedMessages.map((message, index) => {
            const showDate =
              index === 0 ||
              !isSameDay(
                new Date(sortedMessages[index - 1].createdAt),
                new Date(message.createdAt),
              );
            return (
              <div key={message.messageId}>
                {showDate && (
                  <div className="my-2 text-center text-sm text-neutral-500">
                    {formatMessageDate(message.createdAt)}
                  </div>
                )}
                <div className={`px-5 py-3 ${message._id}`}>
                  <MessageBox msg={message} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center gap-2 text-neutral-600">
            <span>No Messages Found.</span>
          </div>
        )}

        <button onClick={() => setToggle(!toggle)} className="bg-white p-5">
          Click me
        </button>

        <SeenByAndTypingIndicator />

        <LoadingMessages isFetchingNextPage={isFetchingNextPage} />

        {shouldFetch && hasNextPage && !isFetchingNextPage && (
          <motion.div
            whileInView={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
          />
        )}
      </ScrollToBottom>
    </div>
  );
};
