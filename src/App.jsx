import { BrowserRouter } from "react-router-dom";
import { ClientRoutes } from "./routes";
import { useEffect } from "react";
import { useAuthContext } from "./contexts/authContext";
import { socket } from "./socket";
import { AnimatePresence } from "framer-motion";
function App() {
  const { user } = useAuthContext();
  useEffect(() => {
    if (user) {
      socket.emit("register", { role: user.role, userId: user._id });
    }
  }, [user, socket]);
  return (
    <div>
      <BrowserRouter>
      <AnimatePresence mode="wait">
        <ClientRoutes />
</AnimatePresence>
      </BrowserRouter>
    </div>
  );
}

export default App;
