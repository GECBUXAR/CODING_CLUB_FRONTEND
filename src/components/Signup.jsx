import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import gsap from "gsap";
import { gsap } from "gsap-trial";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap-trial/SplitText";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Github,
  Linkedin,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { cn } from "../utils/cn";
import { FloatingParticles } from "./floating-particles";
import { ThreeDCard } from "./three-d-card";
import { ProgressBar } from "./progress-bar";

gsap.registerPlugin(ScrollTrigger, SplitText);

const Signup = () => {
  const navigate = useNavigate();

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
  const socialButtonsRef = useRef(null);
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
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
  };

  // calling backend for signup

  const signupUser = async (userData) => {
    try {
      const response = await axios.post(
        // `${process.env.REACT_APP_API_URL}/api/v1/users/signup`,
        "http://localhost:3030/api/v1/users/signup",
        userData
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || error.message || "Signup failed"
      );
    }
  };

  // const signupUser = async (userData) => {

  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3030/api/v1/users/signup",
  //       {
  //         name,
  //         email,
  //         password,
  //         regNo,
  //         branch,
  //         semester,
  //         mobile,
  //       }
  //     );

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Signup failed");
  //     }

  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // };

  // Password strength checker

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formStep === 0) {
      if (!name) {
        setFormError("Please enter your name");
        shakeForm();
        return;
      }

      if (!regNo) {
        setFormError("Please enter your registration number");
        shakeForm();
        return;
      }
      if (!branch) {
        setFormError("Please enter your branch");
        shakeForm();
        return;
      }
      if (!semester) {
        setFormError("Please enter your semester");
        shakeForm();
        return;
      }

      animateFormTransition(0, 1);
      return;
    }

    if (formStep === 1) {
      if (!email) {
        setFormError("Please enter your email");
        shakeForm();
        return;
      }
      if (!validateEmail(email)) {
        setFormError("Please enter a valid email address");
        shakeForm();
        return;
      }
      // if (!/\S+@\S+\.\S+/.test(email)) {
      //   setFormError("Please enter a valid email address");
      //   shakeForm();
      //   return;
      // }

      if (!mobile) {
        setFormError("Please enter your mobile number");
        shakeForm();
        return;
      }
      if (!validateMobile(mobile)) {
        setFormError("Please enter a valid 10-digit mobile number");
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
      if (passwordStrength < 50) {
        setFormError("Please use a stronger password");
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
        name,
        email,
        password,
        regNo,
        branch,
        semester,
        mobile,
      };

      const response = await signupUser(userData);

      await new Promise((resolve) => setTimeout(resolve, 2000));

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

      console.log("Signup successful", { name, email, password, agreeTerms });
    } catch (error) {
      // setFormError("An error occurred. Please try again.");

      setFormError(error.message || "An error occurred. Please try again.");

      // // Reset button animation
      // gsap.to(ctaButtonRef.current, {
      //   width: "100%",
      //   borderRadius: 12,
      //   duration: 0.4,
      //   ease: "power2.inOut",
      // });

      shakeForm();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form submission
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Step validations
  //   if (formStep === 0) {
  //     if (!name || !regNo || !branch || !semester) {
  //       setFormError("Please fill all required fields");
  //       shakeForm();
  //       return;
  //     }
  //     animateFormTransition(0, 1);
  //     return;
  //   }

  //   if (formStep === 1) {
  //     if (!validateEmail(email)) {
  //       setFormError("Please enter a valid email address");
  //       shakeForm();
  //       return;
  //     }
  //     if (!validateMobile(mobile)) {
  //       setFormError("Please enter a valid 10-digit mobile number");
  //       shakeForm();
  //       return;
  //     }
  //     animateFormTransition(1, 2);
  //     return;
  //   }

  //   if (formStep === 2) {
  //     if (!password || password.length < 8 || passwordStrength < 50) {
  //       setFormError(
  //         "Password must be at least 8 characters and strong enough"
  //       );
  //       shakeForm();
  //       return;
  //     }
  //     animateFormTransition(2, 3);
  //     return;
  //   }

  //   if (!agreeTerms) {
  //     setFormError("You must agree to the terms and conditions");
  //     shakeForm();
  //     return;
  //   }

  //   setFormError("");
  //   setIsLoading(true);

  //   try {
  //     // Prepare user data
  //     const userData = {
  //       name,
  //       email,
  //       password,
  //       regNo,
  //       branch,
  //       semester: Number(semester),
  //       mobile: Number(mobile),
  //     };

  //     // Start loading animation
  //     gsap.to(ctaButtonRef.current, {
  //       width: 60,
  //       borderRadius: 30,
  //       duration: 0.4,
  //       ease: "power2.inOut",
  //     });

  //     // API call
  //     await signupUser(userData);

  //     // Simulate loading for better UX
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Success state
  //     setSignupSuccess(true);
  //     gsap.to(formRef.current, {
  //       y: 20,
  //       opacity: 0,
  //       duration: 0.5,
  //       onComplete: () => {
  //         gsap.fromTo(
  //           ".success-message",
  //           { y: -20, opacity: 0 },
  //           { y: 0, opacity: 1, duration: 0.5 }
  //         );
  //       },
  //     });
  //   } catch (error) {
  //     setFormError(error.message);
  //     shakeForm();
  //   } finally {
  //     setIsLoading(false);
  //     // Reset button animation
  //     gsap.to(ctaButtonRef.current, {
  //       width: "100%",
  //       borderRadius: 12,
  //       duration: 0.4,
  //       ease: "power2.inOut",
  //     });
  //   }
  // };

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
      y: 50,
      opacity: 100,
      duration: 1,
      ease: "power4.out",
    });
    timeline.from(
      leftSectionRef.current,
      { x: -100, opacity: 100, duration: 1, ease: "power3.inOut" },
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
    const headingSplit = new SplitText(headingRef.current, {
      type: "chars, words",
    });
    timeline.from(
      headingSplit.chars,
      {
        opacity: 100,
        y: 20,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
      },
      0.6
    );
    timeline.from(
      taglineRef.current,
      { y: 30, opacity: 100, duration: 0.8 },
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
      { opacity: 100, y: 30 },
      {
        opacity: 100,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "back.out(1.4)",
        delay: 1,
      }
    );
    gsap.from(socialButtonsRef.current.children, {
      scale: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
      delay: 1.8,
    });
    gsap.to(spaceshipRef.current, {
      y: -100,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    gsap.to(headingRef.current, {
      y: 50,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
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
      borderColor: "#f43f5e",
      boxShadow: "0 0 0 4px rgba(244, 63, 94, 0.1)",
      duration: 0.4,
    });
  };

  const inputBlurEffect = (e) => {
    if (!e.currentTarget.value) {
      gsap.to(e.currentTarget, {
        borderColor: "#e5e7eb",
        boxShadow: "none",
        duration: 0.4,
      });
    }
  };

  return (
    <div className="min-h-screen md:min-h-0 flex items-center justify-center p-4 md:p-6 lg:p-8 bg-gray-50">
      <div
        ref={containerRef}
        className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Section */}
          <div
            ref={leftSectionRef}
            className="hidden md:block relative bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 md:p-12 text-white md:w-1/2 overflow-hidden"
          >
            <FloatingParticles count={20} />
            <div className="mb-12">
              <img
                ref={logoRef}
                src="/CodingClubLogoSmall.png"
                alt="Cosmic Connect Logo"
                className="w-36"
              />
            </div>
            <div className="relative z-10 space-y-8 max-w-lg">
              <h1 ref={headingRef} className="text-4xl font-bold leading-tight">
                <span
                  ref={taglineRef}
                  className="block text-5xl font-black uppercase tracking-wide text-white mb-2"
                >
                  Join Us
                </span>
                Unlock Your Creative
                <br />
                Potential Today
              </h1>
              {/* <p
                ref={descriptionRef}
                className="text-lg text-white/90 font-medium "
              >
                Create an account to access 5000+ premium mockups, stunning 3D
                illustrations, and exclusive design resources.
              </p> */}
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
          <div className="flex flex-col p-8 md:w-1/2 md:p-12">
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

                      <div
                        ref={socialButtonsRef}
                        className="grid grid-cols-3 gap-3"
                      >
                        <Button
                          variant="outline"
                          onMouseEnter={buttonHoverEffect}
                          onMouseLeave={buttonHoverEndEffect}
                          className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50"
                        >
                          <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                              fill="#EA4335"
                              d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                            />
                            <path
                              fill="#34A853"
                              d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
                            />
                            <path
                              fill="#4A90E2"
                              d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
                            />
                          </svg>
                        </Button>

                        <Button
                          variant="outline"
                          onMouseEnter={buttonHoverEffect}
                          onMouseLeave={buttonHoverEndEffect}
                          className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-blue-200 hover:bg-blue-50"
                        >
                          <Github className="h-5 w-5" />
                        </Button>

                        <Button
                          variant="outline"
                          onMouseEnter={buttonHoverEffect}
                          onMouseLeave={buttonHoverEndEffect}
                          className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-black hover:bg-gray-50"
                        >
                          <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                        </Button>
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
