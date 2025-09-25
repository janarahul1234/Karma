import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { LoaderCircle } from "lucide-react";
import { toast } from "react-toastify";

import useAuthStore from "@/stores/authStore";

import { googleAuth } from "@/apis/auth";

import GoogleIcon from "@/assets/images/google-icon.svg";
import { Button } from "@/components/ui/button";

export default function GoogleLogin() {
  const { login } = useAuthStore();
  const [isConnectingToGoogle, setIsConnectingToGoogle] = useState(false);

  const navigate = useNavigate();

  async function responseGoogle(res) {
    setIsConnectingToGoogle(true);

    try {
      const response = await googleAuth(res.code);
      const { user, token } = response.data;

      toast.success("Login successfully.");
      localStorage.setItem("token", token);
      login(user);
      navigate("/");
    } catch (error) {
      toast.error("Google login failed, Please try again.");
      console.error("Google login error:", error);
    } finally {
      setIsConnectingToGoogle(false);
    }
  }

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <Button
      size="lg"
      variant="outline"
      type="button"
      className="w-full gap-2"
      onClick={googleLogin}
      disabled={isConnectingToGoogle}
    >
      {isConnectingToGoogle ? (
        <>
          <LoaderCircle className="animate-spin size-5" />
          Connecting to Google...
        </>
      ) : (
        <>
          <img src={GoogleIcon} alt="google" className="size-5" />
          Login with Google
        </>
      )}
    </Button>
  );
}
