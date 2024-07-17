import { Navigate, Route, Routes } from "react-router-dom";
import { LoginLayout } from "./layouts/LoginLayout";
import { LoginForm } from "./pages/Login";
import { HomeLayout } from "./layouts/RootLayout";
import { SignupForm } from "./pages/Signup";
import { VerifyEmail } from "./pages/VerifyEmail";
import { useAuthContext } from "./contexts/authContext";
import { Chat } from "./pages/Chat/Chat";
import { SelectChat } from "./pages/Chat/components/selectchat";
import { Chatting } from "./pages/Chat/components/chatting";

export const ClientRoutes = () => {
  const { user } = useAuthContext();
  return (
    <Routes>
      <Route
        path="/"
        element={
          user && user.verified ? <HomeLayout /> : <Navigate to="/auth/login" />
        }
      ></Route>

      <Route
        path="/auth"
        element={!user ? <LoginLayout /> : <Navigate to="/" />}
      >
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
      </Route>
      <Route
        path="/verify-email"
        element={user && user.verified ? <Navigate to="/" /> : <VerifyEmail />}
      />

      <Route
        path="/chat"
        element={
          user && user.verified ? <Chat /> : <Navigate to="/auth/login" />
        }
      >
        <Route index element={<SelectChat />} />
        <Route path="/chat/:roomId" element={<Chatting />} />
      </Route>
    </Routes>
  );
};
