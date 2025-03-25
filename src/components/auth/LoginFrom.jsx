import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    // Validate form inputs
    if (!email || !password) {
      setFormError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await login(email, password);

      if (result.success) {
        // Store email in localStorage if remember me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Show role-specific success message
        if (result.isAdmin) {
          toast({
            title: "Admin Login Successful",
            description: "to the admin dashboard",
            variant: "success",
          });
          // Redirect admin to admin dashboard
          navigate("/admin/dashboard");
        } else {
          toast({
            title: "Login Successful",
            description: "Welcome back to Code Crusaders",
            variant: "success",
          });
          // Redirect regular user to the user dashboard
          navigate("/user/dashboard");
        }
      } else {
        setFormError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setFormError("An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Section - Branding (hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-center bg-blue-600/10 p-10 lg:flex">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex items-center gap-2 font-semibold">
            <code className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
              <img src="/image/CodingClubLogoSmall.png" alt="logo" />
            </code>
            <span className="text-xl">Code Crusaders</span>
          </div>

          <h1 className="mb-2 text-4xl font-bold text-blue-600">
            Welcome Back
          </h1>
          <p className="mb-6 text-xl text-slate-600">
            Sign in to continue to your creative universe
          </p>

          <div className="mt-10 rounded-xl bg-white/30 p-6 backdrop-blur-sm">
            <p className="text-slate-700">
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
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <code className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
                <img src="/image/CodingClubLogoSmall.png" alt="" />
              </code>
              <span className="text-xl">Code Crusaders</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Welcome Back</h1>
          </div>

          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                Sign in to your account
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Enter your email and password to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {isPasswordVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </Label>
                </div>

                {formError && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  variant="default"
                  size="default"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-2">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                </span>
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign up
                </Link>
              </div>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Create an admin account?{" "}
                </span>
                <Link
                  to="/admin-signup"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Click here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
