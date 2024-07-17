import { useEffect, useReducer, createContext, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";

export const MessageContext = createContext();

export const messageReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_MESSAGES":
      return {
        ...state,
        messages: action.payload.messages,
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
  const initialState = {
    messages: [],
    error: null,
  };

  const [state, dispatch] = useReducer(messageReducer, initialState);

 
  console.log("MessageContext state: ", state);

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
