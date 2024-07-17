import { Outlet } from "react-router-dom";
import { ChatSidebar } from "./components/chatsidebar";

export const Chat = () => {
  return (
    <div className=" w-full font-geist ">
      <div className="grid size-full grid-cols-12">
        <ChatSidebar />

        <Outlet />
      </div>
    </div>
  );
};
