import { Outlet } from "react-router-dom";
import { ChatSidebar } from "./components/chatsidebar";

export const Chat = () => {
  return (
    <div className="w-full font-geist">
      <div className="flex size-full flex-row">
        <div>
          <ChatSidebar />
        </div>

        <Outlet />
      </div>
    </div>
  );
};
