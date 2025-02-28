import React, { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCalendarAlt, FaBook, FaQuestionCircle } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  // Refs
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const buttonRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const overlayRef = useRef(null);

  // Navigation links with icons
  const navLinks = [
    {
      id: "/events",
      label: "EVENTS",
      icon: <FaCalendarAlt className="w-4 h-4" />,
    },
    {
      id: "curriculum",
      label: "CURRICULUM",
      icon: <FaBook className="w-4 h-4" />,
    },
    {
      id: "help",
      label: "HELP",
      icon: <FaQuestionCircle className="w-4 h-4" />,
    },
  ];

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
    };

    // Add global click listener
    document.addEventListener("click", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen]);

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
      gsap.from(linksRef.current, {
        y: -30,
        rotation: -10,
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
        immediateRender: false, // This prevents initial invisible state
        overwrite: "auto",
      });

      // Scroll trigger for navbar background
      ScrollTrigger.create({
        start: "top top",
        end: "max",
        onUpdate: (self) => {
          navbarRef.current.classList.toggle("scrolled", self.progress > 0.05);
        },
      });
    },
    { scope: navbarRef }
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

  // Scroll detection for active link
  useGSAP(() => {
    const handleScroll = () => {
      const sections = ["events", "curriculum", "help"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          element.offsetTop <= scrollPosition &&
          element.offsetTop + element.offsetHeight > scrollPosition
        ) {
          setActiveLink(section);
          return;
        }
      }
      setActiveLink("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent event from bubbling to document
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLinkClick = (id, e) => {
    if (e) {
      e.preventDefault();
    }
    setActiveLink(id);
    closeMenu();

    const element = document.getElementById(id);
    if (element) {
      gsap.to(window, {
        duration: 1,
        scrollTo: { y: element, offsetY: 80 },
        ease: "power3.inOut",
      });
    }
  };

  return (
    <nav
      ref={navbarRef}
      className="fixed top-0 w-full z-50 bg-white/90  py-4 transition-all duration-300 scrolled:bg-white scrolled:shadow-lg scrolled:py-2 opacity-95 "
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={"/"}>
          <a
            ref={logoRef}
            href="#home"
            className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-all duration-300 flex items-center group"
            // onClick={(e) => {
            //   e.preventDefault();
            //   handleLinkClick("home", e);
            // }}
          >
            <div className="w-10 h-10 rounded-lg  flex items-center justify-center mr-3 group-hover:rotate-12 transition-transform duration-300">
              <img
                src="./CodingClubLogoSmall.png"
                alt="Coding Club"
                className="size-10"
              />
            </div>
            <span className="relative">
              {/* code crusaders */}
              <img
                src="./CodingClubLogo.png"
                alt="Coding Club"
                className="w-40"
              />
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link, index) => (
            <a
              key={link.id}
              ref={(el) => (linksRef.current[index] = el)}
              href={`#${link.id}`}
              className={`group relative font-medium text-sm tracking-wider flex items-center gap-2 ${
                activeLink === link.id
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-500"
              } transition-colors duration-300`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id, e);
              }}
            >
              <Link to={link.id} className="flex items-center gap-2">
                <span
                  className={`${
                    activeLink === link.id
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-600"
                  } transition-colors duration-300`}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
                    activeLink === link.id ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </a>
          ))}
          <Link to="/login">
            <button
              ref={buttonRef}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-[10px] rounded-xl font-medium text-sm text-white hover:from-indigo-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Become a Member
            </button>
          </Link>
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
        className="absolute top-full left-0 w-full bg-white bg- shadow-lg md:hidden overflow-hidden h-0 opacity-0 z-50"
      >
        <div className="flex flex-col items-center gap-4 p-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={`text-lg font-medium flex items-center gap-2 ${
                activeLink === link.id
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-500"
              } transition-colors duration-300`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick(link.id, e);
              }}
            >
              <Link to={link.id} className="flex items-center gap-2">
                {React.cloneElement(link.icon, { className: "w-5 h-5" })}
                <span>{link.label}</span>
              </Link>
            </a>
          ))}
          <Link to="/login">
            <button
              ref={buttonRef}
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-[10px] rounded-xl font-medium text-sm text-white hover:from-indigo-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300"
            >
              Become a Member
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden hidden"
        style={{ opacity: 0 }}
        onClick={closeMenu}
      />
    </nav>
  );
};

export default Navbar;
