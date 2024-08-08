import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./authContext";
import axiosInstance from "../utils/axiosInstance";
import { useRoomContext } from "./roomContext";

export const SelectedRoomContext = createContext();

export const SelectedRoomProvider = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { rooms } = useRoomContext();
  const { user, token } = useAuthContext();

  const selectRoom = async (roomId) => {
    const response = rooms.length > 0 && rooms.find((room) => roomId === room.roomId);
    setSelectedRoom(response);
  };

  const clearSelectedRoom = () => {
    setSelectedRoom(null);
  };

  return (
    <SelectedRoomContext.Provider
      value={{ selectedRoom, selectRoom, clearSelectedRoom }}
    >
      {children}
    </SelectedRoomContext.Provider>
  );
};

export const useSelectedRoom = () => {
  const context = useContext(SelectedRoomContext);

  if (!context) {
    throw Error("useSelectedRoom must be used inside a SelectedRoomProvider");
  }

  return context;
};
