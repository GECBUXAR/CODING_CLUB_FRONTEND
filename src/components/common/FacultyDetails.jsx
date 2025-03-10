import React from "react";
import FacultyCard from "./FacultyCard.jsx";

const FacultyDetails = () => {
  // Faculty data
  const facultyMembers = [
    {
      id: "faculty-1",
      imageSrc: "./faculty/rajshekar.jpg",
      altText: "Dr. Chandra Shekar",
      quote: "Empowering students through technology and innovation.",
      name: "Dr. Chandra Shekar",
      role: "Computer Science Professor & Head of Department",
    },
    {
      id: "faculty-2",
      imageSrc: "./faculty/rina.jpg",
      altText: "Dr. Rina Kumari",
      quote: "Building the next generation of problem solvers and creators.",
      name: "Dr. Rina Kumari",
      role: "Assistant Professor",
    },
    {
      id: "faculty-3",
      imageSrc: "./faculty/amit-patel.jpg",
      altText: "Prof. Amit Patel",
      quote: "Technology is best when it brings people together.",
      name: "Prof. Amit Patel",
      role: "Associate Professor",
    },
    {
      id: "faculty-4",
      imageSrc: "./faculty/sarah-johnson.jpg",
      altText: "Dr. Sarah Johnson",
      quote: "Coding is today's language of creativity.",
      name: "Dr. Sarah Johnson",
      role: "Visiting Faculty",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyMembers.map((faculty) => (
          <FacultyCard
            key={faculty.id}
            imageSrc={faculty.imageSrc}
            altText={faculty.altText}
            quote={faculty.quote}
            name={faculty.name}
            role={faculty.role}
          />
        ))}
      </div>
    </div>
  );
};

export default FacultyDetails;
