import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import EventCard from "./EventCard";
import ResultPanel from "./ResultPanel";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AllEvents = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const filtersRef = useRef(null);
  const resultsPanelRef = useRef(null);

  // Check if the viewport is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Sample event data - in a real app, this would come from an API
  const events = [
    {
      id: 1,
      eventName: "Web Development Summit",
      description:
        "Join industry experts for a 3-day immersive experience on the latest web technologies. Sessions cover front-end frameworks, back-end architecture, and performance optimization techniques. Networking opportunities with leading developers and tech companies.",
      date: "March 15, 2025",
      time: "9:00 AM",
      location: "Tech Center, Building A",
      attendees: 254,
      category: "Tech",
      isEnrolled: true,
      results: [
        { reg_no: "T001", name: "Alex Johnson", status: "passed", score: 92 },
        { reg_no: "T002", name: "Jamie Smith", status: "passed", score: 88 },
        {
          reg_no: "T003",
          name: "Taylor Wilson",
          status: "pending",
          score: null,
        },
        { reg_no: "T004", name: "Morgan Davis", status: "failed", score: 59 },
        { reg_no: "T005", name: "Casey Brown", status: "passed", score: 78 },
      ],
    },
    {
      id: 2,
      eventName: "AI Research Conference",
      description:
        "Explore cutting-edge developments in artificial intelligence and machine learning. Featuring keynote speakers from leading research institutions and hands-on workshops on implementing AI solutions.",
      date: "April 2, 2025",
      time: "10:30 AM",
      location: "Innovation Hub",
      attendees: 187,
      category: "Tech",
      results: [
        { reg_no: "A001", name: "Jordan Lee", status: "passed", score: 95 },
        { reg_no: "A002", name: "Riley Zhang", status: "passed", score: 91 },
        { reg_no: "A003", name: "Avery Patel", status: "pending", score: null },
      ],
    },
    {
      id: 3,
      eventName: "Digital Marketing Masterclass",
      description:
        "Learn proven strategies for growing your online presence. This masterclass covers social media marketing, content creation, SEO fundamentals, and analytics-driven campaign optimization.",
      date: "March 20, 2025",
      time: "1:00 PM",
      location: "Business Center",
      attendees: 120,
      category: "Business",
      results: [
        { reg_no: "M001", name: "Quinn Roberts", status: "passed", score: 82 },
        { reg_no: "M002", name: "Charlie Wang", status: "failed", score: 64 },
        { reg_no: "M003", name: "Dakota Kim", status: "passed", score: 87 },
        {
          reg_no: "M004",
          name: "Sydney Garcia",
          status: "pending",
          score: null,
        },
      ],
    },
    {
      id: 4,
      eventName: "Sustainable Design Workshop",
      description:
        "A hands-on workshop focused on eco-friendly design principles for products and services. Learn how to incorporate sustainability into your design process without compromising aesthetics or functionality.",
      date: "April 10, 2025",
      time: "11:00 AM",
      location: "Green Design Studio",
      attendees: 75,
      category: "Design",
      results: [
        { reg_no: "D001", name: "Blake Thompson", status: "passed", score: 89 },
        { reg_no: "D002", name: "Rowan Martinez", status: "passed", score: 92 },
        { reg_no: "D003", name: "Hayden Wong", status: "pending", score: null },
      ],
    },
  ];

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Categories derived from events data
  const categories = ["All", ...new Set(events.map((event) => event.category))];

  // Handle showing results for an event
  const handleViewResults = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    setSelectedEvent(event);
    setShowResults(true);

    // Mobile specific behavior
    if (isMobile) {
      // For mobile, slide up from bottom
      if (resultsPanelRef.current) {
        gsap.fromTo(
          resultsPanelRef.current,
          { y: "100%", opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          }
        );
      }
    } else {
      // Desktop behavior - slide in from right
      if (resultsPanelRef.current) {
        gsap.fromTo(
          resultsPanelRef.current,
          { x: "100%", opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          }
        );

        // Shrink the events section (desktop only)
        gsap.to(sectionRef.current, {
          width: "60%",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  // Handle closing results panel
  const handleCloseResults = () => {
    if (resultsPanelRef.current) {
      if (isMobile) {
        // Mobile specific behavior - slide down
        gsap.to(resultsPanelRef.current, {
          y: "100%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setShowResults(false),
        });
      } else {
        // Desktop behavior - slide right
        gsap.to(resultsPanelRef.current, {
          x: "100%",
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setShowResults(false),
        });

        // Restore the events section width (desktop only)
        gsap.to(sectionRef.current, {
          width: "100%",
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }
  };

  // Fallback for cards that might not get animated by ScrollTrigger
  useEffect(() => {
    // Ensure all cards become visible after a short delay
    const timeout = setTimeout(() => {
      const cards = document.querySelectorAll(".event-card-container");
      cards.forEach((card) => {
        if (getComputedStyle(card).opacity === "0") {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
          });
        }
      });
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timeout);
  }, [filteredEvents]); // Re-run when filtered events change

  // Page animation setup
  useGSAP(() => {
    // Header animation
    gsap.from(headerRef.current, {
      y: -30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
    });

    // Filters animation
    gsap.from(filtersRef.current.children, {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power1.out",
      delay: 0.3,
    });

    // Scroll-triggered animations for cards
    const cards = sectionRef.current.querySelectorAll(".event-card-container");

    // Animate cards that are already in view immediately
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight;

      if (isVisible) {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          delay: 0.5 + index * 0.05, // Delay after filters animation
        });
      }

      // Set up scroll trigger for cards that will come into view later
      ScrollTrigger.create({
        trigger: card,
        start: "top bottom-=100",
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            delay: index * 0.05,
          });
        },
        once: true,
      });
    });
  }, []);

  // Category change animation
  useGSAP(() => {
    if (sectionRef.current) {
      gsap.to(sectionRef.current, {
        opacity: 0.8,
        scale: 0.98,
        duration: 0.2,
        onComplete: () => {
          gsap.to(sectionRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        },
      });
    }
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-indigo-950 text-white pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div ref={headerRef} className="mb-8 md:mb-12 pt-4 md:pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3 md:mb-4">
            Upcoming Events
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl">
            Discover and join our exclusive events designed to help you learn,
            connect, and grow in your field.
          </p>
        </div>

        {/* Search and filters */}
        <div ref={filtersRef} className="mb-6 md:mb-10 space-y-4 md:space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 md:py-3 pl-10 pr-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800/70 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}

            <button className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gray-800/70 text-gray-300 hover:bg-gray-700 ml-auto flex items-center gap-1 md:gap-2">
              <AdjustmentsHorizontalIcon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>
        </div>

        {/* Flex container for main content and results panel */}
        <div className="flex items-start gap-4 md:gap-6 relative">
          {/* Events grid */}
          <div
            ref={sectionRef}
            className="flex-1 grid grid-cols-1 gap-4 md:gap-6 transition-all duration-500 ease-in-out"
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div
                  key={event.id}
                  className="event-card-container opacity-0 translate-y-8"
                >
                  <EventCard
                    {...event}
                    index={index}
                    onViewResults={() => handleViewResults(event.id)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 md:py-16">
                <p className="text-gray-400 text-base md:text-lg">
                  No events found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setActiveCategory("All");
                  }}
                  className="mt-4 px-4 md:px-5 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 text-sm md:text-base"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* Results Panel - Conditionally rendered */}
          {showResults && (
            <div
              ref={resultsPanelRef}
              className={`bg-gray-900/90 rounded-2xl border border-indigo-500/20 shadow-2xl backdrop-blur-sm overflow-hidden ${
                isMobile
                  ? "fixed inset-x-0 bottom-0 top-auto h-[85vh] z-50 rounded-b-none"
                  : "sm:w-2/5 fixed right-8 top-32 bottom-24 h-auto"
              }`}
              style={
                isMobile
                  ? { transform: "translateY(100%)", opacity: 0 }
                  : { transform: "translateX(100%)", opacity: 0 }
              }
            >
              <ResultPanel event={selectedEvent} onClose={handleCloseResults} />
            </div>
          )}
        </div>

        {/* Pagination - for a real app with many events */}
        {filteredEvents.length > 0 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button className="relative inline-flex items-center rounded-l-md bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700">
                Previous
              </button>
              <button className="relative -ml-px inline-flex items-center bg-indigo-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500">
                1
              </button>
              <button className="relative -ml-px inline-flex items-center bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700">
                2
              </button>
              <button className="relative -ml-px inline-flex items-center rounded-r-md bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;

// import React, { useRef, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";
// import EventCard from "./EventCard";
// import ResultPanel from "./ResultPanel";
// import {
//   MagnifyingGlassIcon,
//   AdjustmentsHorizontalIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// gsap.registerPlugin(ScrollTrigger, useGSAP);

// const AllEvents = () => {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showResults, setShowResults] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   const sectionRef = useRef(null);
//   const headerRef = useRef(null);
//   const filtersRef = useRef(null);
//   const resultsPanelRef = useRef(null);

//   // Check if the viewport is mobile
//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);

//     return () => {
//       window.removeEventListener("resize", checkIfMobile);
//     };
//   }, []);

//   // Sample event data - in a real app, this would come from an API
//   const events = [
//     {
//       id: 1,
//       eventName: "Web Development Summit",
//       description:
//         "Join industry experts for a 3-day immersive experience on the latest web technologies. Sessions cover front-end frameworks, back-end architecture, and performance optimization techniques. Networking opportunities with leading developers and tech companies.",
//       date: "March 15, 2025",
//       time: "9:00 AM",
//       location: "Tech Center, Building A",
//       attendees: 254,
//       category: "Tech",
//       isEnrolled: true,
//       results: [
//         { reg_no: "T001", name: "Alex Johnson", status: "passed", score: 92 },
//         { reg_no: "T002", name: "Jamie Smith", status: "passed", score: 88 },
//         {
//           reg_no: "T003",
//           name: "Taylor Wilson",
//           status: "pending",
//           score: null,
//         },
//         { reg_no: "T004", name: "Morgan Davis", status: "failed", score: 59 },
//         { reg_no: "T005", name: "Casey Brown", status: "passed", score: 78 },
//       ],
//     },
//     {
//       id: 2,
//       eventName: "AI Research Conference",
//       description:
//         "Explore cutting-edge developments in artificial intelligence and machine learning. Featuring keynote speakers from leading research institutions and hands-on workshops on implementing AI solutions.",
//       date: "April 2, 2025",
//       time: "10:30 AM",
//       location: "Innovation Hub",
//       attendees: 187,
//       category: "Tech",
//       results: [
//         { reg_no: "A001", name: "Jordan Lee", status: "passed", score: 95 },
//         { reg_no: "A002", name: "Riley Zhang", status: "passed", score: 91 },
//         { reg_no: "A003", name: "Avery Patel", status: "pending", score: null },
//       ],
//     },
//     {
//       id: 3,
//       eventName: "Digital Marketing Masterclass",
//       description:
//         "Learn proven strategies for growing your online presence. This masterclass covers social media marketing, content creation, SEO fundamentals, and analytics-driven campaign optimization.",
//       date: "March 20, 2025",
//       time: "1:00 PM",
//       location: "Business Center",
//       attendees: 120,
//       category: "Business",
//       results: [
//         { reg_no: "M001", name: "Quinn Roberts", status: "passed", score: 82 },
//         { reg_no: "M002", name: "Charlie Wang", status: "failed", score: 64 },
//         { reg_no: "M003", name: "Dakota Kim", status: "passed", score: 87 },
//         {
//           reg_no: "M004",
//           name: "Sydney Garcia",
//           status: "pending",
//           score: null,
//         },
//       ],
//     },
//     {
//       id: 4,
//       eventName: "Sustainable Design Workshop",
//       description:
//         "A hands-on workshop focused on eco-friendly design principles for products and services. Learn how to incorporate sustainability into your design process without compromising aesthetics or functionality.",
//       date: "April 10, 2025",
//       time: "11:00 AM",
//       location: "Green Design Studio",
//       attendees: 75,
//       category: "Design",
//       results: [
//         { reg_no: "D001", name: "Blake Thompson", status: "passed", score: 89 },
//         { reg_no: "D002", name: "Rowan Martinez", status: "passed", score: 92 },
//         { reg_no: "D003", name: "Hayden Wong", status: "pending", score: null },
//       ],
//     },
//   ];

//   // Filter events based on search and category
//   const filteredEvents = events.filter((event) => {
//     const matchesSearch =
//       event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       activeCategory === "All" || event.category === activeCategory;
//     return matchesSearch && matchesCategory;
//   });

//   // Categories derived from events data
//   const categories = ["All", ...new Set(events.map((event) => event.category))];

//   // Handle showing results for an event
//   const handleViewResults = (eventId) => {
//     const event = events.find((e) => e.id === eventId);
//     setSelectedEvent(event);
//     setShowResults(true);

//     // Mobile specific behavior
//     if (isMobile) {
//       // For mobile, slide up from bottom
//       if (resultsPanelRef.current) {
//         gsap.fromTo(
//           resultsPanelRef.current,
//           { y: "100%", opacity: 0 },
//           {
//             y: 0,
//             opacity: 1,
//             duration: 0.5,
//             ease: "power2.out",
//           }
//         );
//       }
//     } else {
//       // Desktop behavior - slide in from right
//       if (resultsPanelRef.current) {
//         gsap.fromTo(
//           resultsPanelRef.current,
//           { x: "100%", opacity: 0 },
//           {
//             x: 0,
//             opacity: 1,
//             duration: 0.5,
//             ease: "power2.out",
//           }
//         );

//         // Shrink the events section (desktop only)
//         gsap.to(sectionRef.current, {
//           width: "60%",
//           duration: 0.5,
//           ease: "power2.out",
//         });
//       }
//     }
//   };

//   // Handle closing results panel
//   const handleCloseResults = () => {
//     if (resultsPanelRef.current) {
//       if (isMobile) {
//         // Mobile specific behavior - slide down
//         gsap.to(resultsPanelRef.current, {
//           y: "100%",
//           opacity: 0,
//           duration: 0.4,
//           ease: "power2.in",
//           onComplete: () => setShowResults(false),
//         });
//       } else {
//         // Desktop behavior - slide right
//         gsap.to(resultsPanelRef.current, {
//           x: "100%",
//           opacity: 0,
//           duration: 0.4,
//           ease: "power2.in",
//           onComplete: () => setShowResults(false),
//         });

//         // Restore the events section width (desktop only)
//         gsap.to(sectionRef.current, {
//           width: "100%",
//           duration: 0.5,
//           ease: "power2.out",
//         });
//       }
//     }
//   };

//   // Page animation setup
//   useGSAP(() => {
//     // Header animation
//     gsap.from(headerRef.current, {
//       y: -30,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power2.out",
//     });

//     // Filters animation
//     gsap.from(filtersRef.current.children, {
//       y: 20,
//       opacity: 0,
//       duration: 0.5,
//       stagger: 0.1,
//       ease: "power1.out",
//       delay: 0.3,
//     });

//     // Scroll-triggered animations for cards
//     const cards = sectionRef.current.querySelectorAll(".event-card-container");
//     cards.forEach((card, index) => {
//       ScrollTrigger.create({
//         trigger: card,
//         start: "top bottom-=100",
//         onEnter: () => {
//           gsap.to(card, {
//             opacity: 1,
//             y: 0,
//             duration: 0.7,
//             ease: "power2.out",
//             delay: index * 0.05,
//           });
//         },
//         once: true,
//       });
//     });
//   }, []);

//   // Category change animation
//   useGSAP(() => {
//     if (sectionRef.current) {
//       gsap.to(sectionRef.current, {
//         opacity: 0.8,
//         scale: 0.98,
//         duration: 0.2,
//         onComplete: () => {
//           gsap.to(sectionRef.current, {
//             opacity: 1,
//             scale: 1,
//             duration: 0.3,
//             ease: "power2.out",
//           });
//         },
//       });
//     }
//   }, [activeCategory]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-950 to-indigo-950 text-white pt-16 pb-24">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header section */}
//         <div ref={headerRef} className="mb-8 md:mb-12 pt-4 md:pt-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-3 md:mb-4">
//             Upcoming Events
//           </h1>
//           <p className="text-base md:text-lg text-gray-300 max-w-3xl">
//             Discover and join our exclusive events designed to help you learn,
//             connect, and grow in your field.
//           </p>
//         </div>

//         {/* Search and filters */}
//         <div ref={filtersRef} className="mb-6 md:mb-10 space-y-4 md:space-y-6">
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search events..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full py-2 md:py-3 pl-10 pr-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-200 transition-all duration-200"
//             />
//           </div>

//           <div className="flex flex-wrap gap-2 md:gap-3">
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setActiveCategory(category)}
//                 className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
//                   activeCategory === category
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-800/70 text-gray-300 hover:bg-gray-700"
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}

//             <button className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gray-800/70 text-gray-300 hover:bg-gray-700 ml-auto flex items-center gap-1 md:gap-2">
//               <AdjustmentsHorizontalIcon className="h-3 w-3 md:h-4 md:w-4" />
//               <span className="hidden sm:inline">More Filters</span>
//               <span className="sm:hidden">Filters</span>
//             </button>
//           </div>
//         </div>

//         {/* Flex container for main content and results panel */}
//         <div className="flex items-start gap-4 md:gap-6 relative">
//           {/* Events grid */}
//           <div
//             ref={sectionRef}
//             className="flex-1 grid grid-cols-1 gap-4 md:gap-6 transition-all duration-500 ease-in-out"
//           >
//             {filteredEvents.length > 0 ? (
//               filteredEvents.map((event, index) => (
//                 <div
//                   key={event.id}
//                   className="event-card-container opacity-0 translate-y-8"
//                 >
//                   <EventCard
//                     {...event}
//                     index={index}
//                     onViewResults={() => handleViewResults(event.id)}
//                   />
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-10 md:py-16">
//                 <p className="text-gray-400 text-base md:text-lg">
//                   No events found matching your criteria.
//                 </p>
//                 <button
//                   onClick={() => {
//                     setSearchTerm("");
//                     setActiveCategory("All");
//                   }}
//                   className="mt-4 px-4 md:px-5 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500 text-sm md:text-base"
//                 >
//                   Clear filters
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Results Panel - Conditionally rendered */}
//           {showResults && (
//             <div
//               ref={resultsPanelRef}
//               className={`bg-gray-900/90 rounded-2xl border border-indigo-500/20 shadow-2xl backdrop-blur-sm overflow-hidden ${
//                 isMobile
//                   ? "fixed inset-x-0 bottom-0 top-auto h-[85vh] z-50 rounded-b-none"
//                   : "sm:w-2/5 fixed right-8 top-32 bottom-24 h-auto"
//               }`}
//               style={
//                 isMobile
//                   ? { transform: "translateY(100%)", opacity: 0 }
//                   : { transform: "translateX(100%)", opacity: 0 }
//               }
//             >
//               <ResultPanel event={selectedEvent} onClose={handleCloseResults} />
//             </div>
//           )}
//         </div>

//         {/* Pagination - for a real app with many events */}
//         {filteredEvents.length > 0 && (
//           <div className="mt-8 md:mt-12 flex justify-center">
//             <div className="inline-flex rounded-md shadow-sm">
//               <button className="relative inline-flex items-center rounded-l-md bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700">
//                 Previous
//               </button>
//               <button className="relative -ml-px inline-flex items-center bg-indigo-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-indigo-500">
//                 1
//               </button>
//               <button className="relative -ml-px inline-flex items-center bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700">
//                 2
//               </button>
//               <button className="relative -ml-px inline-flex items-center rounded-r-md bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700">
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllEvents;
