import { useReducer, createContext, useContext, useEffect } from "react";
import { socket } from "@/socket";
import { toast } from "sonner";
import { useSelectedRoom } from "./selectRoomContext";

export const MessageContext = createContext();

export const messageReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES":
      console.log("Fetching messages...");
      return {
        ...state,
        [action.roomId]: action.payload,
      };
    case "ADD_MESSAGE":
      console.log("Add Message...");

      return {
        ...state,
        [action.roomId]: state[action.roomId]
          ? [action.payload, ...state[action.roomId]]
          : [action.payload],
      };
    case "UPDATE_MESSAGE":
      console.log("Update Message...");
      return {
        ...state,
        [action.roomId]: state[action.roomId].map((message) =>
          message._id === action.tempId
            ? { ...message, ...action.payload, messageId: action.tempId }
            : message,
        ),
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        [action.roomId]: [],
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
    error: null,
  };

  const [state, dispatch] = useReducer(messageReducer, initialState);

  useEffect(() => {
    const newMessage = (data) => {
      if (selectedRoom.roomId === data.roomId) {
        dispatch({ type: "ADD_MESSAGE", payload: data, roomId: data.roomId });
        toast("You have a new message");
      }
    };

    socket.on("newMessage", newMessage);

    return () => {
      socket.off("newMessage", newMessage);
    };
  }, [selectedRoom]);

  console.log("MessageContextProvider:", state);

  return (
    <MessageContext.Provider value={{ state, dispatch }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw Error(
      "useMessageContext must be used inside a MessageContextProvider",
    );
  }
  return context;
};
