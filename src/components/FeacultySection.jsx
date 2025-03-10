import React, { useEffect } from "react";
import FacultyDetails from "./FacultyDetails.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Faculty = () => {
  useEffect(() => {
    // Create a parallax effect for the background pattern
    gsap.to(".bg-pattern", {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".faculty-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <section className="faculty-section relative bg-gradient-to-b from-blue-600 to-blue-800 text-white py-20 px-4 overflow-hidden">
      {/* Background pattern */}
      <div
        className="bg-pattern absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/api/placeholder/100/100')",
          backgroundSize: "60px 60px",
        }}
      ></div>

      {/* Content container */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-blue-900 bg-opacity-50 text-blue-100 rounded-full text-sm mb-4">
              Meet Our Team
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Expert Faculty
            </h1>
            <p className="max-w-2xl mx-auto text-blue-100">
              Our faculty members are industry professionals and academic
              experts dedicated to providing you with the knowledge and skills
              needed to succeed in today's technology-driven world.
            </p>
          </div>

          {/* FacultyDetails */}
          <FacultyDetails />
        </div>
      </div>
    </section>
  );
};

export default Faculty;
