import React, { useRef, useEffect } from "react";
import TestimonialCard from "./TestimonialCard.jsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);

  // Enhanced testimonials data
  const testimonials = [
    {
      imageSrc: "../../rajshekar.jpg",
      altText: "Dr. Chandra Shekar",
      quote:
        "The expect in anything was once a beginner. so, keep learning and keep growing. I'm excited to help you learn to code. ",
      name: "Dr. Chandra Shekar",
      role: "Computer Science Professor  & Head of Department",
    },
    {
      imageSrc: "../../rina.jpg",
      altText: "Dr. Rina Kumari",
      quote:
        "The science of today is the technology of tomorrow. I'm excited to help you learn to code and create your own projects.",
      name: "Dr. Rina Kumari",
      role: "Asssiant Professor",
    },
    {
      imageSrc: "../../dipika.jpg",
      altText: "Prof. Deepika Shukla",
      quote:
        "The interactive lessons are engaging and fun. I can't wait to see what I'll create next!",
     
      name: "Prof. Deepika Shukla",
      role: "Computer Science Major",
    },
    {
      imageSrc: "../../alam.jpg",
      altText: "Md Mohtab Alam",
      quote:
        "Programming isn't as hard as I thought. The lessons are broken down into manageable chunks, which makes learning to code less intimidating.",
      name: "Md Mohtab Alam",
      role: "Assistant Professor",
    },
    {
      imageSrc: "../../santosh.jpg",
      altText: "Prof. Santosh prasad",
      quote:
        "I love the interactive lessons and challenges. As a faculty member, I will share my experiences and thoughts with you during your learning journey.",
      name: "Prof. Santosh prasad",
      role: "Assistant Professor",
    },
    {
      imageSrc: "../../shurbhi.jpg",
      altText: "Prof. Surbhi Rani",
      quote:
        "Programming is a valuable skill to learn. I'm excited to help you learn to code and create your own projects.",
      name: "Prof. Surbhi Rani",
      role: "Assistant Professor",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;

    // GSAP animation for the heading
    gsap.fromTo(
      ".testimonials-heading",
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
    );

    // GSAP animation for the intro text
    gsap.fromTo(
      ".testimonials-intro",
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.3 }
    );

    // Scroll animation
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;

      if (
        scrollPosition > sectionTop - windowHeight * 0.7 &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        gsap.to(".testimonials-container", { opacity: 1, y: 0, duration: 0.8 });
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={sectionRef} className="container mx-auto px-4">
      <div className="testimonials-container opacity-0 translate-y-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={index}
            index={index}
            imageSrc={testimonial.imageSrc}
            altText={testimonial.altText}
            quote={testimonial.quote}
            name={testimonial.name}
            role={testimonial.role}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
