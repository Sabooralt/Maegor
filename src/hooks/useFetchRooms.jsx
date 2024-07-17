import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const fetchRooms = async (userId, roomType) => {
  const { data } = await axiosInstance.get(`/rooms/${userId}/${roomType}`);
  return data;
};

export const useAnonymousRooms = (userId) => {
  return useQuery({
    queryKey: ["anonymousRooms", userId, "anonymous"],
    queryFn: fetchRooms,
    enabled: !!userId,
  });
};

export const useGroupRooms = (userId) => {
  return useQuery({
    queryKey: ["groupRooms", userId, "group"],
    queryFn: fetchRooms,
    enabled: !!userId,
  });
};

export const useFriendRooms = (userId) => {
  return useQuery({
    queryKey: ["friendRooms", userId, "friend"],
    queryFn: fetchRooms,
    enabled: !!userId,
  });
};
