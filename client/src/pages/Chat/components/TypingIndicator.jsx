import React from "react";
import { motion } from "framer-motion";

const TypingIndicator = () => {
  const dotAnimation = {
    start: {
      opacity: 0.2,
    },
    end: {
      opacity: 1,
    },
  };

  return (
    <div className="flex items-center">
      <motion.span
        className="h-2.5 w-2.5 rounded-full bg-neutral-950"
        variants={dotAnimation}
        initial="start"
        animate="end"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 0,
        }}
      />
      <motion.span
        className="mx-1.5 h-2.5 w-2.5 rounded-full bg-neutral-950"
        variants={dotAnimation}
        initial="start"
        animate="end"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 0.2,
        }}
      />
      <motion.span
        className="h-2.5 w-2.5 rounded-full bg-neutral-950"
        variants={dotAnimation}
        initial="start"
        animate="end"
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 0.4,
        }}
      />
    </div>
  );
};

export default TypingIndicator;
