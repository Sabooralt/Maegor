import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./contexts/authContext.jsx";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "./components/ui/toaster.jsx";
import "@fontsource/poppins";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SelectedRoomProvider } from "./contexts/selectRoomContext.jsx";
import { MessageContextProvider } from "./contexts/messageContext.jsx";
import { RoomContextProvider } from "./contexts/roomContext.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { TypingProvider } from "./contexts/typingContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RoomContextProvider>
        <SelectedRoomProvider>
          <MessageContextProvider>
            <Sonner closeButton richColors position="bottom-right" />
            <TooltipProvider>
              <QueryClientProvider client={queryClient}>
               {/*   <ReactQueryDevtools initialIsOpen={false} /> */}
                <TypingProvider>
                  <App />
                </TypingProvider>
              </QueryClientProvider>
            </TooltipProvider>
            <Toaster />
          </MessageContextProvider>
        </SelectedRoomProvider>
      </RoomContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
