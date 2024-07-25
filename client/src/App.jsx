import { BrowserRouter } from "react-router-dom";
import { ClientRoutes } from "./routes";
import { useEffect, useState } from "react";
import { useAuthContext } from "./contexts/authContext";
import { socket } from "./socket";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
function App() {
  const { user } = useAuthContext();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasAlerted, setHasAlerted] = useState(true);
  useEffect(() => {
    if (user) {
      socket.emit("register", { role: user.role, userId: user._id });
    }
  }, [user, socket]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setHasAlerted(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  useEffect(() => {
    if (!isOnline) {
      toast.error("You have lost your internet connection.", {
        position: "top-center",
      });
    } else if (isOnline && !hasAlerted) {
      toast.dismiss();
      toast.success("You are back online.", {
        position: "top-center",
      });
    }
  }, [isOnline]);
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
