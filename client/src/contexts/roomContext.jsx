import { useReducer, createContext, useContext } from "react";

export const RoomContext = createContext();

export const roomReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ROOMS":
      return {
        ...state,
        rooms: action.payload,
      };
    case "UPDATE_LASTMSG":
      return {
        ...state,
        rooms: state.rooms.map((room) => {
          if (room.roomId === action.payload.roomId) {
            return {
              ...room,
              lastMessage: action.payload,
            };
          }
          return room;
        }),
      };
    default:
      return state;
  }
};

export const RoomContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomReducer, {
    rooms: [],
   
  });

  console.log("RoomContext state: ", state);
  return (
    <RoomContext.Provider value={{ ...state, dispatch }}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw Error("useRoomContext must be used inside RoomContextProvider");
  }
  return context;
};
