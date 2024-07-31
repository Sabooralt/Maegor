import { useMessageContext } from "@/contexts/messageContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useMessages } from "@/hooks/useMessages";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageBox } from "./MessageBox";

import { format, isSameDay } from "date-fns";
import { useEffect } from "react";

export const ChatMessages = () => {
  const { selectedRoom } = useSelectedRoom();
  const { state } = useMessageContext();
  const messages = state[selectedRoom.roomId] || [];
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    shouldFetch,
    refetch,
    isLoading,
    error,
  } = useMessages(selectedRoom.roomId);

  if (isLoading) {
    return (
      <div className="flex size-full items-center justify-center gap-2 text-neutral-600">
        <LoaderCircle className="size-5 animate-spin" />
        <span>Loading...</span>
      </div>
    );
  }

  if (error && messages.length === 0) {
    if (error.response && error.response.status === 404) {
      return (
        <div className="flex size-full items-center justify-center gap-2 text-neutral-600">
          <span>No Messages Found.</span>
        </div>
      );
    }

    return (
      <div className="flex size-full items-center justify-center gap-2 text-neutral-600">
        <span>Error fetching messages. Please try again.</span>
      </div>
    );
  }
  const formatMessageDate = (date) => {
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <div className="relative flex h-full w-full flex-col-reverse overflow-hidden">
      <ScrollToBottom
        initialScrollBehavior="smooth"
        scrollViewClassName="w-full h-full flex flex-col-reverse"
        className="h-full w-full"
      >
        {messages && messages.length > 0 ? (
          messages
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((message, index) => {
              const showDate =
                index === 0 ||
                !isSameDay(
                  new Date(messages[index - 1].createdAt),
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

        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              exit={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeIn" }}
              className="absolute left-0 right-0 top-0 flex translate-x-[10rem] items-center justify-center py-4"
            >
              <div className="flex w-fit items-center gap-2 rounded-full bg-black px-5 py-3 text-white">
                <LoaderCircle className="size-5 animate-spin" />
                <span>Loading messages...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
