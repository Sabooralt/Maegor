import { Route, Routes } from "react-router-dom";
import { LoginLayout } from "./layouts/LoginLayout";
import { LoginForm } from "./pages/Login";
import { HomeLayout } from "./layouts/RootLayout";

export const ClientRoutes = () => {
  return (
    <Routes>

        <Route path="/" element={<HomeLayout/>}></Route>
      <Route path="/auth" element={<LoginLayout />}>
        <Route path="/auth/login" element={<LoginForm />} />
      </Route>
    </Routes>
  );
};
