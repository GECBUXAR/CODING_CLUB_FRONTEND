import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Mock data for demonstration
const mockUserData = {
  name: "Jane Smith",
  email: "jane.smith@example.com",
  joinDate: new Date(2022, 2, 15),
  role: "member",
};

const mockExams = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    date: new Date(2023, 6, 10),
    score: 85,
    status: "completed",
  },
  {
    id: 2,
    title: "React and Redux",
    date: new Date(2023, 7, 5),
    score: 92,
    status: "completed",
  },
  {
    id: 3,
    title: "Data Structures",
    date: new Date(2023, 7, 20),
    status: "scheduled",
  },
];

const mockAnnouncements = [
  {
    id: 1,
    title: "New Python Course Available",
    date: new Date(2023, 7, 1),
    content: "Check out our new Python for Data Science course!",
  },
  {
    id: 2,
    title: "Upcoming Hackathon",
    date: new Date(2023, 7, 3),
    content:
      "Join us for a weekend hackathon next month. Registration opens soon.",
  },
];

const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [exams, setExams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating API call with a timeout
    const timer = setTimeout(() => {
      setUserData(mockUserData);
      setExams(mockExams);
      setAnnouncements(mockAnnouncements);
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
      {/* Welcome Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {userData?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Member since {userData?.joinDate.toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              to="/user/profile"
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Upcoming Exams */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Exams
              </h2>
              <Link
                to="/user/exams"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>

            {exams.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-4 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {exams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {exam.title}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {exam.date.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              exam.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {exam.status.charAt(0).toUpperCase() +
                              exam.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {exam.score ? `${exam.score}%` : "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-right">
                          {exam.status === "scheduled" ? (
                            <Link
                              to={`/user/exams/${exam.id}`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              Take Exam
                            </Link>
                          ) : (
                            <Link
                              to={`/user/exams/${exam.id}/results`}
                              className="text-primary-600 hover:text-primary-700 font-medium"
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
                <p className="text-gray-500">You don't have any exams yet.</p>
                <Link
                  to="/user/exams/available"
                  className="mt-4 inline-block bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Browse Available Exams
                </Link>
              </div>
            )}
          </div>

          {/* Study Resources */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Study Resources
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  JavaScript Resources
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Access tutorials, exercises, and cheatsheets for JavaScript.
                </p>
                <Link
                  to="/resources/javascript"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Resources →
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Python Resources
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Learn Python with our curated collection of materials and
                  exercises.
                </p>
                <Link
                  to="/resources/python"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Resources →
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Web Development
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  HTML, CSS, and modern web development framework tutorials.
                </p>
                <Link
                  to="/resources/web-development"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Resources →
                </Link>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Data Structures & Algorithms
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Prepare for technical interviews with our DSA material.
                </p>
                <Link
                  to="/resources/dsa"
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View Resources →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Announcements and Quick Actions */}
        <div>
          {/* Announcements */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Announcements
            </h2>

            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="border-b border-gray-100 pb-4 last:border-0"
                  >
                    <h3 className="text-lg font-medium text-gray-800">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      {announcement.date.toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">{announcement.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No announcements right now.
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Quick Actions
            </h2>

            <div className="space-y-4">
              <Link
                to="/user/profile"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="font-medium text-gray-800">
                  Update Profile
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Change your personal information and settings
                </p>
              </Link>

              <Link
                to="/resources"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="font-medium text-gray-800">
                  Browse Resources
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Access learning materials and resources
                </p>
              </Link>

              <Link
                to="/user/exams/schedule"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="font-medium text-gray-800">
                  Schedule New Exam
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Register for upcoming exams
                </p>
              </Link>

              <Link
                to="/user/support"
                className="block w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
              >
                <span className="font-medium text-gray-800">Get Support</span>
                <p className="text-sm text-gray-500 mt-1">
                  Contact support for assistance
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
