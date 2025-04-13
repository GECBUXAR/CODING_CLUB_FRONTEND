import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ModernFooter from "../../components/common/ModernFooter";
import { ArrowRight, Code, Users, Zap, BookOpen, Calendar } from "lucide-react";
import { eventService } from "@/services";

const LandingPage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Fetch upcoming events from the backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const result = await eventService.getUpcomingEvents(3);
        if (result.success) {
          setUpcomingEvents(result.data);
        }
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const features = [
    {
      id: "feature-1",
      icon: <Code className="h-8 w-8 text-blue-600" />,
      title: "Coding Workshops",
      description:
        "Learn modern programming languages and frameworks through hands-on workshops led by industry experts.",
    },
    {
      id: "feature-2",
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Community Network",
      description:
        "Connect with like-minded developers, share ideas, and collaborate on exciting projects.",
    },
    {
      id: "feature-3",
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "Hackathons",
      description:
        "Participate in hackathons and competitions to challenge yourself and showcase your skills.",
    },
    {
      id: "feature-4",
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Learning Resources",
      description:
        "Access a comprehensive library of resources, tutorials, and documentation to support your learning journey.",
    },
  ];

  // Default image for events that don't have an image
  const defaultEventImages = [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Updated with more modern styling */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-blue-200 text-sm font-medium mb-6">
              Building the next generation of developers
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Code Crusaders
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100/90 max-w-2xl mx-auto">
              Learn, Build, and Grow with our community of passionate
              developers. Turn your ideas into reality.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 hover:-translate-y-1 transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="bg-blue-700/30 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-blue-700/40 hover:-translate-y-1 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <title>Wave Separator</title>
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </div>

      {/* Features Section - Improved with better icons and layout */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Why Join Our Coding Community?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the benefits of being part of our growing network of
            developers and tech enthusiasts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Events Section - Modernized with image cards */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join us for these exciting opportunities to learn and connect with
              others.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingEvents ? (
              // Loading skeleton
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col h-full"
                  >
                    <div className="h-48 bg-gray-200 animate-pulse" />
                    <div className="p-6 flex-grow">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                    </div>
                    <div className="px-6 pb-6">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                    </div>
                  </div>
                ))
            ) : upcomingEvents.length > 0 ? (
              // Real data
              upcomingEvents.map((event, index) => (
                <div
                  key={event._id || event.id || `event-${index}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        event.image ||
                        defaultEventImages[index % defaultEventImages.length]
                      }
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-0 left-0 bg-blue-600 text-white py-2 px-4 rounded-br-lg text-sm font-semibold">
                      {event.date
                        ? new Date(event.date).toLocaleDateString()
                        : "Upcoming"}
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      to={`/events/${event._id || event.id}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // No events found
              <div className="col-span-3 text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No upcoming events
                </h3>
                <p className="text-gray-500">
                  Check back later for new events or workshops
                </p>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Events
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section - New professional section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 md:p-16 text-white text-center md:text-left md:flex md:items-center md:justify-between">
          <div className="md:max-w-2xl mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Ready to start your coding journey?
            </h2>
            <p className="text-xl text-blue-100">
              Join our community today and unlock a world of learning
              opportunities, resources, and connections.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
            <Link
              to="/signup"
              className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
            >
              Sign Up Now
            </Link>
            <Link
              to="/contact"
              className="bg-blue-700 border border-white/20 px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Facultys Section - New section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Our Members Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students and professionals who have been part of our
              community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={`star-${i}`}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Star {i + 1}</title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "The coding club completely transformed my programming skills.
                The workshops are practical, and the community is incredibly
                supportive."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mr-3 flex items-center justify-center text-blue-600 font-bold">
                  MS
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Satyam Kumar</h4>
                  <p className="text-sm text-gray-500">
                    Computer Science Student
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={`star-${i}`}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Star {i + 1}</title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "Participating in the hackathons organized by the coding club
                helped me apply my skills to real-world problems and build an
                impressive portfolio."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mr-3 flex items-center justify-center text-blue-600 font-bold">
                  JH
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Keshav Raj</h4>
                  <p className="text-sm text-gray-500">Software Developer</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={`star-${i}`}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <title>Star {i + 1}</title>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                "The resources provided by the coding club were instrumental in
                helping me transition into a tech career. The mentorship program
                is exceptional."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full mr-3 flex items-center justify-center text-blue-600 font-bold">
                  PB
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Vishal Kumar</h4>
                  <p className="text-sm text-gray-500">UX Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <ModernFooter />
    </div>
  );
};

export default LandingPage;
