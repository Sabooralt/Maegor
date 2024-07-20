import { useMessageContext } from "@/contexts/messageContext";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useMessages } from "@/hooks/useMessages";
import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import ScrollToBottom from "react-scroll-to-bottom";
import { MessageBox } from "./MessageBox";
import { useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";

export const ChatMessages = () => {
  const { selectedRoom } = useSelectedRoom();
  const { state } = useMessageContext();
  const messages = state[selectedRoom.roomId] || [];
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    shouldFetch,
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

  return (
    <div className="relative flex h-full w-full flex-col-reverse overflow-hidden">
      <ScrollToBottom
        initialScrollBehavior="smooth"
        scrollViewClassName="w-full h-full flex flex-col-reverse"
        className="h-full w-full"
      >
        <AnimatePresence mode="wait">
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
                  className={`px-5 py-3 ${message._id}`}
                >
                  <MessageBox msg={message} />
                </motion.div>
              ))
          ) : (
            <div className="flex h-full items-center justify-center gap-2 text-neutral-600">
              <span>No Messages Found.</span>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFetchingNextPage && (
            <motion.div
              initial={{ opacity: 0, y: "-100%" }}
              exit={{ opacity: 0, y: "-100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ease: "easeIn", }}
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
