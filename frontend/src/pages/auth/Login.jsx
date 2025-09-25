import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "react-toastify";

import {
  Mail,
  Key,
  EyeIcon,
  EyeOffIcon,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import useAuthStore from "@/stores/authStore";

import { loginUser } from "@/apis/auth";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleLogin from "@/components/partials/GoogleLogin";
import { useTheme } from "@/context/themeContext";

const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email address"),
  password: z.string().nonempty("Password is required"),
});

export default function Login() {
  const { login } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function toggleVisibility() {
    setIsVisible(!isVisible);
  }

  async function onSubmit(data) {
    try {
      const response = await loginUser(data);
      const { user, token } = response.data;

      toast.success("Login successfull.");
      localStorage.setItem("token", token);
      login(user);
      navigate("/");
    } catch (error) {
      if (error?.response?.data) {
        form.setError("email", {
          type: "server",
          message: "Invalid email address.",
        });
        form.setError("password", {
          type: "server",
          message: "Invalid password.",
        });
      } else {
        toast.error("Login failed, Please try again.");
        console.error("Login error:", error);
      }
    }
  }

  return (
    <GoogleAuthProvider>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Continue your journey toward your goals.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
          <GoogleLogin />

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Email</FormLabel>
                <div className="relative">
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
                    <Mail size={20} aria-hidden="true" />
                  </div>
                  <FormControl>
                    <Input
                      type="email"
                      variant="lg"
                      placeholder="john@example.com"
                      className="peer ps-12"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="gap-2">
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
                    <Key size={20} aria-hidden="true" />
                  </div>
                  <FormControl>
                    <Input
                      variant="lg"
                      placeholder="************"
                      className="peer ps-12"
                      type={isVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-12 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeOffIcon size={20} aria-hidden="true" />
                    ) : (
                      <EyeIcon size={20} aria-hidden="true" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <LoaderCircle className="animate-spin size-5" />
                Logging in...
              </>
            ) : (
              <>
                Login <ArrowRight className="size-5" />
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-muted-foreground text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary underline">
          Register
        </Link>
      </p>
    </GoogleAuthProvider>
  );
}

const GoogleAuthProvider = ({ children }) => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIEND_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
};
