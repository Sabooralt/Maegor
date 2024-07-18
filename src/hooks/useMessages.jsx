// useMessages.jsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/authContext";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect } from "react";
import { useMessageContext } from "@/contexts/messageContext";

export const useMessages = (roomId) => {
  const { token } = useAuthContext();
  const { state, dispatch } = useMessageContext();

  const fetchMessages = async ({ pageParam = 0 }) => {
    const response = await axiosInstance.get(`/messages/${roomId}`, {
      params: { offset: pageParam },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      messages: response.data.messages,
      nextOffset: response.data.messages.length ? pageParam + 10 : null,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["messages", roomId],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage.nextOffset || null,
      cacheTime: 1000 * 60 * 10,
    });

  useEffect(() => {
    if (data) {
      const allMessages = data.pages.flatMap((page) => page.messages);

      const uniqueMessages = Array.from(
        new Set(allMessages.map((message) => message._id))
      ).map((id) => allMessages.find((message) => message._id === id));

      dispatch({ type: "FETCH_MESSAGES", payload: uniqueMessages, roomId });
    }
  }, [data, roomId, dispatch]);

  useEffect(() => {
    const cachedData = state[roomId];
    if (cachedData && cachedData.length > 0) {
      dispatch({ type: "FETCH_MESSAGES", payload: cachedData, roomId });
    }
  }, [state[roomId], roomId, dispatch]);

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
