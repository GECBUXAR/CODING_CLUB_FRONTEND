"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import EventCard from "./EventCard";
import ResultPanel from "./ResultPanel";
import {
  MicroscopeIcon as MagnifyingGlassIcon,
  SlidersHorizontal,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: 1,
    eventName: "Quiz Competition on C Programing",
    description:
      "Learn the fundamentals of C Programing and make your Consept clear with the help of Quiz Competition.",
    date: "March 15, 2025",
    time: "4:00 AM",
    location: "Academic buildings, Room 110",
    attendees: 100,
    category: "Tech",
    isEnrolled: true,

    results: [
      {
        reg_no: "24EC19",
        name: "Nikil Kumar Sharma",
        status: "passed",
        marks: 26,
      },
      { reg_no: "24CS106", name: "Nidhi Kumari", status: "passed", marks: 28 },
      {
        reg_no: "24CS65",
        name: "Subhankar Sidhu",
        status: "passed",
        marks: 26,
      },
      { reg_no: "24CS72", name: "Suman Baitha", status: "passed", marks: 32 },
      {
        reg_no: "24CS74",
        name: "Harshvardhan Kumar",
        status: "failed",
        marks: 14,
      },
      { reg_no: "24CS32p", name: "Juhi Pandey", status: "passed", marks: 20 },
      { reg_no: "24CS71", name: "Pranav Prakash", status: "passed", marks: 36 },
      { reg_no: "24CS100", name: "Kumari Riya", status: "passed", marks: 16 },
      { reg_no: "24CS96", name: "Tamanna", status: "passed", marks: 20 },
      { reg_no: "24CS09", name: "Nisha Kumari", status: "passed", marks: 36 },
      { reg_no: "24CS115", name: "Aanya", status: "passed", marks: 20 },
      { reg_no: "24CS82", name: "Arushi Thakur", status: "passed", marks: 18 },
      {
        reg_no: "24EC29",
        name: "Vandana Kumari Sharma",
        status: "passed",
        marks: 18,
      },
      { reg_no: "24CS48", name: "Archana Kumari", status: "failed", marks: 14 },
      { reg_no: "24CS26", name: "Aditya Tiwari", status: "passed", marks: 22 },
      { reg_no: "24CS63p", name: "Riya Kumari", status: "passed", marks: 18 },
      { reg_no: "24EC24", name: "Afsana Praveen", status: "passed", marks: 16 },
      { reg_no: "24EC28", name: "Aman Raj", status: "passed", marks: 20 },
      {
        reg_no: "24CS42",
        name: "Vikash Kumar Yadav",
        status: "passed",
        marks: 26,
      },
      {
        reg_no: "24CS02",
        name: "Nityanand Tiwari",
        status: "passed",
        marks: 32,
      },
      { reg_no: "24CS119", name: "Usha Kumari", status: "passed", marks: 22 },
      { reg_no: "24CS38p", name: "Riya Kumari", status: "passed", marks: 18 },
      { reg_no: "24CS95", name: "Saloni Kumari", status: "passed", marks: 26 },
      { reg_no: "24CS75", name: "Priya Kumari", status: "passed", marks: 16 },
      { reg_no: "24CS36", name: "Puneet Kumar", status: "passed", marks: 26 },
      {
        reg_no: "24CS28",
        name: "Nishant Kumar Verma",
        status: "passed",
        marks: 18,
      },
      { reg_no: "76", name: "Mamnit Kumar", status: "failed", marks: 12 },
      { reg_no: "24CS61", name: "Rimjhim Kumari", status: "passed", marks: 18 },
      { reg_no: "24EC25", name: "Amrit Raj", status: "passed", marks: 24 },
      { reg_no: "24CS44", name: "Nikhil Kumar", status: "passed", marks: 32 },
      { reg_no: "24CS24", name: "Akhil Tiwari", status: "passed", marks: 28 },
      { reg_no: "24CS107", name: "Virat Raj", status: "passed", marks: 40 },
      { reg_no: "24CS69", name: "Suman Kumar", status: "passed", marks: 28 },
      { reg_no: "24CS06", name: "Golu Kumar", status: "passed", marks: 18 },
      { reg_no: "24CS12", name: "Rashid Ahmad", status: "passed", marks: 24 },
      { reg_no: "24CS62", name: "Juhi Kumari", status: "passed", marks: 26 },
      { reg_no: "24CS14", name: "Anushka Deep", status: "passed", marks: 22 },
      { reg_no: "24CS11", name: "Ranjeet Kumar", status: "passed", marks: 22 },
      { reg_no: "24CS51", name: "Rahul Kumar", status: "passed", marks: 20 },
      {
        reg_no: "24CS17",
        name: "Harshit Kumar Thakur",
        status: "passed",
        marks: 36,
      },
      {
        reg_no: "24CS20",
        name: "Ankit Kumar Thakur",
        status: "passed",
        marks: 38,
      },
      {
        reg_no: "24CS92",
        name: "Anjali Kumari Shukla",
        status: "failed",
        marks: 14,
      },
      {
        reg_no: "24CS114",
        name: "Pushpanjali Kumari",
        status: "passed",
        marks: 30,
      },
      { reg_no: "24CS55", name: "Sibu Pathak", status: "passed", marks: 34 },
      { reg_no: "24CS0g", name: "Shalu Kumari", status: "passed", marks: 20 },
      { reg_no: "24CS101", name: "Aatm Gaurav", status: "passed", marks: 36 },
      { reg_no: "24CS60", name: "Arun Kumar", status: "passed", marks: 32 },
      { reg_no: "24CS18", name: "Radhika Kumari", status: "passed", marks: 32 },
      { reg_no: "24CS112", name: "Sweety Kumari", status: "passed", marks: 22 },
      { reg_no: "24CS77", name: "Bulbul Sinha", status: "failed", marks: 14 },
      { reg_no: "24CS64", name: "Arya Sinha", status: "passed", marks: 16 },
      { reg_no: "24CS07", name: "Divya Kumari", status: "passed", marks: 28 },
      {
        reg_no: "24CS08p",
        name: "Prince Raj Kashyap",
        status: "passed",
        marks: 24,
      },
      { reg_no: "24CS85", name: "Aditya Kumar", status: "passed", marks: 22 },
      { reg_no: "24CS104", name: "Shivam Kumar", status: "passed", marks: 34 },
      { reg_no: "24CS29", name: "Amisha Kumari", status: "passed", marks: 16 },
      { reg_no: "24EC02", name: "Sameer Alam", status: "failed", marks: 14 },
      { reg_no: "24CS34", name: "Khushi Raj", status: "passed", marks: 24 },
      {
        reg_no: "24CS16",
        name: "Shreya Srivashtwa",
        status: "passed",
        marks: 20,
      },
      { reg_no: "24CS88", name: "Madhu Kumari", status: "passed", marks: 28 },
      { reg_no: "24CS19", name: "Anshu Kumari", status: "passed", marks: 24 },
      { reg_no: "24CS94", name: "Kajal Kumari", status: "passed", marks: 28 },
      { reg_no: "24EC13", name: "Prem Kumar", status: "passed", marks: 20 },
      { reg_no: "24EE38", name: "Anshu Raj", status: "passed", marks: 20 },
      { reg_no: "24CS97", name: "Prince Sinha", status: "passed", marks: 24 },
      { reg_no: "24CS103", name: "Ruchi Kumari", status: "passed", marks: 22 },
      { reg_no: "24CS30", name: "Suman Kumari", status: "passed", marks: 30 },
      { reg_no: "24CS110", name: "Dimpal Kumari", status: "passed", marks: 20 },
      { reg_no: "24CS80", name: "Ayush Anand", status: "passed", marks: 22 },
    ],

    // results: [
    //   { reg_no: "T001", name: "Alex Johnson", status: "passed", score: 92 },
    //   { reg_no: "T002", name: "Jamie Smith", status: "passed", score: 88 },
    //   { reg_no: "T003", name: "Taylor Wilson", status: "pending", score: null },
    //   { reg_no: "T004", name: "Morgan Davis", status: "failed", score: 59 },
    //   { reg_no: "T005", name: "Casey Brown", status: "passed", score: 78 },
    // ],
  },
  // {
  //   id: 2,
  //   eventName: "AI Research Conference",
  //   description:
  //     "Explore cutting-edge developments in artificial intelligence and machine learning...",
  //   date: "April 2, 2025",
  //   time: "10:30 AM",
  //   location: "Innovation Hub",
  //   attendees: 187,
  //   category: "Tech",
  //   results: [
  //     { reg_no: "A001", name: "Jordan Lee", status: "passed", score: 95 },
  //     { reg_no: "A002", name: "Riley Zhang", status: "passed", score: 91 },
  //     { reg_no: "A003", name: "Avery Patel", status: "pending", score: null },
  //   ],
  // },
  // {
  //   id: 3,
  //   eventName: "Digital Marketing Masterclass",
  //   description: "Learn proven strategies for growing your online presence...",
  //   date: "March 20, 2025",
  //   time: "1:00 PM",
  //   location: "Business Center",
  //   attendees: 120,
  //   category: "Business",
  //   results: [
  //     { reg_no: "M001", name: "Quinn Roberts", status: "passed", score: 82 },
  //     { reg_no: "M002", name: "Charlie Wang", status: "failed", score: 64 },
  //     { reg_no: "M003", name: "Dakota Kim", status: "passed", score: 87 },
  //     { reg_no: "M004", name: "Sydney Garcia", status: "pending", score: null },
  //   ],
  // },
  // {
  //   id: 4,
  //   eventName: "Sustainable Design Workshop",
  //   description:
  //     "A hands-on workshop focused on eco-friendly design principles...",
  //   date: "April 10, 2025",
  //   time: "11:00 AM",
  //   location: "Green Design Studio",
  //   attendees: 75,
  //   category: "Design",
  //   results: [
  //     { reg_no: "D001", name: "Blake Thompson", status: "passed", score: 89 },
  //     { reg_no: "D002", name: "Rowan Martinez", status: "passed", score: 92 },
  //     { reg_no: "D003", name: "Hayden Wong", status: "pending", score: null },
  //   ],
  // },
];

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

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || event.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["All", ...new Set(events.map((event) => event.category))];

  const handleViewResults = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    setSelectedEvent(event);
    setShowResults(true);

    if (resultsPanelRef.current) {
      gsap.fromTo(
        resultsPanelRef.current,
        {
          y: isMobile ? "100%" : "0%",
          x: !isMobile ? "100%" : "0%",
          opacity: 0,
        },
        {
          y: "0%",
          x: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  };

  const handleCloseResults = () => {
    if (resultsPanelRef.current) {
      gsap.to(resultsPanelRef.current, {
        y: isMobile ? "100%" : "0%",
        x: !isMobile ? "100%" : "0%",
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setShowResults(false),
      });
    }
  };

  useGSAP(() => {
    if (sectionRef.current) {
      const cardContainers = gsap.utils.toArray(
        sectionRef.current.querySelectorAll(".event-card-container")
      );
      gsap.to(cardContainers, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
        immediateRender: false,
        overwrite: true,
      });
    }
  }, [filteredEvents]);

  useGSAP(() => {
    if (headerRef.current && filtersRef.current) {
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.from(filtersRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power1.out",
        delay: 0.3,
      });
    }
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-purple-950 text-white pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={headerRef} className="mb-8 md:mb-12 pt-4 md:pt-8">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-3 md:mb-4">
            Upcoming Events
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-3xl">
            Discover and join our exclusive events designed to help you learn,
            connect, and grow in your field.
          </p>
        </div>

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
              className="w-full py-2 md:py-3 pl-10 pr-4 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-200 transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                    : "bg-gray-800/70 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {category}
              </button>
            ))}

            <button className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gray-800/70 text-gray-300 hover:bg-gray-700 ml-auto flex items-center gap-1 md:gap-2">
              <SlidersHorizontal className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">More Filters</span>
              <span className="sm:hidden">Filters</span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-4 md:gap-6 relative">
          <div
            ref={sectionRef}
            className="flex-1 grid grid-cols-1 gap-4 md:gap-6 transition-all duration-500 ease-in-out"
          >
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-card-container opacity-0 translate-y-8"
                >
                  <EventCard
                    {...event}
                    event={event}
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
                  className="mt-4 px-4 md:px-5 py-2 bg-violet-600 rounded-lg text-white hover:bg-violet-500 text-sm md:text-base transition-colors duration-200"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {showResults && (
            <div
              ref={resultsPanelRef}
              className={`bg-gray-900/90 rounded-2xl border border-violet-500/20 shadow-2xl backdrop-blur-sm overflow-hidden ${
                isMobile
                  ? "fixed inset-x-0 bottom-0 top-auto h-[85vh] z-50 rounded-b-none"
                  : "sm:w-2/5 fixed right-8 top-32 bottom-24 h-auto"
              }`}
            >
              <ResultPanel event={selectedEvent} onClose={handleCloseResults} />
            </div>
          )}
        </div>

        {filteredEvents.length > 0 && (
          <div className="mt-8 md:mt-12 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button className="relative inline-flex items-center rounded-l-md bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition-colors duration-200">
                Previous
              </button>
              <button className="relative -ml-px inline-flex items-center bg-violet-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-violet-500 transition-colors duration-200">
                1
              </button>
              <button className="relative -ml-px inline-flex items-center bg-gray-800 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition-colors duration-200">
                2
              </button>
              <button className="relative -ml-px inline-flex items-center rounded-r-md bg-gray-800 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-gray-700 transition-colors duration-200">
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

//   // Check viewport size
//   useEffect(() => {
//     const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);
//     return () => window.removeEventListener("resize", checkIfMobile);
//   }, []);

//   // Sample event data
//   const events = [
//     /* ... (keep the same event data structure) ... */
//   ];

//   // Filter events
//   const filteredEvents = events.filter((event) => {
//     const matchesSearch =
//       event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       event.description.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory =
//       activeCategory === "All" || event.category === activeCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const categories = ["All", ...new Set(events.map((event) => event.category))];

//   // Event card animations
//   useGSAP(
//     () => {
//       const cardContainers = sectionRef.current?.querySelectorAll(
//         ".event-card-container"
//       );

//       if (cardContainers) {
//         gsap.fromTo(
//           cardContainers,
//           { opacity: 0, y: 20 },
//           {
//             opacity: 1,
//             y: 0,
//             duration: 0.5,
//             stagger: 0.1,
//             ease: "power2.out",
//             immediateRender: false,
//             overwrite: true,
//           }
//         );
//       }
//     },
//     { dependencies: [filteredEvents, activeCategory] }
//   );

//   // Header and filter animations
//   useGSAP(() => {
//     // Header animation
//     gsap.from(headerRef.current, {
//       y: -30,
//       opacity: 0,
//       duration: 0.8,
//       ease: "power2.out",
//     });

//     // Filters animation
//     gsap.from(filtersRef.current?.children, {
//       y: 20,
//       opacity: 0,
//       duration: 0.5,
//       stagger: 0.1,
//       ease: "power1.out",
//       delay: 0.3,
//     });
//   }, []);

//   // Category change animation
//   useGSAP(() => {
//     gsap.to(sectionRef.current, {
//       opacity: 0.8,
//       scale: 0.98,
//       duration: 0.2,
//       onComplete: () => {
//         gsap.to(sectionRef.current, {
//           opacity: 1,
//           scale: 1,
//           duration: 0.3,
//           ease: "power2.out",
//         });
//       },
//     });
//   }, [activeCategory]);

//   // Results panel handlers (keep the same implementation)
//   const handleViewResults = (eventId) => {
//     /* ... */
//   };
//   const handleCloseResults = () => {
//     /* ... */
//   };

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
//           {/* Search input and category buttons (keep same implementation) */}
//         </div>

//         {/* Events grid */}
//         <div className="flex items-start gap-4 md:gap-6 relative">
//           <div
//             ref={sectionRef}
//             className="flex-1 grid grid-cols-1 gap-4 md:gap-6 transition-all duration-500 ease-in-out"
//           >
//             {filteredEvents.length > 0 ? (
//               filteredEvents.map((event) => (
//                 <div key={event.id} className="event-card-container">
//                   <EventCard
//                     {...event}
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

//           {/* Results Panel */}
//           {showResults && (
//             <div
//               ref={resultsPanelRef}
//               className={`bg-gray-900/90 rounded-2xl border border-indigo-500/20 shadow-2xl backdrop-blur-sm overflow-hidden ${
//                 isMobile
//                   ? "fixed inset-x-0 bottom-0 top-auto h-[85vh] z-50 rounded-b-none"
//                   : "sm:w-2/5 fixed right-8 top-32 bottom-24 h-auto"
//               }`}
//             >
//               <ResultPanel event={selectedEvent} onClose={handleCloseResults} />
//             </div>
//           )}
//         </div>

//         {/* Pagination (keep same implementation) */}
//       </div>
//     </div>
//   );
// };

// export default AllEvents;
