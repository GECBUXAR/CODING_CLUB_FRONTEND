import React from "react";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          About Coding Club
        </h1>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            The Coding Club is dedicated to fostering a collaborative
            environment where students can develop their programming skills,
            share knowledge, and prepare for successful careers in technology.
            We believe in learning by doing, peer-to-peer education, and the
            power of community.
          </p>

          <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Organize regular coding challenges and competitions</li>
            <li>
              Host workshops on various programming languages and technologies
            </li>
            <li>Provide mentoring and peer support for learning</li>
            <li>
              Prepare members for technical interviews and coding assessments
            </li>
            <li>
              Connect students with industry professionals and opportunities
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Our History</h2>
          <p className="text-gray-700">
            Founded in 2018 by a group of passionate computer science students,
            Coding Club has grown from a small study group into a thriving
            community with over 200 active members. Throughout the years, our
            members have gone on to work at top tech companies, start their own
            ventures, and contribute to open-source projects.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4" />
              <h3 className="text-xl font-medium">Rahul Patel</h3>
              <p className="text-gray-600">Club President</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4" />
              <h3 className="text-xl font-medium">Anika Singh</h3>
              <p className="text-gray-600">Vice President</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4" />
              <h3 className="text-xl font-medium">Dev Sharma</h3>
              <p className="text-gray-600">Technical Lead</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-300 mb-4" />
              <h3 className="text-xl font-medium">Priya Gupta</h3>
              <p className="text-gray-600">Event Coordinator</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
          <p className="text-gray-700 mb-6">
            Whether you're just starting your coding journey or you're an
            experienced programmer, Coding Club welcomes you! We believe that
            diversity of experience and background makes our community stronger
            and more innovative.
          </p>

          <div className="text-center">
            <a
              href="/signup"
              className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition-colors"
            >
              Become a Member
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
