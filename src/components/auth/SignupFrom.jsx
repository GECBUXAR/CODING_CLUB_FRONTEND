// User signup page

"use client";

import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FloatingParticles } from "@/components/floating-particles";
import { ThreeDCard } from "@/components/three-d-card";
import { ProgressBar } from "@/components/progress-bar";
import { useAuth } from "@/contexts/auth-context";

gsap.registerPlugin(ScrollTrigger);

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form state
  const [formStep, setFormStep] = useState(0);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [signupSuccess, setSignupSuccess] = useState(false);

  // Refs for animations
  const containerRef = useRef(null);
  const leftSectionRef = useRef(null);
  const spaceshipRef = useRef(null);
  const formRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const logoRef = useRef(null);
  const starsRef = useRef(null);
  const planetRef = useRef(null);
  const ctaButtonRef = useRef(null);
  const formStepsRef = useRef(null);

  // Input validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobile);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]{3,50}$/;
    return nameRegex.test(name);
  };

  const validateRegNo = (regNo) => {
    const regNoRegex = /^[A-Z0-9]{8,12}$/;
    return regNoRegex.test(regNo);
  };

  const validateBranch = (branch) => {
    const validBranches = [
      "Computer Science",
      "Information Technology",
      "Electronics",
      "Electrical",
      "Mechanical",
      "Civil",
    ];
    return validBranches.includes(branch);
  };

  const validateSemester = (semester) => {
    const sem = Number.parseInt(semester, 10);
    return !Number.isNaN(sem) && sem >= 1 && sem <= 8;
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) {
      strength += 25;
    } else {
      feedback.push("Password should be at least 8 characters long");
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("Include at least one uppercase letter");
    }

    // Number check
    if (/[0-9]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("Include at least one number");
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      strength += 25;
    } else {
      feedback.push("Include at least one special character");
    }

    setPasswordStrength(strength);
    return feedback;
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const feedback = checkPasswordStrength(newPassword);
    if (feedback.length > 0) {
      setFormError(feedback[0]);
    } else {
      setFormError("");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formStep === 0) {
      if (!name || !validateName(name)) {
        setFormError(
          "Please enter a valid name (3-50 characters, letters only)"
        );
        shakeForm();
        return;
      }

      if (!regNo || !validateRegNo(regNo)) {
        setFormError(
          "Please enter a valid registration number (8-12 alphanumeric characters)"
        );
        shakeForm();
        return;
      }

      if (!branch || !validateBranch(branch)) {
        setFormError("Please select a valid branch");
        shakeForm();
        return;
      }

      if (!semester || !validateSemester(semester)) {
        setFormError("Please enter a valid semester (1-8)");
        shakeForm();
        return;
      }

      animateFormTransition(0, 1);
      return;
    }

    if (formStep === 1) {
      if (!email || !validateEmail(email)) {
        setFormError("Please enter a valid email address");
        shakeForm();
        return;
      }

      if (!mobile || !validateMobile(mobile)) {
        setFormError(
          "Please enter a valid 10-digit mobile number starting with 6-9"
        );
        shakeForm();
        return;
      }

      animateFormTransition(1, 2);
      return;
    }

    if (formStep === 2) {
      if (!password || password.length < 8) {
        setFormError("Password must be at least 8 characters");
        shakeForm();
        return;
      }

      const passwordFeedback = checkPasswordStrength(password);
      if (passwordFeedback.length > 0) {
        setFormError(passwordFeedback[0]);
        shakeForm();
        return;
      }

      animateFormTransition(2, 3);
      return;
    }

    if (!agreeTerms) {
      setFormError("You must agree to the terms and conditions");
      shakeForm();
      return;
    }

    setFormError("");
    setIsLoading(true);

    try {
      // Animation for loading state
      const loadingTl = gsap.timeline();
      loadingTl.to(ctaButtonRef.current, {
        width: 60,
        borderRadius: 30,
        duration: 0.4,
        ease: "power2.inOut",
      });

      // Prepare user data
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        mobile: mobile.trim(),
        registrationNumber: regNo.trim().toUpperCase(),
        branch: branch.trim(),
        semester: parseInt(semester),
        password,
      };

      const result = await register(userData);

      if (result.success) {
        // Success animation
        loadingTl.to(ctaButtonRef.current, {
          width: "100%",
          borderRadius: 12,
          duration: 0.4,
          ease: "power2.inOut",
        });

        setSignupSuccess(true);

        gsap.to(formRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            gsap.fromTo(
              ".success-message",
              { y: -20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5 }
            );
          },
        });

        // Redirect to login after success
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        throw new Error(result.error || "Registration failed");
      }
    } catch (error) {
      setFormError(error.message || "Registration failed. Please try again.");
      shakeForm();

      // Reset button animation
      gsap.to(ctaButtonRef.current, {
        width: "100%",
        borderRadius: 12,
        duration: 0.4,
        ease: "power2.inOut",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Animate between form steps
  const animateFormTransition = (fromStep, toStep) => {
    setFormError("");
    const formSteps = formStepsRef.current.children;
    const tl = gsap.timeline();
    tl.to(formSteps[fromStep], {
      x: fromStep < toStep ? -50 : 50,
      opacity: 100,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setFormStep(toStep);
        gsap.set(formSteps[fromStep], { display: "none" });
        gsap.set(formSteps[toStep], {
          display: "block",
          x: toStep < fromStep ? 50 : -50,
          opacity: 100,
        });
      },
    });
    tl.to(formSteps[toStep], {
      x: 0,
      opacity: 100,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(".progress-indicator", {
      width: `${(toStep / 3) * 100}%`,
      duration: 0.5,
      ease: "power2.inOut",
    });
  };

  // Shake form for error feedback
  const shakeForm = () => {
    gsap.to(formRef.current, {
      x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
      duration: 0.6,
      ease: "power2.out",
    });
  };

  // Main animations setup using useEffect
  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline.from(containerRef.current, {
      // y: 50,
      opacity: 100,
      duration: 1,
      ease: "power4.out",
    });
    timeline.from(
      leftSectionRef.current,
      {
        // x: -100,
        opacity: 100,
        duration: 1,
        ease: "power3.inOut",
      },
      0.2
    );
    timeline.from(
      logoRef.current,
      {
        y: -30,
        opacity: 100,
        duration: 0.8,
        rotate: -10,
      },
      0.4
    );

    timeline.from(
      taglineRef.current,
      {
        // y: 30,
        opacity: 100,
        duration: 0.8,
      },
      0.8
    );
    timeline.from(
      descriptionRef.current,
      { y: 20, opacity: 100, duration: 0.8 },
      1
    );
    timeline.from(
      spaceshipRef.current,
      {
        scale: 0.6,
        opacity: 100,
        rotation: -30,
        duration: 1.5,
        ease: "elastic.out(1, 0.4)",
      },
      1.2
    );
    gsap.to(spaceshipRef.current, {
      y: 30,
      x: -10,
      rotation: "-=5",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      delay: 1.5,
    });
    if (starsRef.current) {
      const stars = starsRef.current.children;
      gsap.to(stars, {
        opacity: gsap.utils.wrap([100, 0.5]),
        scale: gsap.utils.wrap([1.2, 0.8]),
        duration: gsap.utils.wrap([1, 2]),
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
        ease: "sine.inOut",
      });
    }
    if (planetRef.current) {
      gsap.to(planetRef.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
      });
    }
    gsap.fromTo(
      formRef.current.children,
      {
        opacity: 100,
        y: 30,
      },
      {
        opacity: 100,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 1,
      }
    );
    // gsap.from(socialButtonsRef.current.children, {
    //   scale: 0,
    //   stagger: 0.1,
    //   duration: 0.7,
    //   ease: "elastic.out(1, 0.5)",
    //   delay: 1.8,
    // });
  }, []);

  // Button hover animations
  const buttonHoverEffect = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const buttonHoverEndEffect = (e) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Input focus animations
  const inputFocusEffect = (e) => {
    gsap.to(e.currentTarget, {
      borderColor: "#7fdca1",
      boxShadow: "0 0 0 4px rgba(244, 63, 94, 0.1)",
      duration: 0.4,
    });
  };

  const inputBlurEffect = (e) => {
    if (!e.currentTarget.value) {
      gsap.to(e.currentTarget, {
        borderColor: "#7fdca1",
        boxShadow: "none",
        duration: 0.4,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div
        ref={containerRef}
        className=" overflow-hidden rounded-xl shadow-2xl"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div
            ref={leftSectionRef}
            className=" hidden md:block relative z-60 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-4 md:p-8 text-white md:w-1/2 overflow-hidden"
          >
            <FloatingParticles count={20} />
            <div className="mt-5 mb-12">
              <img
                ref={logoRef}
                src="/CodingClubLogoSmall.png"
                alt="Cosmic Connect Logo"
                className="w-36"
              />
            </div>
            <div className="relative z-10 space-y-4 max-w-lg">
              <h1 ref={headingRef} className="text-4xl font-bold leading-tight">
                <div
                  ref={taglineRef}
                  className="block text-5xl font-black uppercase tracking-wide text-white mb-2"
                >
                  Join Us
                </div>
                <span>Unlock Your Creative</span>
                <br />
                <span>Potential Today</span>
              </h1>
            </div>
            {/* Space elements */}
            <div ref={starsRef} className="absolute inset-0 z-0 opacity-60">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: Math.random() * 3 + 1 + "px",
                    height: Math.random() * 3 + 1 + "px",
                    left: Math.random() * 100 + "%",
                    top: Math.random() * 100 + "%",
                  }}
                />
              ))}
            </div>
            <div
              ref={planetRef}
              className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-purple-300 to-purple-600 opacity-30"
            />
            <div className="absolute bottom-0 right-0 w-1/2 md:w-2/3 lg:w-3/4">
              <img
                ref={spaceshipRef}
                src="/rocket.png"
                alt="Spaceship Illustration"
                className="object-contain"
              />
            </div>
            <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col p-4 md:w-1/2 md:p-8 ">
            <ThreeDCard className="mx-auto w-full max-w-md space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                  Create Your Account
                </h2>
                <p className="text-gray-600">
                  Join our creative community in just a few steps
                </p>
                {/* Progress bar */}
                <div className="mt-6 mb-8">
                  <ProgressBar value={(formStep / 3) * 100} />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span
                      className={
                        formStep >= 0 ? "text-indigo-600 font-medium" : ""
                      }
                    >
                      Personal
                    </span>
                    <span
                      className={
                        formStep >= 1 ? "text-indigo-600 font-medium" : ""
                      }
                    >
                      Contact
                    </span>
                    <span
                      className={
                        formStep >= 2 ? "text-indigo-600 font-medium" : ""
                      }
                    >
                      Security
                    </span>
                    <span
                      className={
                        formStep >= 3 ? "text-indigo-600 font-medium" : ""
                      }
                    >
                      Finish
                    </span>
                  </div>
                </div>
              </div>

              {signupSuccess ? (
                <div className="success-message text-center py-10 space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-600">
                    Your account has been created successfully. Check your email
                    for verification.
                  </p>
                  <Button
                    className="mt-6 bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white px-8 py-2 rounded-xl"
                    onMouseEnter={buttonHoverEffect}
                    onMouseLeave={buttonHoverEndEffect}
                  >
                    <Link to="/login">Go to Login</Link>
                  </Button>
                </div>
              ) : (
                <form
                  ref={formRef}
                  className="space-y-5"
                  onSubmit={handleSubmit}
                >
                  {formError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                      {formError}
                    </div>
                  )}

                  <div ref={formStepsRef} className="space-y-4">
                    {/* Step 1: Name, Reg No./Roll No., branch, semester */}
                    <div className={formStep === 0 ? "block" : "hidden"}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Tell us about yourself
                      </h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Full Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="mb-2 h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Reg No./Roll No."
                          value={regNo}
                          onChange={(e) => setRegNo(e.target.value)}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="mb-2 h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Branch "
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="mb-2 h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <User className="h-5 w-5" />
                        </div>
                        <Input
                          type="text"
                          placeholder="Semester"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Step 2: Email, Mobile No. */}
                    <div className={formStep === 1 ? "block" : "hidden"}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        How can we reach you?
                      </h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="mb-2 h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <Mail className="h-5 w-5" />
                        </div>
                        <Input
                          type=""
                          placeholder="Mobile No."
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Step 3: Password */}
                    <div className={formStep === 2 ? "block" : "hidden"}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Create a secure password
                      </h3>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                          <Lock className="h-5 w-5" />
                        </div>
                        <Input
                          type={isPasswordVisible ? "text" : "password"}
                          placeholder="Create Password"
                          value={password}
                          onChange={handlePasswordChange}
                          onFocus={inputFocusEffect}
                          onBlur={inputBlurEffect}
                          className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-12 text-lg transition-all focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setIsPasswordVisible(!isPasswordVisible)
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500"
                        >
                          {isPasswordVisible ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                          <span className="sr-only">
                            Toggle password visibility
                          </span>
                        </button>
                      </div>

                      {/* Password strength indicator */}
                      <div className="mt-3">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              passwordStrength <= 25
                                ? "bg-red-500"
                                : passwordStrength <= 50
                                ? "bg-yellow-500"
                                : passwordStrength <= 75
                                ? "bg-blue-500"
                                : "bg-green-500"
                            )}
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {passwordStrength <= 25 && "Weak password"}
                          {passwordStrength > 25 &&
                            passwordStrength <= 50 &&
                            "Fair password"}
                          {passwordStrength > 50 &&
                            passwordStrength <= 75 &&
                            "Good password"}
                          {passwordStrength > 75 && "Strong password"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              password.length >= 8
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-600">
                            8+ characters
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              /[A-Z]/.test(password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-600">
                            Uppercase
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              /[0-9]/.test(password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-600">Number</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              /[^A-Za-z0-9]/.test(password)
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-600">
                            Special char
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Step 4: Terms */}
                    <div className={formStep === 3 ? "block" : "hidden"}>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Almost there!
                      </h3>
                      <div className="flex items-start space-x-3 mb-6">
                        <Checkbox
                          id="terms"
                          checked={agreeTerms}
                          onCheckedChange={setAgreeTerms}
                          className="h-5 w-5 mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <Label
                          htmlFor="terms"
                          className="text-sm text-gray-600"
                        >
                          I agree to the{" "}
                          <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            Terms & Conditions
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="font-medium text-indigo-600 hover:text-indigo-700"
                          >
                            Privacy Policy
                          </a>
                        </Label>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-6">
                        <h4 className="font-medium text-indigo-800 mb-2">
                          You're about to create:
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-indigo-700">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-600" />
                            Account for {name || "your name"}
                          </li>
                          <li className="flex items-center text-sm text-indigo-700">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-600" />
                            Using email {email || "your email"}
                          </li>
                          <li className="flex items-center text-sm text-indigo-700">
                            <CheckCircle2 className="h-4 w-4 mr-2 text-indigo-600" />
                            With a{" "}
                            {passwordStrength > 75
                              ? "strong"
                              : passwordStrength > 50
                              ? "good"
                              : "basic"}{" "}
                            password
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    {formStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          animateFormTransition(formStep, formStep - 1)
                        }
                        className="h-14 px-6 rounded-xl border-2 border-gray-200 bg-white text-gray-700"
                      >
                        Back
                      </Button>
                    )}

                    <Button
                      ref={ctaButtonRef}
                      type="submit"
                      disabled={isLoading}
                      onMouseEnter={buttonHoverEffect}
                      onMouseLeave={buttonHoverEndEffect}
                      className={cn(
                        "h-14 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600",
                        "text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl",
                        "flex items-center justify-center gap-2",
                        isLoading && "opacity-80",
                        formStep < 3 ? "ml-auto" : "w-full"
                      )}
                    >
                      {isLoading ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <>
                          {formStep < 3 ? "Continue" : "Create Account"}
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}

              {!signupSuccess && (
                <>
                  <div className="text-center">
                    <p className="relative z-50 text-gray-600">
                      {"Already have an account?"}
                      <Link
                        to="/login"
                        className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>

                  {formStep === 0 && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-white px-4 text-gray-500">
                            Or continue with
                          </span>
                        </div>
                      </div>
                      <div className="text-center mb-2">
                        <p className="relative z-0 text-gray-600">
                          {"Do you want to become an admin? "}
                          <br />
                          <Link
                            to="/admin/signup"
                            className="font-semibold text-indigo-600 underline-offset-4 hover:underline"
                          >
                            Click Here
                          </Link>
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </ThreeDCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
