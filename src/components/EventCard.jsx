// // EventCard.jsx

// import React, { useRef, useState } from "react";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import {
//   ChevronDownIcon,
//   CheckIcon,
//   CalendarIcon,
//   ClockIcon,
//   MapPinIcon,
//   UserGroupIcon,
// } from "@heroicons/react/24/outline";

// const EventCard = ({
//   eventName,
//   description,
//   date,
//   time,
//   location,
//   attendees,
//   isEnrolled = false,
//   index = 0,
// }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const cardRef = useRef(null);
//   const descRef = useRef(null);
//   const enrollBtnRef = useRef(null);
//   const detailsRef = useRef(null);

//   // Card entrance animation with staggered reveal
//   useGSAP(() => {
//     gsap.from(cardRef.current, {
//       y: 80,
//       opacity: 0,
//       duration: 0.9,
//       ease: "power3.out",
//       delay: index * 0.12,
//     });
//   }, [index]);

//   // Description toggle animation with improved timing
//   useGSAP(() => {
//     if (descRef.current) {
//       const tl = gsap.timeline();

//       if (isOpen) {
//         tl.to(descRef.current, {
//           height: "auto",
//           duration: 0.4,
//           ease: "power2.out",
//         }).to(
//           descRef.current,
//           {
//             opacity: 1,
//             duration: 0.3,
//             ease: "power1.inOut",
//           },
//           "-=0.2"
//         );
//       } else {
//         tl.to(descRef.current, {
//           opacity: 0,
//           duration: 0.3,
//           ease: "power1.inOut",
//         }).to(
//           descRef.current,
//           {
//             height: 0,
//             duration: 0.4,
//             ease: "power2.inOut",
//           },
//           "-=0.1"
//         );
//       }
//     }
//   }, [isOpen]);

//   // Enrollment button animation
//   const handleEnroll = () => {
//     if (!isEnrolled && enrollBtnRef.current) {
//       gsap.to(enrollBtnRef.current, {
//         scale: 0.92,
//         duration: 0.15,
//         yoyo: true,
//         repeat: 1,
//         ease: "power1.inOut",
//       });

//       // Add success animation (could integrate with API call)
//       gsap.to(cardRef.current, {
//         borderColor: "rgba(52, 211, 153, 0.5)",
//         boxShadow: "0 0 15px rgba(52, 211, 153, 0.3)",
//         duration: 0.5,
//         ease: "power2.out",
//         yoyo: true,
//         repeat: 1,
//       });
//     }
//   };

//   return (
//     <div
//       ref={cardRef}
//       className="relative overflow-hidden rounded-2xl border border-gray-200/20 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
//     >
//       {/* Decorative elements */}
//       <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-indigo-600/20 blur-2xl"></div>
//       <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-purple-600/20 blur-xl"></div>

//       <div className="flex justify-between lg:flex-row md:flex-row flex-col gap-4 items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-white">{eventName}</h2>
//           <div className="flex items-center text-sm text-indigo-300 mt-2">
//             <CalendarIcon className="h-4 w-4 mr-1" />
//             <span>{date}</span>
//             {time && (
//               <>
//                 <span className="mx-2">•</span>
//                 <ClockIcon className="h-4 w-4 mr-1" />
//                 <span>{time}</span>
//               </>
//             )}
//           </div>
//         </div>
//         <div>
//           <div className="flex items-center gap-4">
//             {/* Expand button */}
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-full bg-indigo-600/80 text-white hover:bg-indigo-600 transition-colors"
//               aria-expanded={isOpen}
//             >
//               <ChevronDownIcon
//                 className={`h-5 w-5 transform transition-transform duration-300 ${
//                   isOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </button>

//             {/* Action buttons */}
//             <div className="flex gap-3">
//               <button
//                 ref={enrollBtnRef}
//                 onClick={handleEnroll}
//                 disabled={isEnrolled}
//                 className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all ${
//                   isEnrolled
//                     ? "bg-green-500/90 text-white cursor-default"
//                     : "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700"
//                 }`}
//               >
//                 {isEnrolled ? (
//                   <>
//                     <CheckIcon className="h-4 w-4" />
//                     Enrolled
//                   </>
//                 ) : (
//                   "Enroll Now"
//                 )}
//               </button>

//               <button className="flex items-center gap-2 rounded-lg bg-white/8 px-5 py-2 text-sm font-medium text-gray-100 transition-all hover:bg-white/15 border border-gray-600/30">
//                 Result
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Expandable description */}
//       <div
//         ref={descRef}
//         className="overflow-hidden mt-0"
//         style={{ height: 0, opacity: 0 }}
//       >
//         {/* Optional event info row */}
//         {(location || attendees) && (
//           <div className="mt-3 flex items-center gap-4 text-sm text-gray-300">
//             {location && (
//               <div className="flex items-center">
//                 <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
//                 <span>{location}</span>
//               </div>
//             )}
//             {attendees && (
//               <div className="flex items-center">
//                 <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
//                 <span>{attendees} attending</span>
//               </div>
//             )}
//           </div>
//         )}
//         <div className="py-4 border-t border-gray-700/50 mt-4">
//           <p className="text-gray-300 leading-relaxed">{description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventCard;

// EventCard.jsx
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ChevronDownIcon,
  CheckIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(useGSAP);

const EventCard = ({
  id,
  eventName,
  description,
  date,
  time,
  location,
  attendees,
  isEnrolled = false,
  index = 0,
  onViewResults,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const cardRef = useRef(null);
  const descRef = useRef(null);
  const enrollBtnRef = useRef(null);
  const resultBtnRef = useRef(null);

  // Card entrance animation with staggered reveal
  useGSAP(() => {
    gsap.from(cardRef.current, {
      y: 80,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
      delay: index * 0.12,
    });
  }, [index]);

  // Description toggle animation with improved timing
  useGSAP(() => {
    if (descRef.current) {
      const tl = gsap.timeline();

      if (isOpen) {
        tl.to(descRef.current, {
          height: "auto",
          duration: 0.4,
          ease: "power2.out",
        }).to(
          descRef.current,
          {
            opacity: 1,
            duration: 0.3,
            ease: "power1.inOut",
          },
          "-=0.2"
        );
      } else {
        tl.to(descRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power1.inOut",
        }).to(
          descRef.current,
          {
            height: 0,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "-=0.1"
        );
      }
    }
  }, [isOpen]);

  // Enrollment button animation
  const handleEnroll = () => {
    if (!isEnrolled && enrollBtnRef.current) {
      gsap.to(enrollBtnRef.current, {
        scale: 0.92,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      });

      // Add success animation (could integrate with API call)
      gsap.to(cardRef.current, {
        borderColor: "rgba(52, 211, 153, 0.5)",
        boxShadow: "0 0 15px rgba(52, 211, 153, 0.3)",
        duration: 0.5,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
      });
    }
  };

  // Result button animation
  const handleViewResults = () => {
    if (resultBtnRef.current) {
      // Pulse animation
      gsap.to(resultBtnRef.current, {
        scale: 0.95,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: () => {
          // Call the parent component's function to show results
          if (onViewResults) onViewResults();
        },
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl border border-gray-200/20 bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* Decorative elements */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-indigo-600/20 blur-2xl"></div>
      <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-purple-600/20 blur-xl"></div>

      <div className="flex justify-between lg:flex-row md:flex-row flex-col gap-4 items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">{eventName}</h2>
          <div className="flex items-center text-sm text-indigo-300 mt-2">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{date}</span>
            {time && (
              <>
                <span className="mx-2">•</span>
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{time}</span>
              </>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-4">
            {/* Expand button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full bg-indigo-600/80 text-white hover:bg-indigo-600 transition-colors"
              aria-expanded={isOpen}
            >
              <ChevronDownIcon
                className={`h-5 w-5 transform transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                ref={enrollBtnRef}
                onClick={handleEnroll}
                disabled={isEnrolled}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all ${
                  isEnrolled
                    ? "bg-green-500/90 text-white cursor-default"
                    : "bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700"
                }`}
              >
                {isEnrolled ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Enrolled
                  </>
                ) : (
                  "Enroll Now"
                )}
              </button>

              <button
                ref={resultBtnRef}
                onClick={handleViewResults}
                className="flex items-center gap-2 rounded-lg bg-violet-600/80 hover:bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-all border border-violet-500/30"
              >
                <DocumentChartBarIcon className="h-4 w-4" />
                Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable description */}
      <div
        ref={descRef}
        className="overflow-hidden mt-0"
        style={{ height: 0, opacity: 0 }}
      >
        {/* Optional event info row */}
        {(location || attendees) && (
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-300">
            {location && (
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{location}</span>
              </div>
            )}
            {attendees && (
              <div className="flex items-center">
                <UserGroupIcon className="h-4 w-4 mr-1 text-gray-400" />
                <span>{attendees} attending</span>
              </div>
            )}
          </div>
        )}
        <div className="py-4 border-t border-gray-700/50 mt-4">
          <p className="text-gray-300 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
