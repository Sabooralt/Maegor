import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Logo } from "@/Logo/Logo";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LogoSvg } from "../components/ui/logoSvg";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { Check, Circle, X } from "lucide-react";
import { ReloadIcon } from "@radix-ui/react-icons";

export function SignupForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [usernameStatus, setUsernameStatus] = useState(null);
  const [username, setUsername] = useState(null);

  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const checkAvail = async () => {
      setLoading(null);
      setUsernameStatus(null);

      try {
        setLoading(true);
        if (debouncedUsername.trim() === "") {
          setLoading(false);
          return null;
        }

        const response = await axiosInstance.post("/user/checkUsername", {
          username: debouncedUsername,
        });

        if (response.status === 200) {
          setLoading(false);
          setUsernameStatus(response.data);
        }
      } catch (err) {
        setLoading(false);
        setUsernameStatus(err.response?.data);
      }
    };

    if (debouncedUsername) {
      checkAvail();
    }
  }, [debouncedUsername]);
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().trim().required("Username is required."),

      email: Yup.string()
        .trim()
        .matches(
          /^[\w.%+-]+@aptechgdn\.net$/,
          "Only @aptechgdn.net emails are accepted."
        )
        .required("Email is required."),

      password: Yup.string().trim().required("Password is required."),

      confirmPassword: Yup.string()
        .trim()
        .oneOf([Yup.ref("password"), null], "Passwords must match.")
        .required("Confirm Password is required."),
    }),
    onSubmit: async (data) => {
      try {
        const response = await axiosInstance.post("/user/signup", {
          username: data.username,
          email: data.email,
          password: data.password,
        });

        if (response.status === 201) {
          toast("Account Created!", {
            description: `Please Login!`,
            action: {
              label: "Login",
              onClick: () => navigate(`/auth/login`),
            },
          });
        }
      } catch (err) {
        if (err.response) {
          if (err.response.status === 400) {
            toast.error("An error occurred.", {
              description: err.response.data.message,
            });
          } else {
            toast.error("An error occurred. Please try again later.");
          }
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
      <div className="grid gap-0">
        <div className="grid gap-2">
          <h1 className="text-4xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-pink-500 to-purple-600">
            Sign Up
          </h1>

          <form onSubmit={formik.handleSubmit} className="grid gap-2">
            <div className="grid gap-2">
              <Label>Username</Label>
              <div className="grid gap-1">
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    formik.setFieldValue("username", e.target.value);
                  }}
                  className="input-styles"
                />

                <div className="flex-row flex w-full justify-between">
                  {username && (
                    <p
                      className={`text-xs flex flex-row order-last ${
                        loading
                          ? "text-gray"
                          : usernameStatus
                          ? usernameStatus.success
                            ? "text-green-500"
                            : "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {loading ? (
                        <>
                          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                          Please wait...
                        </>
                      ) : usernameStatus ? (
                        usernameStatus.success ? (
                          <>
                            <Check className="h-4 w-4" />
                            Username Available
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4" />
                            Username not available
                          </>
                        )
                      ) : null}
                    </p>
                  )}

                  {formik.touched.username && formik.errors.username ? (
                    <div className="text-xs  text-red-500">
                      {formik.errors.username}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
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
            <div className="grid gap-2">
              <Label>Confirm Password</Label>
              <div className="grid gap-1">
                <Input
                  {...formik.getFieldProps("confirmPassword")}
                  className="input-styles"
                  type="password"
                />
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-xs text-red-500">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-1 py-5">
              <Button
                disabled={
                  !formik.isValid ||
                  formik.isSubmitting ||
                  !formik.dirty ||
                  (usernameStatus && !usernameStatus.success) ||
                  loading
                }
                className="bg-gradient-to-r hover:to-[#BF29F0] text-base drop-shadow-md from-indigo-700 to-purple-700 text-white"
              >
                Sign Up
              </Button>

              <div className="mx-auto font-geist flex gap-1 font-normal">
                <p>Already have an account?</p>
                <Link
                  to="/auth/login"
                  className="underline underline-offset-4  text-indigo-800"
                >
                  Login
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
