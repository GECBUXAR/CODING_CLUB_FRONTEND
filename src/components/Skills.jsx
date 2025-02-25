import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Skills = () => {
  // Enhanced skill data with categories and proficiency levels
  const skillsData = [
    {
      category: "Frontend",
      skills: [
        { id: 1, name: "React", proficiency: 90, icon: "⚛️" },
        { id: 2, name: "JavaScript", proficiency: 85, icon: "𝙅𝙎" },
        { id: 3, name: "HTML/CSS", proficiency: 95, icon: "🎨" },
        { id: 4, name: "Tailwind", proficiency: 80, icon: "🌬️" },
      ],
    },
    {
      category: "Backend",
      skills: [
        { id: 5, name: "Node.js", proficiency: 75, icon: "🟢" },
        { id: 6, name: "C++", proficiency: 70, icon: "🔷" },
        { id: 7, name: "C", proficiency: 65, icon: "🔵" },
      ],
    },
    {
      category: "Tools",
      skills: [
        { id: 8, name: "Git & GitHub", proficiency: 85, icon: "🐙" },
        { id: 9, name: "VS Code", proficiency: 90, icon: "📝" },
        { id: 10, name: "Docker", proficiency: 65, icon: "🐳" },
      ],
    },
  ];

  // Flatten skills for the carousel
  const allSkills = skillsData.flatMap((category) => category.skills);

  // References for animations
  const scrollRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Clone all children to create a seamless loop
    const children = Array.from(container.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      container.appendChild(clone);
    });

    // Calculate total width
    const totalWidth = container.scrollWidth / 2;

    // Create animation
    const tl = gsap.timeline({ repeat: -1, paused: false });
    tl.to(container, {
      x: -totalWidth,
      duration: 15,
      ease: "linear",
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    // Pause on hover
    container.addEventListener("mouseenter", () => tl.timeScale(0.2));
    container.addEventListener("mouseleave", () => tl.timeScale(1));

    return () => {
      tl.kill();
      container.removeEventListener("mouseenter", () => tl.timeScale(0.2));
      container.removeEventListener("mouseleave", () => tl.timeScale(1));
    };
  }, []);

  // Filter skills based on selected category
  const filteredSkills =
    activeCategory === "All"
      ? allSkills
      : skillsData.find((cat) => cat.category === activeCategory)?.skills || [];

  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header with animated gradient text */}
        <h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Technical Skills
        </h2>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === "All"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {skillsData.map((category) => (
            <button
              key={category.category}
              onClick={() => setActiveCategory(category.category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.category
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Skill Cards Grid (for filtered view) */}
        {activeCategory !== "All" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-full p-3 text-2xl">
                    {skill.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {skill.name}
                    </h3>
                    {/* Proficiency bar */}
                    <div className="mt-2 bg-gray-200 rounded-full h-3 w-full">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 mt-1">
                      {skill.proficiency}% Proficiency
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll */}
        <div className="relative overflow-hidden w-full py-6 mt-4">
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-gray-100 to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-gray-100 to-transparent z-10"></div>

          <div ref={scrollRef} className="flex space-x-6">
            {allSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col items-center justify-center min-w-[150px] p-4 bg-white rounded-xl shadow-md transition-transform duration-300 hover:scale-110 hover:shadow-lg cursor-pointer"
              >
                <div className="w-16 h-16 flex items-center justify-center text-3xl bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-3">
                  {skill.icon}
                </div>
                <span className="text-base font-semibold text-gray-800">
                  {skill.name}
                </span>
                <div className="w-full mt-2 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${skill.proficiency}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
