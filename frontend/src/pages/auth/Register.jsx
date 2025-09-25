import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  UserRound,
  Upload,
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

import { uploadAvatar, registerUser } from "@/apis/auth";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const registerSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Enter a valid email address"),
  password: z.string().nonempty("Password is required"),
});

const Register = () => {
  const { login } = useAuthStore();
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  function toggleVisibility() {
    setIsVisible(!isVisible);
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target?.result);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  }

  async function onSubmit(data) {
    try {
      if (profileImage) {
        const response = await uploadAvatar(profileImage);
        data.avatar = response.data;
      }

      const response = await registerUser(data);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      login(user);
      navigate("/");
    } catch (error) {
      if (error?.response?.data) {
        form.setError("email", {
          type: "server",
          message: error?.response?.data?.message,
        });
      } else {
        console.error("Register error:", error);
      }
    }
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Start saving and stay on track.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <Avatar className="block size-22 mx-auto">
                <AvatarImage
                  src={preview}
                  alt="Profile"
                  className="size-full object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  <UserRound size={32} />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg">
                <Upload size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Click the icon to upload your photo
            </p>
          </div>

          <div className="grid gap-6">
            {/* Full name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="gap-2">
                  <FormLabel>Full Name</FormLabel>
                  <div className="relative">
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-4 peer-disabled:opacity-50">
                      <UserRound size={20} aria-hidden="true" />
                    </div>
                    <FormControl>
                      <Input
                        variant="lg"
                        placeholder="John Doe"
                        className="peer ps-12"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  Registering...
                </>
              ) : (
                <>
                  Register <ArrowRight className="size-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <p className="text-muted-foreground text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-primary underline">
          Login
        </Link>
      </p>
    </>
  );
};

export default Register;
