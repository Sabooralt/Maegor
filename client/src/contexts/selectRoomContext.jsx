import { createContext, useContext, useState } from "react";
import { useAuthContext } from "./authContext";
import axiosInstance from "../utils/axiosInstance";

export const SelectedRoomContext = createContext();

export const SelectedRoomProvider = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { user, token } = useAuthContext();

  const selectRoom = async (roomId) => {
    try {
      const response = await axiosInstance.get(`/rooms/${roomId}/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSelectedRoom(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch room details:", error);
    }
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
