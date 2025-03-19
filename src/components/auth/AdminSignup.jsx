import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Phone, Lock, Key } from "lucide-react";
import { useAuth } from "../../contexts/auth-context";

const AdminSignupPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    adminKey: "",
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

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Check password strength when password changes
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First step validation
    if (formStep === 0) {
      if (!formData.name || !formData.adminKey) {
        setFormError("Please fill in all fields");
        return;
      }

      if (formData.name.length < 3) {
        setFormError("Name must be at least 3 characters");
        return;
      }

      if (formData.adminKey.length < 6) {
        setFormError("Admin key must be at least 6 characters");
        return;
      }

      setFormError("");
      setFormStep(1);
      return;
    }

    // Second step validation
    if (formStep === 1) {
      if (!formData.email || !formData.mobile) {
        setFormError("Please fill in all fields");
        return;
      }

      // Simple email validation
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setFormError("Please enter a valid email address");
        return;
      }

      // Simple mobile validation (10 digits)
      if (!/^\d{10}$/.test(formData.mobile)) {
        setFormError("Please enter a valid 10-digit mobile number");
        return;
      }

      setFormError("");
      setFormStep(2);
      return;
    }

    // Final step validation
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
      // Add role to form data
      const adminData = {
        ...formData,
        role: "admin",
        secretKey: formData.adminKey, // Rename for backend compatibility
      };

      const result = await register(adminData);

      if (result.success) {
        // Redirect to login page on successful registration
        navigate("/login", {
          state: { message: "Admin registration successful! Please log in." },
        });
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (error) {
      setFormError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Left Section - Branding (hidden on mobile) */}
      <div className="hidden w-1/2 bg-purple-600/10 p-10 lg:flex flex-col justify-center">
        <div className="mx-auto max-w-md">
          <img
            src="/image/CodingClubLogoSmall.png"
            alt="Logo"
            className="w-32 mb-8"
          />

          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            Admin Registration
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            Create an admin account to manage the coding club resources and
            members
          </p>

          <div className="mt-10 bg-white/30 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-slate-700">
              "As an admin, you'll have the power to create events, manage
              members, and ensure the smooth operation of our coding community."
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <img
              src="/image/CodingClubLogoSmall.png"
              alt="Logo"
              className="w-24 mb-4"
            />
            <h1 className="text-2xl font-bold text-purple-600">
              Admin Registration
            </h1>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">
              Create Admin Account
            </h2>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span
                  className={formStep >= 0 ? "text-purple-600 font-medium" : ""}
                >
                  Authentication
                </span>
                <span
                  className={formStep >= 1 ? "text-purple-600 font-medium" : ""}
                >
                  Contact
                </span>
                <span
                  className={formStep >= 2 ? "text-purple-600 font-medium" : ""}
                >
                  Security
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full">
                <div
                  className="h-full bg-purple-600 rounded-full transition-all duration-300"
                  style={{ width: `${(formStep / 2) * 100}%` }}
                ></div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Error message */}
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {formError}
                </div>
              )}

              {/* Step 1: Authentication Information */}
              {formStep === 0 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Enter your full name"
                        />
                        <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="adminKey" className="text-sm font-medium">
                        Admin Key
                      </label>
                      <div className="relative">
                        <input
                          id="adminKey"
                          name="adminKey"
                          type="password"
                          value={formData.adminKey}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Enter admin key"
                        />
                        <Key className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500">
                        The admin key is provided by the system administrator.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Contact Information */}
              {formStep === 1 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Enter your email"
                        />
                        <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="mobile" className="text-sm font-medium">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Enter 10-digit mobile number"
                        />
                        <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Create Password */}
              {formStep === 2 && (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type={isPasswordVisible ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Create password"
                        />
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      <div className="mt-2">
                        <div className="h-2 w-full bg-gray-200 rounded-full">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              passwordStrength <= 25
                                ? "bg-red-500"
                                : passwordStrength <= 50
                                ? "bg-yellow-500"
                                : passwordStrength <= 75
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-500">
                          <span>Weak</span>
                          <span>Strong</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={isConfirmPasswordVisible ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="Confirm password"
                        />
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <button
                          type="button"
                          onClick={() =>
                            setIsConfirmPasswordVisible(
                              !isConfirmPasswordVisible
                            )
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {isConfirmPasswordVisible ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 mt-4">
                      <input
                        id="agreeTerms"
                        name="agreeTerms"
                        type="checkbox"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="agreeTerms"
                        className="text-sm text-gray-600"
                      >
                        I agree to the{" "}
                        <a
                          href="/terms"
                          className="text-purple-600 hover:underline"
                        >
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="/privacy"
                          className="text-purple-600 hover:underline"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                {formStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormStep(formStep - 1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Back
                  </button>
                )}

                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                    formStep < 2 ? "ml-auto" : "w-full"
                  } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </span>
                  ) : formStep < 2 ? (
                    "Continue"
                  ) : (
                    "Create Admin Account"
                  )}
                </button>
              </div>
            </form>

            {/* Sign in link */}
            <div className="mt-6 text-center text-sm">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-600 hover:underline font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
