import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { LinkIcon } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const Hero = () => {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const buttonRef = useRef(null);
  const illustrationRef = useRef(null);

  useEffect(() => {
    // GSAP Animation Timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
      .fromTo(
        subheadingRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        buttonRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        illustrationRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.6"
      );

    // Parallax effect on scroll
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (heroRef.current && scrollPosition < window.innerHeight) {
        gsap.to(heroRef.current.querySelector(".hero-bg"), {
          y: scrollPosition * 0.4,
          duration: 0.1,
        });
        gsap.to(illustrationRef.current, {
          y: scrollPosition * -0.2,
          duration: 0.1,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="w-full h-screen overflow-hidden relative flex items-center pt-16"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent z-20"></div>

      {/* Background Image with Animation */}
      <div className="absolute inset-0 z-10 hero-bg">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          alt="Background"
          src="./background_enhanced.png"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/1920x1080";
          }}
          loading="lazy"
        />
      </div>

      {/* Animated Overlay Elements */}
      <div className="absolute inset-0 z-15">
        <div className="absolute top-0 right-0 h-full w-1/3 bg-blue-600/10 backdrop-blur-sm rounded-bl-[100px] transform -skew-x-12"></div>
        <div className="absolute bottom-0 left-0 h-1/3 w-full">
          <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 w-full">
            <svg viewBox="0 0 1440 200" className="w-full h-auto">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,96L48,117.3C96,139,192,181,288,181.3C384,181,480,139,576,117.3C672,96,768,96,864,122.7C960,149,1056,203,1152,202.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="container mx-auto z-30 flex flex-col md:flex-row items-center justify-between px-6 md:px-8 lg:px-16 h-full">
        {/* Left Content */}
        <div className="w-full md:w-1/2 lg:w-5/12 text-white mt-16 md:mt-0">
          <div className="space-y-6">
            <h1
              ref={headingRef}
              className="text-[clamp(2.5rem,7vw,5rem)] font-bold text-white leading-none"
            >
              Learn To <span className="text-blue-500">Code</span>
            </h1>

            <p
              ref={subheadingRef}
              className="text-[clamp(1.2rem,3vw,2rem)] font-medium"
            >
              Because The World
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Runs On Code.
              </span>
            </p>

            <div
              ref={buttonRef}
              className="flex flex-wrap justify-start items-center gap-4"
            >
              <button
                className="bg-indigo-600 px-8 py-3 font-semibold rounded-xl transition-all duration-300 hover:bg-indigo-500 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 active:translate-y-0"
                aria-label="Get started with learning to code"
              >
                <Link to={"/signup"}>
                  <span className="mr-2">{"GET STARTED"} </span>
                </Link>
              </button>

              <button
                className="bg-transparent border-2 border-white px-8 py-2 font-semibold rounded-xl transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50 active:translate-y-0"
                aria-label="Learn more about our coding program"
              >
                LEARN MORE
              </button>
            </div>

            {/* Stats or Social Proof
            <div className="flex items-center gap-8 mt-8 opacity-90">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-blue-400">10k+</span>
                <span className="text-sm">Students</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-blue-400">50+</span>
                <span className="text-sm">Courses</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-blue-400">96%</span>
                <span className="text-sm">Success rate</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Illustration */}
        <div ref={illustrationRef} className="hidden md:block w-1/2 lg:w-6/12">
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/30 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-60 h-60 bg-purple-500/20 rounded-full filter blur-3xl"></div>

            {/* Main Illustration */}
            <img
              className="w-full h-auto object-contain relative z-10"
              alt="Illustration of coding"
              src="./illustration.png"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x400";
              }}
              loading="lazy"
            />

            {/* Floating Elements */}
            <div className="absolute top-1/4 left-1/4 animate-float-slow">
              <div className="bg-blue-400/80 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">⚛️</span>
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4 animate-float">
              <div className="bg-orange-400/80 backdrop-blur-sm w-12 h-12 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-30 animate-bounce">
        <div className="flex flex-col items-center text-white/80">
          <span className="text-sm uppercase tracking-wider mb-2">
            Scroll Down
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 13L12 18L17 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 7L12 12L17 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
