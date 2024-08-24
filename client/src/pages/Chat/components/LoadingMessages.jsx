import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

export const LoadingMessages = ({ isFetchingNextPage }) => {
  return (
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
  );
};
