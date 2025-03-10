"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export default function SignupPage() {
  const navigate = useNavigate();
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    regNo: "",
    branch: "",
    semester: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formStep === 0) {
      if (
        !formData.name ||
        !formData.regNo ||
        !formData.branch ||
        !formData.semester
      ) {
        setFormError("Please fill in all fields");
        return;
      }
      setFormError("");
      setFormStep(1);
      return;
    }

    if (formStep === 1) {
      if (!formData.email || !formData.mobile) {
        setFormError("Please fill in all fields");
        return;
      }

      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setFormError("Please enter a valid email address");
        return;
      }

      if (!/^\d{10}$/.test(formData.mobile)) {
        setFormError("Please enter a valid 10-digit mobile number");
        return;
      }

      setFormError("");
      setFormStep(2);
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setFormError("Please create a password");
      return;
    }

    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    if (!formData.agreeTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }

    setFormError("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/login?registered=true");
    } catch (error) {
      setFormError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // The JSX remains exactly the same as the original TSX
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Section - Branding (hidden on mobile) */}
      <div className="hidden w-1/2 bg-blue-600/10 p-10 lg:flex flex-col justify-center">
        <div className="mx-auto max-w-md">
          <div className="mb-8 flex items-center gap-2 font-semibold">
            <code className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
              CC
            </code>
            <span className="text-xl">Coding Club</span>
          </div>

          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            Join Us Today
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Create an account to access exclusive resources and join our
            community of developers
          </p>

          <div className="mt-10 bg-white/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-slate-700">
              "Being part of the Coding Club has been transformative for my
              technical skills and professional network."
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="mb-4 flex items-center gap-2 font-semibold">
              <code className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
                CC
              </code>
              <span className="text-xl">Coding Club</span>
            </div>
            <h1 className="text-2xl font-bold text-blue-600">Join Us Today</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription>
                Fill in your details to join the coding club
              </CardDescription>

              {/* Progress Indicator */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span
                    className={formStep >= 0 ? "text-blue-600 font-medium" : ""}
                  >
                    Personal
                  </span>
                  <span
                    className={formStep >= 1 ? "text-blue-600 font-medium" : ""}
                  >
                    Contact
                  </span>
                  <span
                    className={formStep >= 2 ? "text-blue-600 font-medium" : ""}
                  >
                    Security
                  </span>
                </div>
                <Progress value={(formStep / 2) * 100} className="h-2" />
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {formError}
                  </div>
                )}

                {/* Step 1: Personal Information */}
                {formStep === 0 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="regNo">Registration Number</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="regNo"
                          name="regNo"
                          value={formData.regNo}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Enter registration number"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Select
                        value={formData.branch}
                        onValueChange={(value) =>
                          handleSelectChange("branch", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Computer Science">
                            Computer Science
                          </SelectItem>
                          <SelectItem value="Information Technology">
                            Information Technology
                          </SelectItem>
                          <SelectItem value="Electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="Electrical">Electrical</SelectItem>
                          <SelectItem value="Mechanical">Mechanical</SelectItem>
                          <SelectItem value="Civil">Civil</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester</Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(value) =>
                          handleSelectChange("semester", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select your semester" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Semester 1</SelectItem>
                          <SelectItem value="2">Semester 2</SelectItem>
                          <SelectItem value="3">Semester 3</SelectItem>
                          <SelectItem value="4">Semester 4</SelectItem>
                          <SelectItem value="5">Semester 5</SelectItem>
                          <SelectItem value="6">Semester 6</SelectItem>
                          <SelectItem value="7">Semester 7</SelectItem>
                          <SelectItem value="8">Semester 8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Enter 10-digit mobile number"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Create Password */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={isPasswordVisible ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Create password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      <div className="mt-2">
                        <Progress
                          value={passwordStrength}
                          className="h-2"
                          indicatorClassName={
                            passwordStrength <= 25
                              ? "bg-destructive"
                              : passwordStrength <= 50
                              ? "bg-amber-500"
                              : passwordStrength <= 75
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }
                        />
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Weak</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-9"
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, agreeTerms: checked })
                        }
                      />
                      <Label
                        htmlFor="agreeTerms"
                        className="text-sm text-muted-foreground"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  {formStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormStep(formStep - 1)}
                    >
                      Back
                    </Button>
                  )}

                  <Button
                    type="submit"
                    className={formStep < 2 ? "ml-auto" : "w-full"}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Processing..."
                      : formStep < 2
                      ? "Continue"
                      : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center gap-2">
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                </span>
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
