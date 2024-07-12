import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "../Logo/Logo";

export const LoginLayout = () => {
  return (
    <div className="grid h-screen w-full relative overflow-hidden ">
      <div className="absolute top-5 left-7">
        <Logo size={45} text={true} svg={true} />
      </div>
      <div className="md:grid-cols-2 grid">
        <div className="col-span-1 font-apercu pt-10 w-full">
          <Outlet />
        </div>
        <div
          style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
          className="col-span-1 relative hidden md:grid place-items-start place-content-end bg-cover bg-center size-full"
        >
          <div className="flex flex-col relative top-5 lg:w-[70%] md:w-[80%] xl:w-[50%] justify-end gap-0 left-10">
            <div className="">
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, -1, 1, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                  ease: "easeInOut",
                }}
              >
                <img src="/SVGS/boat.svg" />
              </motion.div>
              <div className="relative bottom-4">
                <img src="/SVGS/waves.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
