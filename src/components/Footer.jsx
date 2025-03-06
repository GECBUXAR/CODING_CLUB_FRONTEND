import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, useGSAP);

const Footer = () => {
  // Create refs for animated elements
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const navColumnsRef = useRef(null);
  const newsletterRef = useRef(null);
  const socialIconsRef = useRef(null);
  const bottomBarRef = useRef(null);

  // Social media links
  const socialLinks = [
    { icon: "github", url: "https://github.com/coding-club" },
    { icon: "twitter", url: "https://twitter.com/coding-club" },
    { icon: "discord", url: "https://discord.gg/coding-club" },
    { icon: "instagram", url: "https://www.instagram.com/code_crusaders_?igsh=MXh5M3pxcmdlMDYzYQ%3D%3D&utm_source=qr" },
  ];

  // GSAP animations
  // useEffect(() => {
  //   // Stagger animation for the footer sections
  //   gsap.fromTo(
  //     [logoRef.current, navColumnsRef.current, newsletterRef.current],
  //     { y: 50, opacity: 0 },
  //     {
  //       y: 0,
  //       opacity: 1,
  //       duration: 0.8,
  //       stagger: 0.2,
  //       ease: "power2.out",
  //       scrollTrigger: {
  //         trigger: footerRef.current,
  //         start: "top 90%",
  //       },
  //     }
  //   );

  //   // Separate animation for social icons with a bounce effect
  //   gsap.fromTo(
  //     socialIconsRef.current.children,
  //     { scale: 0, opacity: 0 },
  //     {
  //       scale: 1,
  //       opacity: 1,
  //       duration: 0.4,
  //       stagger: 0.1,
  //       ease: "back.out(1.7)",
  //       scrollTrigger: {
  //         trigger: socialIconsRef.current,
  //         start: "top 95%",
  //       },
  //     }
  //   );

  //   // Fade in animation for bottom bar
  //   gsap.fromTo(
  //     bottomBarRef.current,
  //     { opacity: 0 },
  //     {
  //       opacity: 1,
  //       duration: 1,
  //       delay: 0.5,
  //       ease: "power1.inOut",
  //       scrollTrigger: {
  //         trigger: bottomBarRef.current,
  //         start: "top 100%",
  //       },
  //     }
  //   );

  //   // Cleanup function
  //   return () => {
  //     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  //   };
  // }, []);

  useGSAP(
    () => {
      // Main content animation
      gsap.from(
        [logoRef.current, navColumnsRef.current, newsletterRef.current],
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      );

      gsap.from(socialIconsRef.current?.children || [], {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)",
        immediateRender: false,
        scrollTrigger: {
          trigger: socialIconsRef.current,
          start: "top 95%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(bottomBarRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power1.inOut",
        immediateRender: false,
        scrollTrigger: {
          trigger: bottomBarRef.current,
          start: "top 100%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: footerRef }
  );

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gradient-to-br from-indigo-900 to-[#022332] text-white pt-16 pb-6"
    >
      {/* Wave SVG Divider */}
      {/* <div className="relative -mt-16 mb-8">
        <svg
          className="absolute bottom-0 w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#022332"
            fillOpacity="0.8"
            d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,80C672,85,768,139,864,138.7C960,139,1056,85,1152,74.7C1248,64,1344,96,1392,112L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div> */}

      {/* Main Content */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Mission */}
          <div ref={logoRef} className="lg:col-span-1">
            <div className="flex items-center mb-4">
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
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                Code Crusaders
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering students to explore, create, and innovate through code.
              Join our community of passionate developers.
            </p>
            <div className="text-sm text-gray-400">
              <p className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Academic buildings, Room 110
              </p>
              <p className="flex items-center mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                contact@codingclub.edu
              </p>
              <p className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Meetings: Wednesdays @ 4PM
              </p>
            </div>
          </div>

          {/* Navigation Columns */}
          <div ref={navColumnsRef} className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold text-indigo-300 mb-4">
                  Resources
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#tutorials"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Tutorials
                    </a>
                  </li>
                  <li>
                    <a
                      href="#workshops"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Workshops
                    </a>
                  </li>
                  <li>
                    <a
                      href="#projects"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Projects
                    </a>
                  </li>
                  <li>
                    <a
                      href="#github"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> GitHub Repos
                    </a>
                  </li>
                </ul>
              </div>

              {/* Community */}
              <div>
                <h4 className="text-lg font-semibold text-indigo-300 mb-4">
                  Community
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#events"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Events
                    </a>
                  </li>
                  <li>
                    <a
                      href="#discord"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href="#forum"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Forum
                    </a>
                  </li>
                  <li>
                    <a
                      href="#hackathons"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Hackathons
                    </a>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="text-lg font-semibold text-indigo-300 mb-4">
                  Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#help"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Help Center
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="#contact"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#feedback"
                      className="text-gray-300 hover:text-indigo-300 transition-colors duration-300 flex items-center"
                    >
                      <span className="mr-1">›</span> Feedback
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div ref={newsletterRef} className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-indigo-300 mb-4">
              Stay Updated
            </h4>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest events, workshops, and
              resources.
            </p>
            <form className="mb-4">
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-indigo-900/50 border border-indigo-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>

            {/* Social Media Links */}
            <div>
              <h4 className="text-sm font-semibold text-indigo-300 mb-3">
                Follow Us
              </h4>
              <div ref={socialIconsRef} className="flex space-x-3">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-indigo-800/50 hover:bg-indigo-600 p-2 rounded-full transition-colors duration-300"
                  >
                    {link.icon === "github" && (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    )}
                    {link.icon === "twitter" && (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.057 10.057 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548z" />
                      </svg>
                    )}
                    {link.icon === "discord" && (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                      </svg>
                    )}
                    {link.icon === "instagram" && (
                      <svg
                        className="h-5 w-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-indigo-800/50 my-8"></div>

        {/* Bottom Bar */}
        <div
          ref={bottomBarRef}
          className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400"
        >
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Coding Club. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#terms"
              className="hover:text-indigo-300 transition-colors duration-300"
            >
              Terms of Use
            </a>
            <a
              href="#privacy"
              className="hover:text-indigo-300 transition-colors duration-300"
            >
              Privacy Policy
            </a>
            <a
              href="#cookies"
              className="hover:text-indigo-300 transition-colors duration-300"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
