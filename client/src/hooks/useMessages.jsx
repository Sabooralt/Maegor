// useMessages.jsx
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/authContext";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useMessageContext } from "@/contexts/messageContext";

export const useMessages = (roomId) => {
  const { token } = useAuthContext();
  const { state, dispatch } = useMessageContext();
  const queryClient = useQueryClient();

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchedAfterMount,
    isFetching,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["messages", roomId],
    queryFn: fetchMessages,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });

  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    if (isFetchedAfterMount) {
      if (data) {
        const allMessages = data.pages.flatMap((page) => page.messages);
        dispatch({ type: "FETCH_MESSAGES", payload: allMessages, roomId });
      }
    }
  }, [data, dispatch, isFetchedAfterMount]);

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

  const addMessage = (newMessage) => {
    queryClient.setQueryData(["messages", roomId], (oldData) => {
      if (!oldData || !oldData.pages) {
        // Initialize the structure if it's not present
        return {
          pages: [{ messages: [newMessage] }],
          pageParams: [null],
        };
      }

      return {
        ...oldData,
        pages: oldData.pages.map((page, index) => {
          if (index === 0) {
            return { ...page, messages: [newMessage, ...page.messages] };
          }
          return page;
        }),
      };
    });
  };

  return {
    fetchNextPage,
    addMessage,
    shouldFetch,
    refetch,
    hasNextPage,
    isFetchingNextPage,
  };
};
