// LoadingScreen.jsx
import React from "react";
import { motion, useAnimation } from "framer-motion";

const LoadingScreen = ({ onLoadingComplete }) => {
  const controls = useAnimation();

  const sequence = async () => {
    for (let i = 0; i < 6; i++) {
      await controls.start({
        opacity: 1,
        transition: { duration: 0.5 },
      });
      await controls.start({
        opacity: 0,
        transition: { duration: 0.5 },
      });
    }
    controls.start({
      opacity: 1,
      transition: { duration: 1 },
    });
    setTimeout(onLoadingComplete, 1000); // Adjust timing as needed
  };

  React.useEffect(() => {
    sequence();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center absolute inset-0  h-full bg-[#07011c] text-black"
    >
    
      <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="100"
      height="100"
      className="w-32 h-32 text-white"
      initial={{ opacity: 0 }}

      exit={{ opacity: 0 }}
    >
      <motion.path
        d="M10,90 L10,10 L40,60 L70,10 L70,90 L50,90 L50,40 L30,70 L10,40 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
    </motion.svg>
      
    </motion.div>
  );
};

export default LoadingScreen;
