import { useEffect, useRef } from "react";
import { socket } from "@/socket";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/authContext";

export const useAnonymousSocketEvents = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const toastId = useRef(null);

  const queryClient = useQueryClient();
  useEffect(() => {
    const handleWaitingRoomCount = (count) => {};

    const handleRoomJoined = (data) => {
      if (toastId.current) {
        toast.dismiss(toastId.current);
      }
      toast.success("Successfully joined room with a user", {
        description: `Redirected you to the room!`,
      });

      queryClient.setQueryData(["anonymousRoom"], (oldData) => {
        return [...(oldData || []), data];
      });
      const navigateTimeout = setTimeout(() => {
        navigate(`/chat/${data.roomId}`);
      }, 1000);

      return () => clearTimeout(navigateTimeout);
    };

    const handleWaitingRoomJoined = (msg) => {
      toastId.current = toast.loading(msg, {
        description: "Looking for a user to connect please wait...",
        action: {
          label: "Cancel",
          onClick: leaveWatingRoom,
        },
        closeButton: false,
      });
    };
    const handleAlreadyInWaitingRoom = (message) => {
      toast.info(message);
    };

    const handleAlreadyPaired = (message) => {
      toast.error(message);
    };

    socket.on("waiting_room_count", handleWaitingRoomCount);
    socket.on("room_joined", handleRoomJoined);
    socket.on("already_in_waiting_room", handleAlreadyInWaitingRoom);
    socket.on("already_paired", handleAlreadyPaired);
    socket.on("waiting_room_joined", handleWaitingRoomJoined);

    return () => {
      socket.off("waiting_room_count", handleWaitingRoomCount);
      socket.off("room_joined", handleRoomJoined);
      socket.off("already_in_waiting_room", handleAlreadyInWaitingRoom);
      socket.off("already_paired", handleAlreadyPaired);
      socket.off("waiting_room_joined", handleWaitingRoomJoined);
    };
  }, [navigate, socket]);

  const leaveWatingRoom = () => {
    if (user && user._id) {
      toast.dismiss();
      socket.emit("leave_waiting_room", user._id);
    }
  };
};
