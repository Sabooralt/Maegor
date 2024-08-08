import { socket } from "@/socket";
import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const TypingContext = createContext();

export const TypingProvider = ({ children }) => {
  const [typingStatus, setTypingStatus] = useState({}); 
 

  useEffect(() => {
    socket.on("user_typing", ({ roomId }) => {
      setTypingStatus((prevStatus) => ({ ...prevStatus, [roomId]: true }));
    });

    socket.on("user_stop_typing", ({ roomId }) => {
      setTypingStatus((prevStatus) => ({ ...prevStatus, [roomId]: false }));
    });

    
    return () => {
      socket.off("user_typing");
      socket.off("user_stop_typing");
    };
  }, [socket]);

  return (
    <TypingContext.Provider value={{ typingStatus }}>
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => useContext(TypingContext);
