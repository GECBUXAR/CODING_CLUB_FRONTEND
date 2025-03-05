// ThreeDCard component for 3D card effect

"use client";
import { useState, useRef } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

export const ThreeDCard = ({ children, className, intensity = 10 }) => {
  const [rotate, setRotate] = useState({
    x: 0,
    y: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const rotateX = ((mouseY - height / 2) / height) * intensity;
    const rotateY = ((width / 2 - mouseX) / width) * intensity;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative transition-transform duration-200", className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
    >
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500/5 via-transparent to-fuchsia-500/5"
        style={{
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      {children}
    </div>
  );
};

ThreeDCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  intensity: PropTypes.number,
};
