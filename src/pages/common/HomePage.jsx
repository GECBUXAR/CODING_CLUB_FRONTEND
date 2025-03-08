import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-blue-300">Coding Club</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Learn, Build, and Grow with our community of passionate developers
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 shadow-lg"
              >
                Join the Club
              </Link>
              <Link
                to="/about"
                className="border-2 border-white/30 px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/60 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Why Join Coding Club?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "M13 10V3L4 14h7v7l9-11h-7z",
              title: "Hands-on Workshops",
              desc: "Regular workshops covering latest technologies and programming languages.",
            },
            {
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              title: "Community Support",
              desc: "Connect with like-minded developers and build your network.",
            },
            {
              icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              title: "Career Opportunities",
              desc: "Access internships, jobs, and mentorship from professionals.",
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={feature.icon}
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Upcoming Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                date: "August 15, 2023",
                title: "Web Development Bootcamp",
                desc: "2-day workshop covering HTML, CSS, and JavaScript fundamentals.",
              },
              {
                date: "September 5, 2023",
                title: "Hackathon 2023",
                desc: "Build innovative solutions to real-world problems.",
              },
              {
                date: "September 20, 2023",
                title: "Tech Talk: AI in Education",
                desc: "Learn how AI is transforming education.",
              },
            ].map((event, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-blue-600 text-white py-3 px-6 text-sm font-semibold">
                  {event.date}
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{event.desc}</p>
                  <Link
                    to="/events"
                    className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
                  >
                    Learn More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/events"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-lg"
            >
              View All Events
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to begin your{" "}
            <span className="text-blue-400">coding journey</span>?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            Join 10,000+ developers who've accelerated their careers with our
            community
          </p>
          <Link
            to="/signup"
            className="inline-block bg-blue-600 text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-xl"
          >
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
