import { useInfiniteQuery } from "@tanstack/react-query";

import { useAuthContext } from "@/contexts/authContext";
import axiosInstance from "@/utils/axiosInstance";

export const useMessages = (roomId) => {
  const { token } = useAuthContext();

  const fetchMessages = async ({ pageParam = 0 }) => {
    const response = await axiosInstance.get(`/messages/${roomId}`, {
      params: { offset: pageParam },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      messages: response.data,
      nextOffset: response.data.length ? pageParam + 10 : null,
    };
  };

  return useInfiniteQuery({
    queryKey: ["messages", roomId],
    queryFn: fetchMessages,

    retry: (failureCount, error) => {
      if (error.response && error.response.status === 404) {
        return false;
      }
      if (failureCount < 3) {
        return true;
      }
      return false;
    },

    getNextPageParam: (lastPage, pages) => lastPage.nextOffset || null,
  });
};
