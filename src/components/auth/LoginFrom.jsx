"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    setFormError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        // Redirect based on user role
        navigate(result.isAdmin ? "/admin/dashboard" : "/dashboard");
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (error) {
      setFormError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Left Section - Branding (hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-center bg-primary/10 p-10 lg:flex">
        <div className="mx-auto max-w-md">
          <img
            src="/CodingClubLogoSmall.png"
            alt="Logo"
            className="mb-8 w-32"
          />

          <h1 className="mb-2 text-4xl font-bold text-primary">Welcome Back</h1>
          <p className="mb-6 text-xl text-slate-600 dark:text-slate-300">
            Sign in to continue to your creative universe
          </p>

          <div className="mt-10 rounded-xl bg-white/30 p-6 backdrop-blur-sm dark:bg-slate-800/30">
            <p className="text-slate-700 dark:text-slate-300">
              "Unlock your creative potential with our powerful tools and
              resources. Join our community of innovators and bring your ideas
              to life."
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex w-full flex-1 items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <img
              src="/CodingClubLogoSmall.png"
              alt="Logo"
              className="mb-4 w-24"
            />
            <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
          </div>

          <div className="rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
            <h2 className="mb-6 text-2xl font-semibold text-slate-800 dark:text-white">
              Sign in to your account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="rememberMe" className="text-sm">
                    Remember me
                  </Label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error message */}
              {formError && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {formError}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="mt-6 text-center text-sm">
              <p>
                {`Don't have an account? `}
                <Link
                  to="/signup"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
