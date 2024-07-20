// useMessages.jsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/authContext";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useMessageContext } from "@/contexts/messageContext";

export const useMessages = (roomId) => {
  const { token } = useAuthContext();
  const { state, dispatch } = useMessageContext();

  const fetchMessages = async ({ pageParam }) => {
    const response = await axiosInstance.get(`/messages/${roomId}`, {
      params: { pageParam },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      messages: response.data.messages,
      nextOffset: response.data.hasMore ? pageParam + 1 : null,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching,refetch } =
    useInfiniteQuery({
      queryKey: ["messages", roomId],
      queryFn: fetchMessages,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextOffset,
      refetchIntervalInBackground: false,

      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (data) {
      const allMessages = data.pages.flatMap((page) => page.messages);
      dispatch({ type: "FETCH_MESSAGES", payload: allMessages, roomId });
      setShouldFetch(false);
    }
  }, [data, roomId, dispatch]);

  useEffect(() => {
    if (isFetching) {
      setShouldFetch(false);
    }
  }, [isFetchingNextPage, setShouldFetch]);

  useEffect(() => {
    const interval = setTimeout(() => {
      setShouldFetch(true);
    }, 2000);
  }, [shouldFetch, setShouldFetch]);

  return {
    fetchNextPage,
    shouldFetch,
    refetch,
    hasNextPage,
    isFetchingNextPage,
  };
};
