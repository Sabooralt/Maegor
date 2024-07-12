import { Route, Routes } from "react-router-dom";
import { LoginLayout } from "./layouts/LoginLayout";
import { LoginForm } from "./pages/Login";
import { HomeLayout } from "./layouts/RootLayout";
import { SignupForm } from "./pages/Signup";

export const ClientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}></Route>
      <Route path="/auth" element={<LoginLayout />}>
        <Route path="/auth/signup" element={<SignupForm />} />
        <Route path="/auth/login" element={<LoginForm />} />
      </Route>
    </Routes>
  );
};
