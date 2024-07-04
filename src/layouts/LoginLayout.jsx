import { Outlet } from "react-router-dom";

export const LoginLayout = () => {
  return (
    <div className="grid h-screen bg-slate-50 font-apercu grid-cols-2">
      <div className="col-span-1">
        <Outlet />
      </div>
      <div
        style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
        className="col-span-1 bg-cover bg-center size-full"
      ></div>
    </div>
  );
};
