import { useReducer, createContext, useContext, useEffect } from "react";
import { socket } from "@/socket";
import { toast } from "sonner";
import { useSelectedRoom } from "./selectRoomContext";

export const MessageContext = createContext();

export const messageReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };

    case "ADD_MESSAGE":
      return {
        ...state,
        messages: state.messages
          ? [action.payload, ...state.messages]
          : [action.payload],
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: null,
      };
    case "FETCH_MESSAGES_ERROR":
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

export const MessageContextProvider = ({ children }) => {
  const { selectedRoom } = useSelectedRoom();
  const initialState = {
    messages: [],
    error: null,
  };

  const [state, dispatch] = useReducer(messageReducer, initialState);

  console.log("MessageContext state: ", state);

  useEffect(() => {
    const newMessage = (data) => {
      if (selectedRoom?.roomId === data.roomId) {
        dispatch({ type: "ADD_MESSAGE", payload: data });
        toast("You have a new message");
      }
    };

    socket.on("newMessage", newMessage);

    return () => {
      socket.off("newMessage", newMessage);
    };
  }, [socket]);

  return (
    <MessageContext.Provider value={{ ...state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw Error(
      "useMessageContext must be used inside a MessageContextProvider"
    );
  }

  return context;
};
