// import React, { useState, useEffect } from "react";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [activeLink, setActiveLink] = useState("");

//   // Handle scrolling effects
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }

//       // Determine active section based on scroll position
//       const sections = ["events", "curriculum", "help"];
//       for (const section of sections) {
//         const element = document.getElementById(section);
//         if (element) {
//           const rect = element.getBoundingClientRect();
//           if (rect.top <= 100 && rect.bottom >= 100) {
//             setActiveLink(section);
//             break;
//           }
//         }
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   const closeMenu = () => {
//     setIsMenuOpen(false);
//   };

//   const handleLinkClick = (id) => {
//     setActiveLink(id);
//     closeMenu();

//     // Smooth scroll to section
//     const element = document.getElementById(id);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const navLinks = [
//     { id: "events", label: "EVENTS" },
//     { id: "curriculum", label: "CURRICULUM" },
//     { id: "help", label: "HELP" },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 w-full z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-white shadow-md py-2"
//           : "bg-white/80 backdrop-blur-sm py-4"
//       }`}
//     >
//       <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
//         {/* Logo with animation */}
//         <a
//           href="#home"
//           className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300 flex items-center"
//           onClick={() => handleLinkClick("home")}
//         >
//           <span className="text-2xl mr-1">@</span>
//           <span className="relative">
//             Coding Club
//             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
//           </span>
//         </a>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center gap-6">
//           {navLinks.map((link) => (
//             <a
//               key={link.id}
//               href={`#${link.id}`}
//               className={`font-medium group relative ${
//                 activeLink === link.id
//                   ? "text-blue-600"
//                   : "text-gray-700 hover:text-blue-500"
//               } transition-colors duration-300`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleLinkClick(link.id);
//               }}
//             >
//               {link.label}
//               <span
//                 className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
//                   activeLink === link.id ? "w-full" : "w-0 group-hover:w-full"
//                 }`}
//               ></span>
//             </a>
//           ))}

//           <button
//             className="bg-blue-500 px-5 py-2 rounded-xl font-semibold text-white hover:bg-blue-600 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
//             aria-label="Create an account"
//           >
//             CREATE AN ACCOUNT
//           </button>
//         </div>

//         {/* Mobile Menu Button with animation */}
//         <button
//           className="md:hidden text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-300"
//           onClick={toggleMenu}
//           aria-label="Toggle menu"
//           aria-expanded={isMenuOpen}
//         >
//           <div className="w-6 h-6 flex flex-col justify-center items-center">
//             <span
//               className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
//                 isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
//               }`}
//             />
//             <span
//               className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
//                 isMenuOpen ? "opacity-0" : "opacity-100"
//               }`}
//             />
//             <span
//               className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
//                 isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
//               }`}
//             />
//           </div>
//         </button>
//       </div>

//       {/* Mobile Navigation with animation */}
//       <div
//         className={`absolute top-full left-0 w-full bg-white shadow-lg md:hidden transition-all duration-300 overflow-hidden ${
//           isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
//         }`}
//       >
//         <div className="flex flex-col items-center gap-4 p-6">
//           {navLinks.map((link) => (
//             <a
//               key={link.id}
//               href={`#${link.id}`}
//               className={`text-lg font-medium ${
//                 activeLink === link.id
//                   ? "text-blue-600"
//                   : "text-gray-700 hover:text-blue-500"
//               } transition-colors duration-300`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 handleLinkClick(link.id);
//               }}
//             >
//               {link.label}
//             </a>
//           ))}

//           <button
//             className="w-full bg-blue-500 px-4 py-3 rounded-xl font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 shadow-md"
//             aria-label="Create an account"
//             onClick={closeMenu}
//           >
//             CREATE AN ACCOUNT
//           </button>
//         </div>
//       </div>

//       {/* Overlay for mobile menu */}
//       {isMenuOpen && (
//         <div
//           className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
//           onClick={closeMenu}
//           aria-hidden="true"
//         />
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  // Refs for GSAP animations
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const buttonRef = useRef(null);

  // Animation timeline
  const tl = useRef(null);

  // Initialize animations
  useEffect(() => {
    // Initial entrance animation
    tl.current = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.current
      .fromTo(
        logoRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      .fromTo(
        linksRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.4 },
        "-=0.3"
      )
      .fromTo(
        buttonRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5 },
        "-=0.2"
      );

    // Set up scroll trigger for navbar background change
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (self) => {
        if (self.progress > 0.05) {
          if (!isScrolled) setIsScrolled(true);
        } else {
          if (isScrolled) setIsScrolled(false);
        }
      },
    });

    // Clean up
    return () => {
      if (tl.current) tl.current.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isScrolled]);

  // Handle scroll to determine active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["events", "curriculum", "help"];

      let found = false;
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveLink(section);
            found = true;
            break;
          }
        }
      }

      // If no section is in view, set active to "" (home)
      if (!found && window.scrollY < 100) {
        setActiveLink("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile menu animation
  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMenuOpen) {
        gsap.to(mobileMenuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.fromTo(
          mobileMenuRef.current.querySelectorAll("a, button"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, delay: 0.1, duration: 0.3 }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = (id) => {
    setActiveLink(id);
    closeMenu();

    // Smooth scroll to section with GSAP
    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  const navLinks = [
    { id: "events", label: "EVENTS" },
    { id: "curriculum", label: "CURRICULUM" },
    { id: "help", label: "HELP" },
  ];

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white shadow-lg py-2"
          : "bg-white/90 backdrop-blur-md py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <a
          ref={logoRef}
          href="#home"
          className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 flex items-center group"
          onClick={(e) => {
            e.preventDefault();
            handleLinkClick("home");
          }}
        >
          {/* <div className="w-8 h-8 mr-2 rounded-full bg-blue-600 flex items-center justify-center text-white overflow-hidden">
            <span className="text-xl">@</span>
          </div> */}
          <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <span className="relative">
            Coding Club
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.id}
              ref={(el) => (linksRef.current[index] = el)}
              href={`#${link.id}`}
              className={`relative font-medium text-sm tracking-wider ${
                activeLink === link.id
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-500"
              } transition-colors duration-300`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                  activeLink === link.id ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </a>
          ))}

          <button
            ref={buttonRef}
            className="bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-2 rounded-xl font-medium text-sm text-white hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 shadow-md hover:shadow-lg"
            aria-label="Create an account"
          >
            {/* <span className="text-lg font-semibold">Become a Member</span> */}
            Become a Member
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-300"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <span
              className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
              }`}
            />
            <span
              className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`bg-current block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div
        ref={mobileMenuRef}
        className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden overflow-hidden h-0 opacity-0"
      >
        <div className="flex flex-col items-center gap-4 p-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`text-lg font-medium ${
                activeLink === link.id
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-500"
              } transition-colors duration-300`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id);
              }}
            >
              {link.label}
            </a>
          ))}

          <button
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 rounded-xl font-medium text-white hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300 shadow-md mt-2"
            aria-label="Create an account"
            onClick={closeMenu}
          >
            {/* <span className="text-lg font-semibold">Become a Member</span> */}
            Become a Member
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;
