// FacultyCard.jsx
import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const FacultyCard = ({ imageSrc, altText, quote, name, role, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    // GSAP animation on mount
    gsap.fromTo(
      card,
      {
        y: 50,
        opacity: 0,
        scale: 0.9,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: 0.1 * index,
        ease: "power3.out",
      }
    );

    // Hover animations
    const enterAnimation = () => {
      gsap.to(card, {
        y: -10,
        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)",
        duration: 0.3,
      });
    };

    const leaveAnimation = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
        duration: 0.3,
      });
    };

    card.addEventListener("mouseenter", enterAnimation);
    card.addEventListener("mouseleave", leaveAnimation);

    return () => {
      card.removeEventListener("mouseenter", enterAnimation);
      card.removeEventListener("mouseleave", leaveAnimation);
    };
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col bg-white rounded-xl overflow-hidden shadow-lg"
    >
      <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-blue-500 rounded-full z-0 opacity-20" />

      <div className="flex flex-col md:flex-row items-center p-6 z-10">
        <div className="mb-4 md:mb-0 md:mr-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 shadow-inner">
            <img
              src={imageSrc}
              alt={altText}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="text-blue-500 text-4xl font-serif absolute top-4 right-6 z-0">
            "
          </div>
          <p className="text-gray-700 italic mb-3 relative z-10 text-sm md:text-base">
            {quote}
          </p>
          <div className="flex items-center">
            <div className="h-px bg-blue-200 w-12 mr-3" />
            <div>
              <p className="font-bold text-blue-600">{name}</p>
              {role && <p className="text-xs text-gray-500">{role}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
