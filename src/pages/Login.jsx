import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export function LoginForm() {
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email format")
        .required("Email is required."),

      password: Yup.string().trim().required("Password is required."),
    }),
    onSubmit: (data) => {
      console.log(data);
    },
  });

  return (
    <div className="size-full grid place-items-center">
      <div className="">
        <div className="font-semibold font-sans text-3xl uppercase">Maegor</div>
      </div>
    </div>
  );
}
