import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/authContext";
import { Logo } from "../Logo/Logo";

export const VerifyEmail = () => {
  const [value, setValue] = useState("");
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, canResend, setCanResend]);

  const handleResendClick = async () => {
    try {
      if (timer > 0) {
        return null;
      }

      const response = await axiosInstance.post("/user/send-otc", {
        email: user.email,
      });

      if (response.status === 200) {
        toast(response.data.message);
        setTimer(60);
        setCanResend(false);
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
  };
  const submitOtp = async () => {
    try {
      const response = await axiosInstance.post("/user/verify-email", {
        otp: value,
        email: user.email,
      });

      if (response.status === 200) {
        toast.success("Email Verified Successfully!");

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.verified = true;
          localStorage.setItem("user", JSON.stringify(user));
        }
        navigate("/");
      }
    } catch (err) {
      if (err.response) {
        toast.error("An error occurred.", {
          description: err.response.data.message,
        });
      } else if (err.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`;
  };

  return (
    <div className="h-screen w-full relative font-geist">
      <div className="size-fit relative top-5 left-5">
        <Logo size={50} />
      </div>
      <div className="grid gap-5 w-fit py-10  mx-auto place-items-center">
        <div className="size-52">
          <img src="/images/verify-email.png" />
        </div>

        <h1 className="text-4xl font-semibold text-center text-neutral-900">
          OTP Verification
        </h1>

        <p className="text-center">
          One Time Password (OTP) has been sent via Email to <br />
          <span className="font-semibold">{user && user.email}</span>
        </p>
        <p>Enter the otp below to verify it.</p>

        <div className="size-fit grid gap-1 relative">
          <InputOTP maxLength={6} value={value} onChange={(e) => setValue(e)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <div className="text-xs relative ml-auto size-fit">
            {canResend ? (
              <button
                disabled={!canResend}
                className="font-semibold"
                onClick={handleResendClick}
              >
                Resend OTP
              </button>
            ) : (
              <>
                <span className="text-neutral-600">Resend OTP in:</span>{" "}
                <span>{formatTime(timer)}</span>
              </>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
          disabled={value.length !== 6}
          onClick={submitOtp}
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
};
