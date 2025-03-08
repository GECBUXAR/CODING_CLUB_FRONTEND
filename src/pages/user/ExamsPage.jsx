import React, { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Navbar from "../../components/common/Navbar.jsx";
import AllExams from "../../components/exam/AllExams.jsx";

gsap.registerPlugin(ScrollTrigger);

const ExamsPage = () => {
  const component = useRef(null);

  useGSAP(
    () => {
      // Your animations here if needed
    },
    { scope: component, dependencies: [] }
  );

  return (
    <div ref={component}>
      <Navbar />
      <main className="min-h-screen pt-16">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Available Exams</h1>
          <AllExams />
        </div>
      </main>
    </div>
  );
};

export default ExamsPage;
