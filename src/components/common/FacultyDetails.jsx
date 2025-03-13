import React, { useRef, useEffect, useCallback, useState } from "react";
import FacultyCard from "./FacultyCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useFaculty } from "@/components/faculty/FacultyContext";

gsap.registerPlugin(useGSAP);

const FacultyDetails = () => {
  const sectionRef = useRef(null);
  const { faculty, loading, fetchFaculty } = useFaculty();
  const [facultyMembers, setFacultyMembers] = useState([]);

  useEffect(() => {
    if (faculty.length === 0 && !loading) {
      fetchFaculty();
    }

    // Format faculty data for display
    if (faculty.length > 0) {
      const formattedFaculty = faculty.map((member) => ({
        id: member._id || member.id,
        name: member.name,
        role: member.position || member.title || "Faculty Member",
        quote:
          member.bio || member.description || "Faculty member at Coding Club",
        imageSrc:
          member.avatar || member.image || "https://via.placeholder.com/150",
        altText: member.name,
      }));
      setFacultyMembers(formattedFaculty);
    }
  }, [faculty, loading, fetchFaculty]);

  // GSAP animations for faculty cards
  useGSAP(
    () => {
      if (facultyMembers.length === 0) return;

      const cards = gsap.utils.toArray(".testimonial-card");
      gsap.set(cards, { opacity: 0, y: 50 });

      // Stagger animation for faculty cards
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
    if (!scrollRef.current) return;

    // Event handlers
    const handleMouseDown = (e) => {
      isDragging.current = true;
      scrollRef.current.classList.add("active");
      startXPos.current = e.pageX - scrollRef.current.offsetLeft;
      scrollLeftPos.current = scrollRef.current.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDragging.current = false;
      scrollRef.current.classList.remove("active");
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      scrollRef.current.classList.remove("active");
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startXPos.current) * 2;
      scrollRef.current.scrollLeft = scrollLeftPos.current - walk;
    };

    // Add event listeners
    scrollRef.current.addEventListener("mousedown", handleMouseDown);
    scrollRef.current.addEventListener("mouseleave", handleMouseLeave);
    scrollRef.current.addEventListener("mouseup", handleMouseUp);
    scrollRef.current.addEventListener("mousemove", handleMouseMove);

    // Cleanup function
    return () => {
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("mousedown", handleMouseDown);
        scrollRef.current.removeEventListener("mouseleave", handleMouseLeave);
        scrollRef.current.removeEventListener("mouseup", handleMouseUp);
        scrollRef.current.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    const cleanup = handleScroll();
    return cleanup;
  }, [handleScroll]);

  // If loading, show a simple loading indicator
  if (loading && facultyMembers.length === 0) {
    return (
      <div className="text-center py-10 text-blue-100">
        Loading faculty members...
      </div>
    );
  }

  // If no faculty data, show a message
  if (!loading && facultyMembers.length === 0) {
    return (
      <div className="text-center py-10 text-blue-100">
        No faculty members available at this time.
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
        {facultyMembers.map((member, index) => (
          <div
            key={member.id}
            className="testimonial-card flex-shrink-0 w-full max-w-md"
          >
            <FacultyCard
              imageSrc={member.imageSrc}
              altText={member.altText}
              quote={member.quote}
              name={member.name}
              role={member.role}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDetails;
