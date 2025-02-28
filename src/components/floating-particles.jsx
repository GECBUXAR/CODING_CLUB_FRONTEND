// // FloatingParticles component that creates floating particles on the screen

// "use client";

// import { useRef, useEffect } from "react";
// import gsap from "gsap";

// export const FloatingParticles = ({
//   count = 15,
//   color = "white",
//   minSize = 2,
//   maxSize = 6,
//   minDuration = 10,
//   maxDuration = 30,
// }) => {
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const container = containerRef.current;
//     const particles = [];

//     // Create particles
//     for (let i = 0; i < count; i++) {
//       const particle = document.createElement("div");
//       const size = Math.random() * (maxSize - minSize) + minSize;

//       particle.className = "absolute rounded-full opacity-20";
//       particle.style.width = `${size}px`;
//       particle.style.height = `${size}px`;
//       particle.style.backgroundColor = color;
//       particle.style.left = `${Math.random() * 100}%`;
//       particle.style.top = `${Math.random() * 100}%`;

//       container.appendChild(particle);
//       particles.push(particle);

//       // Animate each particle
//       animateParticle(particle);
//     }

//     function animateParticle(particle) {
//       const duration =
//         Math.random() * (maxDuration - minDuration) + minDuration;

//       gsap.to(particle, {
//         x: gsap.utils.random(-100, 100),
//         y: gsap.utils.random(-100, 100),
//         opacity: gsap.utils.random(0.1, 0.3),
//         scale: gsap.utils.random(0.8, 1.5),
//         duration: duration,
//         ease: "sine.inOut",
//         onComplete: () => {
//           gsap.set(particle, {
//             x: 0,
//             y: 0,
//             opacity: 0.2,
//             scale: 1,
//           });
//           animateParticle(particle);
//         },
//       });
//     }

//     return () => {
//       // Clean up animations when component unmounts
//       particles.forEach((particle) => {
//         gsap.killTweensOf(particle);
//         if (container.contains(particle)) {
//           container.removeChild(particle);
//         }
//       });
//     };
//   }, [count, color, minSize, maxSize, minDuration, maxDuration]);

//   return (
//     <div
//       ref={containerRef}
//       className="absolute inset-0 overflow-hidden pointer-events-none"
//     />
//   );
// };

"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap-trial"; // Changed to match import in main component

export const FloatingParticles = ({
  count = 15,
  color = "white",
  minSize = 2,
  maxSize = 6,
  minDuration = 10,
  maxDuration = 30,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const particles = [];

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * (maxSize - minSize) + minSize;

      particle.className = "absolute rounded-full opacity-20";
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      container.appendChild(particle);
      particles.push(particle);

      // Animate each particle
      animateParticle(particle);
    }

    function animateParticle(particle) {
      const duration =
        Math.random() * (maxDuration - minDuration) + minDuration;

      gsap.to(particle, {
        x: gsap.utils.random(-100, 100),
        y: gsap.utils.random(-100, 100),
        opacity: gsap.utils.random(0.1, 0.3),
        scale: gsap.utils.random(0.8, 1.5),
        duration: duration,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.set(particle, {
            x: 0,
            y: 0,
            opacity: 0.2,
            scale: 1,
          });
          animateParticle(particle);
        },
      });
    }

    return () => {
      // Clean up animations when component unmounts
      particles.forEach((particle) => {
        gsap.killTweensOf(particle);
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      });
    };
  }, [count, color, minSize, maxSize, minDuration, maxDuration]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
    />
  );
};

export default FloatingParticles;
