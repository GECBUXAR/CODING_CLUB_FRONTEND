import React, { useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Events = () => {
  // Refs for animations
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef([]);

  const events = [
    {
      id: 1,
      title: "Quiz Competition on C Programing",
      date: "2023-11-15",
      time: "10:00 AM - 4:00 PM",
      location: "Academic buildings, Room 110",
      category: "Workshop",
      skillLevel: "Beginner",
      description:
        "Learn the fundamentals of C Programing and make your Consept clear with the help of Quiz Competition.",
      speakers: ["Club Coordinators"],
    },
    // {
    //   id: 2,
    //   title: "AI and Machine Learning Bootcamp",
    //   date: "2023-11-20",
    //   time: "9:00 AM - 5:00 PM",
    //   location: "Innovation Lab",
    //   category: "Bootcamp",
    //   skillLevel: "Intermediate",
    //   description:
    //     "Dive into AI and ML concepts with hands-on projects and expert guidance. Perfect for those with basic Python knowledge.",
    //   speakers: ["Alex Johnson", "Maria Garcia"],
    // },
    // {
    //   id: 3,
    //   title: "Blockchain Basics Seminar",
    //   date: "2023-11-25",
    //   time: "2:00 PM - 6:00 PM",
    //   location: "Virtual Event",
    //   category: "Seminar",
    //   skillLevel: "Beginner",
    //   description:
    //     "Understand blockchain technology and its applications in various industries with real-world examples.",
    //   speakers: ["Michael Chen"],
    // },
    // {
    //   id: 4,
    //   title: "UX/UI Design Meetup",
    //   date: "2023-12-05",
    //   time: "11:00 AM - 3:00 PM",
    //   location: "Student Union, Creative Commons",
    //   category: "Meetup",
    //   skillLevel: "All Levels",
    //   description:
    //     "Join fellow design enthusiasts to discuss user experience and interface design through practical exercises.",
    //   speakers: ["Sarah Wilson"],
    // },
  ];

  useGSAP(
    () => {
      // Ensure elements exist before animating
      if (headerRef.current && cardsRef.current.length) {
        // Header animation
        gsap.from(headerRef.current, {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          immediateRender: false, // Prevent initial flicker
        });

        // Cards animation with ScrollTrigger
        gsap.from(cardsRef.current, {
          y: 100,
          opacity: 0,
          duration: 1.8,
          stagger: 0.2,
          ease: "power4.out",
          immediateRender: false, // Important for SSR frameworks
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 15%",
            toggleActions: "play none none none",
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [events] }
  );

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section
      ref={sectionRef}
      className="w-full px-6 py-16 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      {/* Header */}
      <div ref={headerRef} className="container mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-800 mb-2">
              Upcoming Events
            </h2>
            <p className="text-indigo-600 max-w-2xl">
              Join our coding club community and level up your skills with these
              exciting events
            </p>
          </div>
          <Link to={"/events"}>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2">
              <span>View All Events</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      {/* <div className="container mx-auto mb-8 overflow-x-auto">
        <div className="flex space-x-2 pb-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium shadow whitespace-nowrap">
            All Events
          </button>
          <button className="px-4 py-2 bg-white text-indigo-700 rounded-full text-sm font-medium shadow hover:bg-indigo-50 transition-colors whitespace-nowrap">
            Workshops
          </button>
          <button className="px-4 py-2 bg-white text-indigo-700 rounded-full text-sm font-medium shadow hover:bg-indigo-50 transition-colors whitespace-nowrap">
            Seminars
          </button>
          <button className="px-4 py-2 bg-white text-indigo-700 rounded-full text-sm font-medium shadow hover:bg-indigo-50 transition-colors whitespace-nowrap">
            Bootcamps
          </button>
          <button className="px-4 py-2 bg-white text-indigo-700 rounded-full text-sm font-medium shadow hover:bg-indigo-50 transition-colors whitespace-nowrap">
            Meetups
          </button>
        </div>
      </div> */}

      {/* Event Cards */}
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map((event, index) => (
          <div
            key={event.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform"
          >
            {/* Card Header with Category Tag */}
            <div className="relative bg-indigo-600 h-3">
              <span className="absolute top-2 right-3 bg-white px-3 py-1 rounded-full text-xs font-semibold text-indigo-700">
                {event.category}
              </span>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Date and Time */}
              <div className="flex items-center mb-4 text-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">
                  {formatDate(event.date)} • {event.time}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Location */}
              <div className="flex items-center mb-4 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">{event.location}</span>
              </div>

              {/* Skill Level and RSVP */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                  {event.skillLevel}
                </span>
                <Link to={"/events"}>
                  <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Join Club CTA */}
      <div className="container mx-auto mt-12 bg-indigo-700 rounded-xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white">
            <h3 className="text-2xl font-bold mb-2">Join Our Coding Club</h3>
            <p className="text-indigo-200 max-w-2xl">
              Become a member to get exclusive access to all events, workshops,
              project collaborations, and networking opportunities.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-700 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors duration-300 font-medium">
            Become a Member
          </button>
        </div>
      </div>
    </section>
  );
};

export default Events;
