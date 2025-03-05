"use client";

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
// import { gsap } from "gsap-trial";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
//import { SplitText } from "gsap-trial/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Linkedin,
} from "lucide-react";
// import { Button } from "../ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FloatingParticles } from "./floating-particles";
import { ThreeDCard } from "./three-d-card";
import axios from "axios";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP, MotionPathPlugin);

const Login = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Refs for animations
  const containerRef = useRef(null);
  const leftSectionRef = useRef(null);
  const rocketRef = useRef(null);
  const formRef = useRef(null);
  const socialButtonsRef = useRef(null);
  const headingRef = useRef(null);
  const taglineRef = useRef(null);
  const descriptionRef = useRef(null);
  const logoRef = useRef(null);
  const starsRef = useRef(null);
  const planetRef = useRef(null);
  const meteorRef = useRef(null);
  const ctaButtonRef = useRef(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Form validation
    if (!email || !password) {
      setFormError("Please fill in all fields");

      // Shake animation for error
      gsap.to(formRef.current, {
        x: [-10, 10, -10, 10, -5, 5, -2, 2, 0],
        duration: 0.6,
        ease: "power2.out",
      });

      return;
    }

    setFormError("");
    setIsLoading(true);

    // Simulate API call
    try {
      // Animation for loading state
      const loadingTl = gsap.timeline();
      loadingTl.to(ctaButtonRef.current, {
        width: 60,
        borderRadius: 30,
        duration: 0.4,
        ease: "power2.inOut",
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        "http://localhost:3030/api/v1/users/login",
        { email, password }
      );
      console.log(response.data);

      // Success animation
      loadingTl.to(ctaButtonRef.current, {
        width: "100%",
        borderRadius: 12,
        duration: 0.4,
        ease: "power2.inOut",
      });

      // Redirect or show success
      // console.log("Login successful", { email, password, rememberMe });
    } catch (error) {
      setFormError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Main animations setup
  useGSAP(() => {
    // Create a main timeline
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Container entry animation
    timeline.from(containerRef.current, {
      y: 50,
      opacity: 100,
      duration: 1,
      ease: "power4.out",
    });

    // Left section animation - only if visible
    if (window.innerWidth >= 768) {
      // md breakpoint
      timeline.from(
        leftSectionRef.current,
        { x: -100, opacity: 100, duration: 1, ease: "power3.inOut" },
        0.2
      );

      // Logo animation
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
        { y: 30, opacity: 100, duration: 0.8 },
        0.8
      );

      timeline.from(
        descriptionRef.current,
        { y: 20, opacity: 100, duration: 0.8 },
        1
      );

      // Rocket animation
      timeline.from(
        rocketRef.current,
        {
          scale: 0.6,
          opacity: 100,
          rotation: 30,
          duration: 1.5,
          ease: "elastic.out(1, 0.4)",
        },
        1.2
      );

      // Floating rocket animation
      gsap.to(rocketRef.current, {
        y: 30,
        x: 10,
        rotation: "+=5",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.5,
      });

      // Stars twinkling animation
      if (starsRef.current) {
        const stars = starsRef.current.children;
        gsap.to(stars, {
          opacity: gsap.utils.wrap([1, 0.5]),
          scale: gsap.utils.wrap([1.2, 0.8]),
          duration: gsap.utils.wrap([1, 2]),
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          ease: "sine.inOut",
        });
      }

      // Planet rotation
      if (planetRef.current) {
        gsap.to(planetRef.current, {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: "none",
        });
      }

      // Meteor animation
      if (meteorRef.current) {
        gsap.fromTo(
          meteorRef.current,
          {
            x: -100,
            y: -100,
            opacity: 100,
            scale: 0.5,
          },
          {
            motionPath: {
              path: [
                { x: 100, y: 100 },
                { x: 200, y: 200 },
                { x: 300, y: 300 },
              ],
              curviness: 1.5,
            },
            duration: 4,
            opacity: 100,
            scale: 1,
            ease: "power1.inOut",
            repeat: -1,
            repeatDelay: 5,
          }
        );
      }

      gsap.to(headingRef.current, {
        y: 50,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Form animation with staggered entries - always apply
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

    // Social buttons animation - always apply
    gsap.from(socialButtonsRef.current.children, {
      scale: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)",
      delay: 1.8,
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
    <div className="flex items-center justify-center min-h-screen   ">
      <div
        ref={containerRef}
        className=" overflow-hidden  rounded-xl shadow-2xl"
      >
        <div className="flex flex-col md:flex-row gap-2">
          {/* Left Section - Hidden on mobile */}
          <div
            ref={leftSectionRef}
            className="hidden md:block relative bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-600  md:p-12 text-white md:w-[60%] overflow-hidden"
          >
            {/* Floating particles background */}
            <FloatingParticles count={20} />

            <div className="mb-12">
              <img
                ref={logoRef}
                src="/CodingClubLogoSmall.png"
                alt="Cosmic Connect Logo"
                className="w-36"
              />
            </div>

            {/* Fixed Welcome text section with improved alignment and spacing */}
            <div className="relative z-10   space-y-4 max-w-lg">
              <div className="mb-2">
                <h1
                  ref={taglineRef}
                  className="text-4xl sm:text-5xl font-black uppercase tracking-wide text-white leading-tight"
                >
                  WELCOME BACK
                </h1>
              </div>

              <h2
                ref={headingRef}
                className="text-2xl md:text-3xl mb-4 lg:text-4xl font-bold leading-tight"
              >
                To Your Creative
                <br />
                Universe
              </h2>
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
              className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-300 to-indigo-600 opacity-30"
            />

            <div
              ref={meteorRef}
              className="absolute w-20 h-1 bg-gradient-to-r from-white to-transparent rounded-full blur-[2px]"
            />

            <div className="absolute bottom-0 right-0 w-1/2 md:w-2/3 lg:w-1/2">
              <img
                ref={rocketRef}
                src="/rocket.png"
                alt="Rocket Illustration"
                className="object-contain"
              />
            </div>

            <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
          </div>

          {/* Right Section - Full width on mobile */}
          <div className="flex flex-col p-2 md:p-4 w-full md:w-1/2 ">
            {/* Mobile-only logo and branding */}
            <div className="flex flex-col items-center mb-6 md:hidden">
              <img
                src="/CodingClubLogoSmall.png"
                alt="Cosmic Connect Logo"
                className="w-24 mb-4"
              />
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Code Crusaders
              </h2>
            </div>

            <ThreeDCard className="mx-auto w-full max-w-md space-y-6 md:space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  Sign In
                </h2>
                <p className="text-gray-600">
                  Enter your credentials to access your account
                </p>
              </div>

              <form ref={formRef} className="space-y-5" onSubmit={handleSubmit}>
                {formError && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200">
                    {formError}
                  </div>
                )}

                <div className="space-y-4">
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
                      className="h-12 md:h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-md md:text-lg transition-all focus:outline-none"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={inputFocusEffect}
                      onBlur={inputBlurEffect}
                      className="h-12 md:h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-12 text-md md:text-lg transition-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
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

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember-me"
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        className="h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <Label
                        htmlFor="remember-me"
                        className="text-sm text-gray-600"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  ref={ctaButtonRef}
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={buttonHoverEffect}
                  onMouseLeave={buttonHoverEndEffect}
                  className={cn(
                    "h-12 md:h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600",
                    "text-md md:text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl",
                    "flex items-center justify-center gap-2",
                    isLoading && "opacity-80"
                  )}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>

              <div className=" text-center">
                <p className="relative z-50 text-gray-600">
                  {"Don't have an account?"}
                  <Link
                    to="/signup"
                    className=" font-semibold text-fuchsia-600 underline-offset-4 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>

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
                className="grid grid-cols-3 gap-2 md:gap-3"
              >
                <Button
                  variant="outline"
                  onMouseEnter={buttonHoverEffect}
                  onMouseLeave={buttonHoverEndEffect}
                  className="flex h-10 md:h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50"
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
                  className="flex h-10 md:h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-blue-200 hover:bg-blue-50"
                >
                  <Github className="h-5 w-5" />
                </Button>

                <Button
                  variant="outline"
                  onMouseEnter={buttonHoverEffect}
                  onMouseLeave={buttonHoverEndEffect}
                  className="flex h-10 md:h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-black hover:bg-gray-50"
                >
                  <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                </Button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-6 md:mt-8">
                By signing in, you agree to our{" "}
                <a href="#" className="underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </p>
            </ThreeDCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
