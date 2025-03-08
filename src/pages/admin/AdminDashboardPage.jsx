import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockStatsData = {
  totalUsers: 247,
  activeUsers: 189,
  totalExams: 18,
  examsTaken: 423,
  averageScore: 78,
  newUsersThisMonth: 32,
};

const mockRecentUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    joinDate: "2023-07-28",
    role: "student",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    joinDate: "2023-07-27",
    role: "student",
  },
  {
    id: 3,
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joinDate: "2023-07-26",
    role: "student",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    joinDate: "2023-07-25",
    role: "student",
  },
];

const mockRecentExams = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    takenBy: 38,
    averageScore: 76,
    lastTaken: "2023-07-29",
  },
  {
    id: 2,
    title: "React and Redux",
    takenBy: 27,
    averageScore: 82,
    lastTaken: "2023-07-28",
  },
  {
    id: 3,
    title: "Data Structures",
    takenBy: 19,
    averageScore: 68,
    lastTaken: "2023-07-27",
  },
];

const AdminDashboardPage = () => {
  const [statsData, setStatsData] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with a timeout
    const timer = setTimeout(() => {
      setStatsData(mockStatsData);
      setRecentUsers(mockRecentUsers);
      setRecentExams(mockRecentExams);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Admin Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/admin/exams/create"
            className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-center"
          >
            Create New Exam
          </Link>
          <Link
            to="/admin/users"
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors text-center"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <title>Users Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
              <div className="mt-1">
                <p className="text-3xl font-semibold text-gray-900">
                  {statsData.totalUsers}
                </p>
                <p className="text-sm text-green-600">
                  {statsData.newUsersThisMonth} new this month
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <title>Exams Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-700">Total Exams</h3>
              <div className="mt-1">
                <p className="text-3xl font-semibold text-gray-900">
                  {statsData.totalExams}
                </p>
                <p className="text-sm text-gray-500">
                  {statsData.examsTaken} exams taken
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <title>Stats Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-5">
              <h3 className="text-lg font-medium text-gray-700">
                Average Score
              </h3>
              <div className="mt-1">
                <p className="text-3xl font-semibold text-gray-900">
                  {statsData.averageScore}%
                </p>
                <p className="text-sm text-gray-500">Across all exams</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Users
            </h2>
            <Link
              to="/admin/users"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Join Date
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
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.joinDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Exams */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Exam Statistics
            </h2>
            <Link
              to="/admin/exams"
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>

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
                    Taken By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avg. Score
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
                {recentExams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {exam.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        Last taken: {exam.lastTaken}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {exam.takenBy} users
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            exam.averageScore >= 80
                              ? "bg-green-100 text-green-800"
                              : exam.averageScore >= 70
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {exam.averageScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/exams/${exam.id}`}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        to={`/admin/exams/${exam.id}/edit`}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/exams/create"
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors"
          >
            <svg
              className="w-10 h-10 text-primary-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Create Exam Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">Create Exam</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add a new exam to the platform
            </p>
          </Link>

          <Link
            to="/admin/users/create"
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors"
          >
            <svg
              className="w-10 h-10 text-primary-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Add User Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">Add User</h3>
            <p className="text-sm text-gray-500 mt-1">
              Register a new user account
            </p>
          </Link>

          <Link
            to="/admin/reports"
            className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex flex-col items-center justify-center text-center transition-colors"
          >
            <svg
              className="w-10 h-10 text-primary-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <title>Reports Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-800">
              Generate Reports
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Create and export detailed reports
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
