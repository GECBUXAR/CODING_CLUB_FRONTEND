// import { useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// const Login = () => {
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const containerRef = useRef(null);
//   const leftSectionRef = useRef(null);
//   const rocketRef = useRef(null);
//   const formRef = useRef(null);
//   const socialButtonsRef = useRef(null);
//   const headingRef = useRef(null);
//   const taglineRef = useRef(null);
//   const descriptionRef = useRef(null);
//   const logoRef = useRef(null);

//   useGSAP(() => {
//     const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

//     timeline.from(containerRef.current, {
//       y: 50,
//       opacity: 0,
//       duration: 1,
//       ease: "power4.out",
//     });

//     timeline.from(
//       leftSectionRef.current,
//       { x: -100, opacity: 0, duration: 1, ease: "power3.inOut" },
//       0.2
//     );

//     timeline.from(logoRef.current, { y: -30, opacity: 0, duration: 0.8 }, 0.4);
//     timeline.from(
//       headingRef.current,
//       { y: 40, opacity: 0, duration: 0.8 },
//       0.6
//     );
//     timeline.from(
//       taglineRef.current,
//       { y: 30, opacity: 0, duration: 0.8 },
//       0.8
//     );
//     timeline.from(
//       descriptionRef.current,
//       { y: 20, opacity: 0, duration: 0.8 },
//       1
//     );

//     timeline.from(
//       rocketRef.current,
//       {
//         scale: 0.6,
//         opacity: 0,
//         rotation: 30,
//         duration: 1.5,
//         ease: "elastic.out(1, 0.4)",
//       },
//       1.2
//     );

//     gsap.to(rocketRef.current, {
//       y: 30,
//       x: 10,
//       rotation: "+=5",
//       duration: 3,
//       repeat: -1,
//       yoyo: true,
//       ease: "power1.inOut",
//       delay: 1.5,
//     });

//     // Updated form animation
//     gsap.fromTo(
//       formRef.current.children,
//       { opacity: 0, y: 30 },
//       {
//         opacity: 1,
//         y: 0,
//         stagger: 0.15,
//         duration: 0.8,
//         ease: "back.out(1.4)",
//         delay: 1,
//       }
//     );

//     gsap.from(socialButtonsRef.current.children, {
//       scale: 0,
//       stagger: 0.1,
//       duration: 0.7,
//       ease: "elastic.out(1, 0.5)",
//       delay: 1.8,
//     });

//     gsap.to(rocketRef.current, {
//       y: -100,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: "top top",
//         end: "bottom top",
//         scrub: true,
//       },
//     });

//     gsap.to(headingRef.current, {
//       y: 50,
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: "top top",
//         end: "bottom top",
//         scrub: true,
//       },
//     });
//   }, []);

//   const buttonHoverEffect = (e) => {
//     gsap.to(e.currentTarget, {
//       scale: 1.05,
//       duration: 0.3,
//       ease: "power2.out",
//     });
//   };

//   const buttonHoverEndEffect = (e) => {
//     gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
//   };

//   const inputFocusEffect = (e) => {
//     gsap.to(e.currentTarget, {
//       borderColor: "#f43f5e",
//       boxShadow: "0 0 0 4px rgba(244, 63, 94, 0.1)",
//       duration: 0.4,
//     });
//   };

//   const inputBlurEffect = (e) => {
//     if (!e.currentTarget.value) {
//       gsap.to(e.currentTarget, {
//         borderColor: "#e5e7eb",
//         boxShadow: "none",
//         duration: 0.4,
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen md:min-h-0 flex items-center justify-center p-4 md:p-6 lg:p-8">
//       <div
//         ref={containerRef}
//         className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
//       >
//         <div className="flex flex-col md:flex-row">
//           {/* Left Section */}
//           <div
//             ref={leftSectionRef}
//             className="relative bg-gradient-to-br from-violet-500 via-fuchsia-500 to-indigo-500 p-8 md:p-12 text-white md:w-1/2 overflow-hidden"
//           >
//             <div className="mb-12">
//               <img
//                 ref={logoRef}
//                 src="/vite.svg"
//                 alt="Cosmic Connect Logo"
//                 className="w-36"
//               />
//             </div>
//             <div className="relative z-10 space-y-8 max-w-lg">
//               <h1 ref={headingRef} className="text-4xl font-bold leading-tight">
//                 <span
//                   ref={taglineRef}
//                   className="block text-5xl font-black uppercase tracking-wide text-white mb-2"
//                 >
//                   Unlimited
//                 </span>
//                 Creative Resources
//                 <br />
//                 At Your Fingertips
//               </h1>
//               <p
//                 ref={descriptionRef}
//                 className="text-lg text-white/90 font-medium"
//               >
//                 Join our creative community to access 5000+ premium mockups,
//                 stunning 3D illustrations, and exclusive design resources.
//               </p>
//             </div>
//             <div className="absolute bottom-0 right-0 w-1/2 md:w-2/3 lg:w-3/4">
//               <img
//                 ref={rocketRef}
//                 src="/rocket.png"
//                 alt="Rocket Illustration"
//                 className="object-contain"
//               />
//             </div>
//             <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
//             <div className="absolute bottom-40 left-10 w-32 h-32 bg-purple-300/20 rounded-full blur-xl"></div>
//           </div>

//           {/* Right Section */}
//           <div className="flex flex-col p-8 md:w-1/2 md:p-12">
//             <div className="mx-auto w-full max-w-md space-y-8">
//               <div>
//                 <h2 className="text-3xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-3">
//                   Welcome to Cosmic Connect
//                 </h2>
//                 <p className="text-gray-600">
//                   Create an account and unlock your creative potential.
//                 </p>
//               </div>
//               <form ref={formRef} className="space-y-5">
//                 <div className="space-y-4">
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                       <svg
//                         className="h-5 w-5 text-gray-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <input
//                       type="text"
//                       placeholder="Full Name"
//                       onFocus={inputFocusEffect}
//                       onBlur={inputBlurEffect}
//                       className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
//                     />
//                   </div>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                       <svg
//                         className="h-5 w-5 text-gray-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                         <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                       </svg>
//                     </div>
//                     <input
//                       type="email"
//                       placeholder="Email Address"
//                       onFocus={inputFocusEffect}
//                       onBlur={inputBlurEffect}
//                       className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-4 text-lg transition-all focus:outline-none"
//                     />
//                   </div>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
//                       <svg
//                         className="h-5 w-5 text-gray-400"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </div>
//                     <input
//                       type={isPasswordVisible ? "text" : "password"}
//                       placeholder="Create Password"
//                       onFocus={inputFocusEffect}
//                       onBlur={inputBlurEffect}
//                       className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pl-12 pr-12 text-lg transition-all focus:outline-none"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setIsPasswordVisible(!isPasswordVisible)}
//                       className="absolute inset-y-0 right-0 flex items-center pr-4"
//                     >
//                       {isPasswordVisible ? (
//                         <svg
//                           className="h-5 w-5 text-gray-500"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
//                             clipRule="evenodd"
//                           />
//                           <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
//                         </svg>
//                       ) : (
//                         <svg
//                           className="h-5 w-5 text-gray-500"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                         >
//                           <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                           <path
//                             fillRule="evenodd"
//                             d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                   <div className="flex items-center">
//                     <input
//                       id="remember-me"
//                       type="checkbox"
//                       className="h-4 w-4 rounded border-gray-300 text-fuchsia-600 focus:ring-fuchsia-500"
//                     />
//                     <label
//                       htmlFor="remember-me"
//                       className="ml-2 block text-sm text-gray-600"
//                     >
//                       I agree to the{" "}
//                       <a
//                         href="#"
//                         className="font-medium text-fuchsia-600 hover:text-fuchsia-700"
//                       >
//                         Terms & Conditions
//                       </a>
//                     </label>
//                   </div>
//                 </div>
//                 <button
//                   onMouseEnter={buttonHoverEffect}
//                   onMouseLeave={buttonHoverEndEffect}
//                   className="h-14 w-full rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl"
//                 >
//                   Create Account
//                 </button>
//               </form>
//               <div className="text-center">
//                 <p className="text-gray-600">
//                   Already a member?{" "}
//                   <Link
//                     to="/login"
//                     className="font-semibold text-fuchsia-600 underline-offset-4 hover:underline"
//                   >
//                     Sign In
//                   </Link>
//                 </p>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="bg-white px-4 text-gray-500">
//                     Or continue with
//                   </span>
//                 </div>
//               </div>
//               <div ref={socialButtonsRef} className="grid grid-cols-3 gap-3">
//                 <button
//                   onMouseEnter={buttonHoverEffect}
//                   onMouseLeave={buttonHoverEndEffect}
//                   className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-rose-200 hover:bg-rose-50"
//                 >
//                   <svg className="h-5 w-5" viewBox="0 0 24 24">
//                     <path
//                       fill="#EA4335"
//                       d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
//                     />
//                     <path
//                       fill="#34A853"
//                       d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z"
//                     />
//                     <path
//                       fill="#4A90E2"
//                       d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z"
//                     />
//                     <path
//                       fill="#FBBC05"
//                       d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z"
//                     />
//                   </svg>
//                 </button>
//                 <button
//                   onMouseEnter={buttonHoverEffect}
//                   onMouseLeave={buttonHoverEndEffect}
//                   className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-blue-200 hover:bg-blue-50"
//                 >
//                   <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
//                     <path d="M9.045 23.996v-9.798H5.417V9.747h3.628V6.231C9.045 2.193 11.330 0 14.998 0c1.759 0 3.268.13 3.713.188v4.304h-2.55c-1.997 0-2.383.95-2.383 2.34v2.915h4.759l-.62 4.451h-4.139v9.798h-4.733z" />
//                   </svg>
//                 </button>
//                 <button
//                   onMouseEnter={buttonHoverEffect}
//                   onMouseLeave={buttonHoverEndEffect}
//                   className="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white text-gray-700 transition-all hover:border-black hover:bg-gray-50"
//                 >
//                   <svg className="h-5 w-5" viewBox="0 0 24 24">
//                     <path
//                       d="M22.451 4.53a9.905 9.905 0 01-2.832.775 4.93 4.93 0 002.165-2.724 9.908 9.908 0 01-3.127 1.196 4.92 4.92 0 00-8.384 4.491C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"
//                       fill="#1DA1F2"
//                     />
//                   </svg>
//                 </button>
//               </div>
//               <p className="text-center text-xs text-gray-500 mt-8">
//                 By signing up, you agree to our{" "}
//                 <a href="#" className="underline">
//                   Terms of Service
//                 </a>{" "}
//                 and{" "}
//                 <a href="#" className="underline">
//                   Privacy Policy
//                 </a>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
