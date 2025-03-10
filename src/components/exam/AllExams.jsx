import React, { useState } from "react";
import { Link } from "react-router-dom";

// Mock data for exams
const mockExams = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and objects.",
    duration: 60,
    questions: 25,
    difficulty: "Beginner",
    category: "Web Development",
  },
  {
    id: 2,
    title: "React Framework",
    description:
      "Evaluate your understanding of React components, hooks, and state management.",
    duration: 90,
    questions: 30,
    difficulty: "Intermediate",
    category: "Web Development",
  },
  {
    id: 3,
    title: "Data Structures",
    description:
      "Challenge yourself with questions on arrays, linked lists, trees, and graphs.",
    duration: 120,
    questions: 35,
    difficulty: "Advanced",
    category: "Computer Science",
  },
  {
    id: 4,
    title: "Python Basics",
    description:
      "Test your Python skills covering syntax, data types, and common libraries.",
    duration: 60,
    questions: 25,
    difficulty: "Beginner",
    category: "Programming",
  },
  {
    id: 5,
    title: "Database Fundamentals",
    description:
      "Evaluate your knowledge of SQL, database design, and normalization.",
    duration: 75,
    questions: 30,
    difficulty: "Intermediate",
    category: "Database",
  },
  {
    id: 6,
    title: "Algorithms and Complexity",
    description:
      "Test your understanding of algorithm design, complexity analysis, and optimization techniques.",
    duration: 120,
    questions: 30,
    difficulty: "Advanced",
    category: "Computer Science",
  },
];

const AllExams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");

  // Extract unique categories and difficulties for filters
  const categories = Array.from(
    new Set(mockExams.map((exam) => exam.category))
  );
  const difficulties = Array.from(
    new Set(mockExams.map((exam) => exam.difficulty))
  );

  // Filter exams based on search and filter criteria
  const filteredExams = mockExams.filter((exam) => {
    const matchesSearch =
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" || exam.category === filterCategory;
    const matchesDifficulty =
      filterDifficulty === "" || exam.difficulty === filterDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Search Exams
            </label>
            <input
              type="text"
              id="search"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Search by title or description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-48">
            <label
              htmlFor="difficulty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Difficulty
            </label>
            <select
              id="difficulty"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="">All Levels</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      {filteredExams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {exam.title}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      exam.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : exam.difficulty === "Intermediate"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {exam.difficulty}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">
                  {exam.description}
                </p>

                <div className="flex text-sm text-gray-500 mb-4">
                  <div className="flex items-center mr-4">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <title>Duration</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {exam.duration} mins
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <title>Questions</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {exam.questions} questions
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{exam.category}</span>
                  <Link
                    to={`/exams/${exam.id}`}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Start Exam
                    <svg
                      className="ml-1 -mr-1 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <title>Arrow Right</title>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <title>No Results</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No exams found
          </h3>
          <p className="mt-2 text-gray-500">
            We couldn't find any exams matching your search criteria.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("");
                setFilterDifficulty("");
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllExams;
