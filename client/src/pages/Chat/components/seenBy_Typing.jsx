import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelectedRoom } from "@/contexts/selectRoomContext";
import { useTyping } from "@/contexts/typingContext";
import { AnimatePresence, motion } from "framer-motion";
import TypingIndicator from "./TypingIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const SeenByAndTypingIndicator = () => {
  const { selectedRoom } = useSelectedRoom();
  const { typingStatus } = useTyping();
  return (
    <div className="order-first flex flex-row justify-between px-5">
      <AnimatePresence>
        {selectedRoom.lastMessage.seenBy.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: "100%" }}
                exit={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ease: "easeIn" }}
                className="ml-auto flex items-center gap-2 py-2"
              >
                <div className="flex items-center -space-x-2">
                  <AnimatePresence mode="wait">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      exit={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ease: "backInOut", duration: 0.3 }}
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            selectedRoom.roomType === "anonymous"
                              ? "/images/A_Avatar.png"
                              : selectedRoom.members.profilePicture
                          }
                          alt="@shadcn"
                          className="size-6 bg-green-800"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>{`${selectedRoom.roomType === "anonymous" ? "Seen" : `Seen By ${selectedRoom.members.username}`}`}</TooltipContent>
          </Tooltip>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {typingStatus[selectedRoom.roomId] && (
          <motion.div
            initial={{ opacity: 0, y: "100%" }}
            exit={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeIn" }}
            className="absolute -bottom-3 left-3 flex items-center justify-center gap-2 py-4"
          >
            <div className="flex items-center -space-x-2">
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  exit={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: "backInOut", duration: 0.3 }}
                >
                  <Avatar>
                    <AvatarImage
                      src={
                        selectedRoom.roomType === "anonymous"
                          ? "/images/A_Avatar.png"
                          : selectedRoom.members.profilePicture
                      }
                      alt="@shadcn"
                      className="size-6 bg-green-800"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </motion.div>

                <Avatar>
                  <AvatarImage
                    src={
                      selectedRoom.roomType === "anonymous"
                        ? "/images/A_Avatar.png"
                        : selectedRoom.members.profilePicture
                          ? selectedRoom.members.profilePicture
                          : "/images/A_Avatar.png"
                    }
                    alt="@shadcn"
                    className="size-6 bg-black"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </AnimatePresence>
            </div>
            <TypingIndicator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
