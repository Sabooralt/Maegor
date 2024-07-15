import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFormik } from "formik";
import * as Yup from "yup";
import { LogoSvg } from "../components/ui/logoSvg";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuthContext } from "../contexts/authContext";

export function LoginForm() {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .matches(
          /^[\w.%+-]+@aptechgdn\.net$/,
          "Only @aptechgdn.net emails are accepted."
        )
        .required("Email is required."),

      password: Yup.string().trim().required("Password is required."),
    }),
    onSubmit: async (data) => {
      try {
        const response = await axiosInstance.post("/user/login", {
          email: data.email,
          password: data.password,
        });

        if (response.status === 200) {
          if (response.data.user.verified == false) {
            dispatch({
              type: "LOGIN",
              payload: { ...response.data.user, token: response.data.token },
            });
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...response.data.user,
                token: response.data.token,
              })
            );
            navigate("/verify-email");
          } else {
            toast("Logged In Successfully!");
            dispatch({
              type: "LOGIN",
              payload: { ...response.data.user, token: response.data.token },
            });
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...response.data.user,
                token: response.data.token,
              })
            );

            setTimeout(() => {
              navigate("/");
            }, 1000);
          }
        }
      } catch (err) {
        if (err.response) {
          toast.error("An error occurred.", {
            description: err.response.data.message,
          });
        } else if (err.request) {
          toast.error(
            "No response received. Please check your internet connection."
          );
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    },
  });
  return (
    <div className="grid pt-20 pb-3 size-full px-10 lg:px-20 xl:px-32">
      <div className="grid gap-0 w-full">
        <div className="grid">
          <h1 className="text-4xl size-fit font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Login
          </h1>

          <form onSubmit={formik.handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <div className="grid gap-1">
                <Input
                  {...formik.getFieldProps("email")}
                  className="input-styles"
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-xs text-red-500">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Password</Label>
              <div className="grid gap-1">
                <Input
                  {...formik.getFieldProps("password")}
                  className="input-styles"
                  type="password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-xs text-red-500">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="text-indigo-800 hover:underline size-fit cursor-pointer font-medium">
              Forgot password?
            </div>

            <div className="gap-1 grid">
              <Button
                disabled={
                  !formik.isValid || formik.isSubmitting || !formik.dirty
                }
                className="bg-gradient-to-r hover:to-[#BF29F0] flex gap-2 items-center text-base drop-shadow-md from-indigo-700 to-purple-700 text-white"
              >
                {formik.isSubmitting && <ReloadIcon className="animate-spin" />}
                Login
              </Button>

              <div className="mx-auto font-geist flex gap-1 font-normal">
                <p>Don't have an account?</p>
                <Link
                  to="/auth/signup"
                  className="underline underline-offset-4   text-indigo-800"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex mt-auto mx-auto opacity-50 flex-col  items-center justify-center">
        <LogoSvg />

        <small>
          © 2024 Maegor | Developed by{" "}
          <a className="underline" href="https://saboordev.netlify.app/">
            Saboor
          </a>
        </small>
      </div>
    </div>
  );
}
