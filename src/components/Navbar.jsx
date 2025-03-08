import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FaCalendarAlt,
  FaBook,
  FaQuestionCircle,
  FaUser,
  FaBell,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import * as Motion from "framer-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  // Refs
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef({});
  const buttonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);
  const searchInputRef = useRef(null);

  // Navigation links with icons - wrapped in useMemo
  const navLinks = useMemo(
    () => [
      {
        id: "/events",
        label: "Events",
        icon: <FaCalendarAlt className="w-4 h-4" />,
        hasNotification: true,
      },
      {
        id: "/exams",
        label: "Exams",
        icon: <FaCalendarAlt className="w-4 h-4" />,
        hasNotification: false,
      },
      {
        id: "/curriculum",
        label: "Curriculum",
        icon: <FaBook className="w-4 h-4" />,
        hasNotification: false,
      },
      {
        id: "/help",
        label: "Help",
        icon: <FaQuestionCircle className="w-4 h-4" />,
        hasNotification: false,
      },
    ],
    []
  ); // Empty dependency array since these links don't depend on any state

  // Update active link based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingLink = navLinks.find(
      (link) => currentPath === link.id || currentPath.startsWith(`${link.id}/`)
    );
    setActiveLink(matchingLink ? matchingLink.id : "");
  }, [location, navLinks]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen) {
        // Check if the click is outside the navbar and mobile menu
        if (
          navbarRef.current &&
          !navbarRef.current.contains(event.target) &&
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(event.target)
        ) {
          setIsMenuOpen(false);
        }
      }

      // Close search when clicking outside
      if (
        isSearchOpen &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    // Handle escape key press
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
        if (isSearchOpen) {
          setIsSearchOpen(false);
        }
      }
    };

    // Add global event listeners
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    // Clean up the event listeners
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen, isSearchOpen]);

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [isSearchOpen]);

  // Main animations
  useGSAP(
    () => {
      // Logo animation
      gsap.from(logoRef.current, {
        y: -50,
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)",
      });

      // Links animation with rotation
      const linkElements = Object.values(linksRef.current).filter(Boolean);
      gsap.from(linkElements, {
        y: -30,
        rotation: -5,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.2,
      });

      // Button animation with bounce
      gsap.from(buttonRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        delay: 0.4,
        immediateRender: false,
        overwrite: "auto",
      });
    },
    { scope: navbarRef, dependencies: [] }
  );

  // Mobile menu animations
  useGSAP(() => {
    if (mobileMenuRef.current) {
      const menuItems = mobileMenuRef.current.querySelectorAll("a, button");

      if (isMenuOpen) {
        // Animate overlay in
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 1,
            duration: 0.2,
            display: "block",
          });
        }

        // Animate menu in
        gsap.to(mobileMenuRef.current, {
          height: "auto",
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        // Animate menu items in
        gsap.from(menuItems, {
          y: 20,
          opacity: 0,
          stagger: 0.05,
          duration: 0.3,
          delay: 0.1,
        });
      } else {
        // Animate overlay out
        if (overlayRef.current) {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              gsap.set(overlayRef.current, { display: "none" });
            },
          });
        }

        // Animate menu out
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    }
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSearch = (e) => {
    e.stopPropagation();
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white/95 shadow-md backdrop-blur-md"
          : "py-4 bg-white/80 backdrop-blur-sm"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="group flex-shrink-0"
          aria-label="Go to homepage"
        >
          <span
            ref={logoRef}
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 flex items-center"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white group-hover:scale-110 transition-transform duration-300">
              <img src="/CodingClubLogoSmall.png" alt="" className="size-8" />
            </div>
            <span className="relative hidden xs:block">
              <img
                src="/CodingClubLogo.png"
                alt="Coding Club"
                className="w-36"
              />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.id}
              ref={(el) => {
                linksRef.current[link.id] = el;
              }}
              className={({ isActive }) => `
                group relative font-medium text-sm tracking-wider flex items-center gap-2 
                px-3 py-2 rounded-lg
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                }
                transition-all duration-300
              `}
              aria-current={activeLink === link.id ? "page" : undefined}
            >
              <span
                className={`
                  relative flex items-center justify-center
                  ${
                    activeLink === link.id
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-600"
                  }
                  transition-colors duration-300
                `}
              >
                {link.icon}
                {link.hasNotification && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                )}
              </span>
              <span>{link.label}</span>
              <span
                className={`
                  absolute -bottom-0.5 left-0 right-0 mx-auto h-0.5 bg-blue-600 transition-all duration-300 rounded-full
                  ${activeLink === link.id ? "w-4/5" : "w-0 group-hover:w-1/2"}
                `}
              />
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Button */}
          <div className="relative">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-300"
              onClick={toggleSearch}
              aria-label="Search"
            >
              <FaSearch className="w-4 h-4" />
            </button>

            {/* Search Input (appears when clicked) */}
            <AnimatePresence>
              {isSearchOpen && (
                <Motion.motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "250px" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden"
                  ref={searchInputRef}
                >
                  <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                    <FaSearch className="text-gray-400 mx-2" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="flex-1 py-2 px-1 outline-none text-sm"
                    />
                    <button
                      type="button"
                      className="p-1 hover:bg-gray-100 rounded-full"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <FaTimes className="text-gray-400 w-3 h-3" />
                    </button>
                  </div>
                </Motion.motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-300 relative"
            aria-label="Notifications"
          >
            <FaBell className="w-4 h-4" />
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          </button>

          {/* CTA Button */}
          <Link to="/login">
            <button
              ref={buttonRef}
              type="button"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2 rounded-xl font-medium text-sm text-white hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:outline-none"
            >
              <FaUser className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile Search Button */}
          <button
            type="button"
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-300"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <FaSearch className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2 transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
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
      </div>

      {/* Mobile Search (appears when clicked) */}
      <AnimatePresence>
        {isSearchOpen && (
          <Motion.motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-full px-4 py-2 bg-white border-b border-gray-200"
          >
            <div className="flex items-center p-2 border border-gray-200 rounded-lg bg-gray-50">
              <FaSearch className="text-gray-400 mx-2" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 py-2 px-1 outline-none text-sm bg-transparent"
              />
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded-full"
                onClick={() => setIsSearchOpen(false)}
              >
                <FaTimes className="text-gray-400 w-3 h-3" />
              </button>
            </div>
          </Motion.motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <Motion.motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            id="mobile-menu"
            ref={mobileMenuRef}
            className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden overflow-hidden z-50"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.id}
                  to={link.id}
                  className={({ isActive }) => `
                    relative text-base font-medium flex items-center gap-3 w-full
                    py-3 px-4 rounded-xl transition-all duration-300
                    ${
                      isActive
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                    }
                  `}
                  onClick={closeMenu}
                  aria-current={activeLink === link.id ? "page" : undefined}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                    {React.cloneElement(link.icon, { className: "w-4 h-4" })}
                    {link.hasNotification && (
                      <span className="absolute top-2 right-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                  </span>
                  <span>{link.label}</span>
                </NavLink>
              ))}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link to="/login" className="w-full" onClick={closeMenu}>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 rounded-xl font-medium text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  >
                    <FaUser className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                </Link>
              </div>
            </div>
          </Motion.motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <button
        type="button"
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden hidden"
        style={{ opacity: 0 }}
        onClick={closeMenu}
        aria-label="Close menu"
      />
    </nav>
  );
};

export default Navbar;
