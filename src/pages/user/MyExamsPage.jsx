import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockExams = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    date: new Date(2023, 6, 10),
    duration: 60,
    totalQuestions: 25,
    score: 85,
    status: "completed",
  },
  {
    id: 2,
    title: "React and Redux",
    date: new Date(2023, 7, 5),
    duration: 90,
    totalQuestions: 30,
    score: 92,
    status: "completed",
  },
  {
    id: 3,
    title: "Data Structures",
    date: new Date(2023, 7, 20),
    duration: 120,
    totalQuestions: 35,
    status: "scheduled",
  },
  {
    id: 4,
    title: "Algorithms and Complexity",
    date: new Date(2023, 8, 10),
    duration: 120,
    totalQuestions: 30,
    status: "scheduled",
  },
  {
    id: 5,
    title: "Introduction to Python",
    date: new Date(2023, 5, 15),
    duration: 60,
    totalQuestions: 25,
    score: 78,
    status: "completed",
  },
];

const MyExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'completed', 'scheduled'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'title', 'score'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'

  useEffect(() => {
    // Simulating API call with a timeout
    const timer = setTimeout(() => {
      setExams(mockExams);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const filteredExams = exams.filter((exam) => {
    if (filter === "all") return true;
    return exam.status === filter;
  });

  const sortedExams = [...filteredExams].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc"
        ? a.date.getTime() - b.date.getTime()
        : b.date.getTime() - a.date.getTime();
    } else if (sortBy === "title") {
      return sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    } else if (sortBy === "score") {
      // For scheduled exams with no score, we'll consider them as having a score of -1 for sorting
      const scoreA = a.score !== undefined ? a.score : -1;
      const scoreB = b.score !== undefined ? b.score : -1;
      return sortOrder === "asc" ? scoreA - scoreB : scoreB - scoreA;
    }
    return 0;
  });

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          My Exams
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/user/exams/available"
            className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center"
          >
            Find New Exams
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label
                htmlFor="filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="filter"
                value={filter}
                onChange={handleFilterChange}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Exams</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sort by
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={handleSortChange}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="score">Score</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleSortOrder}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {sortOrder === "asc" ? "Ascending" : "Descending"}
            <svg
              className={`ml-2 h-5 w-5 text-gray-500 ${
                sortOrder === "asc" ? "" : "transform rotate-180"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {sortedExams.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Exam Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Questions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exam.date.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exam.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exam.totalQuestions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          exam.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {exam.status.charAt(0).toUpperCase() +
                          exam.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exam.score !== undefined ? `${exam.score}%` : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {exam.status === "scheduled" ? (
                        <Link
                          to={`/user/exams/${exam.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Take Exam
                        </Link>
                      ) : (
                        <Link
                          to={`/user/exams/${exam.id}/results`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Results
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">
              No exams found matching your filter criteria.
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              View All Exams
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Exam Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Total Exams</p>
            <p className="text-2xl font-bold">{exams.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold">
              {exams.filter((exam) => exam.status === "completed").length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Scheduled</p>
            <p className="text-2xl font-bold">
              {exams.filter((exam) => exam.status === "scheduled").length}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Average Score</p>
            <p className="text-2xl font-bold">
              {(() => {
                const completedExams = exams.filter(
                  (exam) => exam.status === "completed"
                );
                if (completedExams.length === 0) return "N/A";
                const avgScore =
                  completedExams.reduce((sum, exam) => sum + exam.score, 0) /
                  completedExams.length;
                return `${Math.round(avgScore)}%`;
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyExamsPage;
