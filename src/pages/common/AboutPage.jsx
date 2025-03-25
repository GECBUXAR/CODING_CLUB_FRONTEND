import React from "react";
import { useNavigate } from "react-router-dom";
import FacultyDetails from "../../components/common/FacultyDetails";
import SimpleFooter from "../../components/common/SimpleFooter";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Code,
  Users,
  School,
  Award,
  ExternalLink,
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const teamMembers = [
    {
      id: 1,
      name: "Dr. Jane Smith",
      role: "Faculty Advisor",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      bio: "Ph.D. in Computer Science with 15+ years of industry experience at leading tech companies.",
    },
    {
      id: 2,
      name: "Alex Johnson",
      role: "President",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      bio: "Senior Computer Science student specializing in AI and machine learning.",
    },
    {
      id: 3,
      name: "Maria Rodriguez",
      role: "Events Coordinator",
      image:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      bio: "Junior Software Engineering student with a passion for community building.",
    },
    {
      id: 4,
      name: "David Kim",
      role: "Technical Lead",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      bio: "Graduate student researching distributed systems and cloud computing.",
    },
  ];

  const values = [
    {
      id: "learning",
      icon: <Code className="h-6 w-6 text-blue-600" />,
      title: "Hands-on Learning",
      description:
        "We believe in practical, project-based learning that builds real-world skills.",
    },
    {
      id: "community",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Inclusive Community",
      description:
        "We foster a welcoming environment where everyone can contribute and grow.",
    },
    {
      id: "education",
      icon: <School className="h-6 w-6 text-blue-600" />,
      title: "Continuous Education",
      description:
        "Technology evolves rapidly, and we're committed to staying at the cutting edge.",
    },
    {
      id: "excellence",
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from code quality to event organization.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              size="default"
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              onClick={handleGoBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              About <span className="text-blue-600">Code Crusaders</span>
            </h1>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a community of passionate developers, designers, and
              technology enthusiasts dedicated to learning, building, and
              growing together.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white shadow-md rounded-xl p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              The Code Crusaders is dedicated to fostering a collaborative
              environment where students can develop their programming skills,
              share knowledge, and prepare for successful careers in technology.
              We believe in learning by doing, peer-to-peer education, and the
              power of community.
            </p>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Founded in 2024, our club has grown to over 200 active members
              from various disciplines, united by their interest in coding and
              technology. We organize workshops, hackathons, coding
              competitions, and industry talks to provide diverse learning
              opportunities.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our goal is to bridge the gap between academic learning and
              industry requirements, helping members build portfolios of real
              projects and connect with potential employers and mentors.
            </p>
          </div>

          {/* Core Values Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div
                  key={value.id}
                  className="bg-white shadow-md rounded-xl p-6 transition-transform hover:-translate-y-1 duration-300"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white shadow-md rounded-xl overflow-hidden"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {member.name}
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty Section */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
              Faculty & Mentors
            </h2>
            <FacultyDetails />
          </div>

          {/* Join Us Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 md:p-12 text-white mb-16">
            <div className="md:flex items-center justify-between">
              <div className="md:max-w-2xl mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Join Our Community
                </h2>
                <p className="text-lg text-blue-100">
                  Ready to take your coding skills to the next level? Join our
                  community of passionate developers and start your journey
                  today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-white text-blue-700 hover:bg-blue-50 transition-colors"
                  size="lg"
                  variant="default"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
                <Button
                  className="bg-blue-700 border border-white/20 hover:bg-blue-800 transition-colors"
                  size="lg"
                  variant="default"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default AboutPage;
