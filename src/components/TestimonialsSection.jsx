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
      imageSrc: "/api/placeholder/150/150",
      altText: "Dr. Chandra Shekar",
      quote:
        "Creating web games was easier than I thought. The step-by-step tutorials made complex concepts accessible.",
      name: "Dr. Chandra Shekar",
      role: "Computer Science Professor  & Head of Department",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Dr. Rina Kumari",
      quote:
        "The chat with the tutors is good because I can get help as soon as I get stuck. It's like having a mentor available 24/7.",
      name: "Dr. Rina Kumari",
      role: "Asssiant Professor",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Prof. Deepika Shukla",
      quote:
        "The interactive lessons are engaging and fun. I can't wait to see what I'll create next!",
     
      name: "Prof. Deepika Shukla",
      role: "Computer Science Major",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Md Mohtab Alam",
      quote:
        "Learning to code changed my career path. I was a teacher, and now I work as a full-stack developer.",
      name: "Md Mohtab Alam",
      role: "Assistant Professor",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Prof. Santoosh prasad",
      quote:
        "I love the interactive lessons and challenges. The faculty is knowledgeable and supportive throughout the learning process.",
      name: "Prof. Santoosh prasad",
      role: "Assistant Professor",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Prof. Surbhi Rani",
      quote:
        "The faculty is knowledgeable and supportive. They provide helpful feedback and guidance.",
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
