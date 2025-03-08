import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, EyeOff, Mail, Lock, Key, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

gsap.registerPlugin(ScrollTrigger);

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  // Form state
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Refs for animations
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const ctaButtonRef = useRef(null);

  // Input validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateSecretKey = (key) => {
    return key.length >= 6;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!email || !validateEmail(email)) {
      setFormError("Please enter a valid email address");
      shakeForm();
      return;
    }

    if (!password || !validatePassword(password)) {
      setFormError("Password must be at least 8 characters");
      shakeForm();
      return;
    }

    if (!secretKey || !validateSecretKey(secretKey)) {
      setFormError("Secret key must be at least 6 characters");
      shakeForm();
      return;
    }

    setFormError("");
    setIsLoading(true);

    // Animation for loading state
    const loadingTl = gsap.timeline();
    loadingTl.to(ctaButtonRef.current, {
      width: 60,
      borderRadius: 30,
      duration: 0.4,
      ease: "power2.inOut",
    });

    try {
      const result = await adminLogin(email, password, secretKey);

      if (result.success) {
        // Success animation
        loadingTl.to(ctaButtonRef.current, {
          width: "100%",
          borderRadius: 12,
          duration: 0.4,
          ease: "power2.inOut",
        });

        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (error) {
      setFormError(error.message || "Invalid credentials. Please try again.");

      // Reset button animation
      loadingTl.to(ctaButtonRef.current, {
        width: "100%",
        borderRadius: 12,
        duration: 0.4,
        ease: "power2.inOut",
      });

      shakeForm();
    } finally {
      setIsLoading(false);
    }
  };

  // Shake animation for form errors
  const shakeForm = () => {
    gsap.to(formRef.current, {
      x: gsap.utils.wrap([-10, 10, -10, 10, -5, 5, -2, 2, 0]),
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex min-h-screen w-full items-center justify-center bg-background p-4 md:p-8"
      )}
    >
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the admin dashboard
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
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

          {/* Secret Key input */}
          <div className="space-y-2">
            <Label htmlFor="secretKey" className="text-sm font-medium">
              Secret Key
            </Label>
            <div className="relative">
              <Input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="pl-10"
                placeholder="Enter admin secret key"
              />
              <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Error message */}
          {formError && <p className="text-sm text-destructive">{formError}</p>}

          {/* Submit button */}
          <Button
            ref={ctaButtonRef}
            type="submit"
            variant="default"
            size="lg"
            className="relative w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                Login as Admin
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </form>

        {/* Links */}
        <div className="text-center text-sm">
          <p>
            Not an admin?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login as User
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
