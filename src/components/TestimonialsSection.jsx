import React, { useRef, useEffect, useCallback } from "react";
import TestimonialCard from "./TestimonialCard.jsx";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useFaculty } from "@/contexts/faculty-context";

gsap.registerPlugin(useGSAP);

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const { testimonials, loading, fetchTestimonials } = useFaculty();

  // Make sure we have testimonial data
  useEffect(() => {
    if (testimonials.length === 0 && !loading) {
      fetchTestimonials();
    }
  }, [testimonials, loading, fetchTestimonials]);

  // Use local data as fallback if context fails
  const localTestimonials = [
    {
      id: "testimonial-raj",
      imageSrc: "/rajshekar.jpg",
      altText: "Dr. Chandra Shekar",
      quote:
        "Creating web games was easier than I thought. The step-by-step tutorials made complex concepts accessible.",
      name: "Dr. Chandra Shekar",
      role: "Computer Science Professor  & Head of Department",
    },
    {
      id: "testimonial-rina",
      imageSrc: "/rina.jpg",
      altText: "Dr. Rina Kumari",
      quote:
        "The chat with the tutors is good because I can get help as soon as I get stuck. It's like having a mentor available 24/7.",
      name: "Dr. Rina Kumari",
      role: "Assistant Professor",
    },
  ];

  // Use context data if available, otherwise fall back to local data
  const displayedTestimonials =
    testimonials.length > 0 ? testimonials : localTestimonials;

  // GSAP animations for testimonials
  useGSAP(
    () => {
      const cards = gsap.utils.toArray(".testimonial-card");
      gsap.set(cards, { opacity: 0, y: 50 });

      // Stagger animation for testimonial cards
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Parallax effect for background
      gsap.to(".testimonials-bg", {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef }
  );

  // Drag scroll functionality
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const startXPos = useRef(0);
  const scrollLeftPos = useRef(0);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      // Create drag scroll effect
      scrollRef.current.addEventListener("mousedown", (e) => {
        isDragging.current = true;
        scrollRef.current.classList.add("active");
        startXPos.current = e.pageX - scrollRef.current.offsetLeft;
        scrollLeftPos.current = scrollRef.current.scrollLeft;
      });

      scrollRef.current.addEventListener("mouseleave", () => {
        isDragging.current = false;
        scrollRef.current.classList.remove("active");
      });

      scrollRef.current.addEventListener("mouseup", () => {
        isDragging.current = false;
        scrollRef.current.classList.remove("active");
      });

      scrollRef.current.addEventListener("mousemove", (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startXPos.current) * 2;
        scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
      });
    }
  }, []);

  useEffect(() => {
    handleScroll();
  }, [handleScroll]);

  // If loading, show a simple loading indicator
  if (loading && testimonials.length === 0) {
    return (
      <div className="text-center py-10 text-blue-100">
        Loading testimonials...
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="relative w-full overflow-hidden">
      <div className="testimonials-bg absolute inset-0 opacity-5" />

      <div
        ref={scrollRef}
        className="flex overflow-x-scroll hide-scrollbar py-8 px-4 gap-6 cursor-grab"
      >
        {displayedTestimonials.map((testimonial, index) => (
          <div
            key={testimonial.id}
            className="testimonial-card flex-shrink-0 w-full max-w-md"
          >
            <TestimonialCard
              imageSrc={testimonial.imageSrc}
              altText={testimonial.altText}
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
