import React from "react";

const FacultyCard = ({ imageSrc, altText, quote, name, role }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={imageSrc || "/placeholder.svg?height=200&width=200"}
            alt={altText || "Faculty member"}
            className="w-full h-full object-cover aspect-square"
          />
        </div>
        <div className="p-4 md:w-2/3">
          <blockquote className="italic text-gray-600 mb-4">
            "{quote}"
          </blockquote>
          <div className="font-semibold text-lg">{name}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  );
};

export default FacultyCard;
