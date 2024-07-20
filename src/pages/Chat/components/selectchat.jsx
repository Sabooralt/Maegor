import { BackgroundBeams } from "@/components/ui/background-beams";
import { AnimatePresence, motion } from "framer-motion";

export const SelectChat = () => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="selectChat" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0, }}
        transition={{ ease: "circInOut", duration: 0.5 }} 
        className="relative flex h-[100dvh] w-full flex-col items-center justify-center rounded-md bg-neutral-950 antialiased"
      >
        <div className="mx-auto max-w-4xl p-4">
          <h1 className="relative z-10 bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-center font-geist text-lg font-bold text-transparent md:text-5xl lg:text-6xl  xl:text-7xl">
            Welcome! Select a chat to start messaging.
          </h1>

          <p className="relative z-10 mx-auto my-2 max-w-lg text-center text-sm text-neutral-500">
            Choose a chat room from the list on the left.
          </p>
          <input
            type="text"
            placeholder="hi@manuarora.in"
            className="relative z-10 mt-4 w-full text-neutral-500 rounded-lg border border-neutral-800 bg-neutral-950 placeholder:text-neutral-700 focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <BackgroundBeams />
      </motion.div>
    </AnimatePresence>
  );
};
