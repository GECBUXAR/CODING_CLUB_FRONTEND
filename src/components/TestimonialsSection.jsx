// import React from "react";
// import TestimonialCard from "./TestimonialCard";

// const TestimonialsSection = () => {
//   // Sample Data for Testimonials
//   const testimonials = [
//     {
//       imageSrc: "https://via.placeholder.com/150",
//       altText: "Liza Furgezan",
//       quote: "Creating web games was easier than I thought.",
//       name: "Liza Furgezan",
//     },
//     {
//       imageSrc: "https://via.placeholder.com/150",
//       altText: "Mark Anderson",
//       quote:
//         "The chat with the tutors is good because I can get help as soon as I get stuck.",
//       name: "Mark Anderson",
//     },
//     {
//       imageSrc: "https://via.placeholder.com/150",
//       altText: "Emily Cleara",
//       quote: "It's like solving a puzzle. Coding is fun.",
//       name: "Emily Cleara",
//     },
//     {
//       imageSrc: "https://via.placeholder.com/150",
//       altText: "John Doe",
//       quote: "Learning to code changed my career path.",
//       name: "John Doe",
//     },
//     {
//       imageSrc: "https://via.placeholder.com/150",
//       altText: "Jane Smith",
//       quote: "I love the interactive lessons and challenges.",
//       name: "Jane Smith",
//     },
//   ];

//   return (
//     <div className="container mx-auto">
//       {/* Responsive Layout */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//         {testimonials.map((testimonial, index) => (
//           <TestimonialCard
//             key={index}
//             imageSrc={testimonial.imageSrc}
//             altText={testimonial.altText}
//             quote={testimonial.quote}
//             name={testimonial.name}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TestimonialsSection;

import React, { useRef, useEffect } from "react";
import TestimonialCard from "./TestimonialCard.jsx";
import gsap from "gsap";

const TestimonialsSection = () => {
  const sectionRef = useRef(null);

  // Enhanced testimonials data
  const testimonials = [
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Liza Furgezan",
      quote:
        "Creating web games was easier than I thought. The step-by-step tutorials made complex concepts accessible.",
      name: "Liza Furgezan",
      role: "Game Development Student",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Mark Anderson",
      quote:
        "The chat with the tutors is good because I can get help as soon as I get stuck. It's like having a mentor available 24/7.",
      name: "Mark Anderson",
      role: "Web Development Bootcamp",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Emily Cleara",
      quote:
        "It's like solving a puzzle. Coding is fun, and the interactive challenges keep me motivated to learn more.",
      name: "Emily Cleara",
      role: "Computer Science Major",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "John Doe",
      quote:
        "Learning to code changed my career path. I was a teacher, and now I work as a full-stack developer.",
      name: "John Doe",
      role: "Career Switcher",
    },
    {
      imageSrc: "/api/placeholder/150/150",
      altText: "Jane Smith",
      quote:
        "I love the interactive lessons and challenges. The faculty is knowledgeable and supportive throughout the learning process.",
      name: "Jane Smith",
      role: "Data Science Student",
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
      {/* <h2 className="testimonials-heading text-3xl md:text-4xl font-bold text-center mb-4 text-white">
        What Our Students Say
      </h2>

      <p className="testimonials-intro text-center text-blue-100 mb-12 max-w-2xl mx-auto">
        Our students come from diverse backgrounds but share a common passion
        for learning. Here's what they have to say about their educational
        journey with us.
      </p> */}

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
