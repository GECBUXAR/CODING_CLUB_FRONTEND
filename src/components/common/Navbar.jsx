import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, ChevronDown, Search, Bell, User, Home } from "lucide-react";
import { useAuth } from "@/contexts/optimized-auth-context";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  // Navigation links - common links for all users
  const commonLinks = [
    {
      id: "/home",
      label: "Home",
      icon: <Home className="w-4 h-4" />,
      auth: false,
    },
    {
      id: "/events",
      label: "Events",
      icon: <Calendar className="w-4 h-4" />,
      auth: false,
    },
    {
      id: "/exams",
      label: "Exams",
      icon: <FileText className="w-4 h-4" />,
      auth: false,
    },
  ];

  // Admin specific links
  const adminLinks = [
    {
      id: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      auth: true,
    },
  ];

  // User specific links
  const userLinks = [
    {
      id: "/user/dashboard",
      label: "My Dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      auth: true,
    },
  ];

  // Filter links based on authentication status
  const getFilteredLinks = () => {
    // Start with common links that don't require auth
    const links = commonLinks.filter((link) => !link.auth || isAuthenticated);

    // Add role-specific links if authenticated
    if (isAuthenticated) {
      if (isAdmin) {
        // Add admin dashboard link
        return [...links, ...adminLinks];
      } else {
        // Add user dashboard link for regular users
        return [...links, ...userLinks.filter((link) => !link.admin)];
      }
    }

    return links;
  };

  const filteredLinks = getFilteredLinks();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleLogout = async () => {
    try {
      // Use auth context logout function
      await logout();
      // Navigate to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "py-2 bg-white shadow-md" : "py-4 bg-white"
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0" aria-label="Go to homepage">
          <span className="text-xl font-bold text-blue-600 flex items-center">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center mr-2 bg-gradient-to-tr  text-white">
              <img
                src="/image/CodingClubLogoSmall.png"
                alt=""
                className="size-8"
              />
            </div>
            <span className="hidden xs:block">
              <img
                src="/image/CodingClubLogo.png"
                alt="Coding Club"
                className="w-36"
              />
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {filteredLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.id}
              className={({ isActive }) => `
                group relative font-medium text-sm tracking-wider flex items-center gap-2
                px-3 py-2 rounded-lg
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                }
                transition-all duration-300
              `}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors duration-300"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Search Input (appears when clicked) */}
          {isSearchOpen && (
            <div className="absolute right-20 top-full mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
              <div className="flex items-center p-2 border border-gray-200 rounded-lg">
                <Search className="text-gray-400 mx-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-60 py-2 px-1 outline-none text-sm"
                />
                <button
                  type="button"
                  className="p-1 hover:bg-gray-100 rounded-full"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="text-gray-400 w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {isAuthenticated ? (
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {user?.role === "admin" ? "A" : "U"}
                </div>
                <span className="text-sm font-medium">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/user/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login">
              <button
                type="button"
                className="flex items-center gap-2 bg-blue-600 px-5 py-2 rounded-lg font-medium text-sm text-white hover:bg-blue-700 transition-colors duration-300"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          {/* Mobile Search Button */}
          <button
            type="button"
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors duration-300"
            onClick={toggleSearch}
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md p-2 transition-colors duration-300"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search (appears when clicked) */}
      {isSearchOpen && (
        <div className="md:hidden w-full px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center p-2 border border-gray-200 rounded-lg bg-gray-50">
            <Search className="text-gray-400 mx-2" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 py-2 px-1 outline-none text-sm bg-transparent"
            />
            <button
              type="button"
              className="p-1 hover:bg-gray-200 rounded-full"
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="text-gray-400 w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-50">
          <div className="flex flex-col gap-1 p-4">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.id}
                className={({ isActive }) => `
                  relative text-base font-medium flex items-center gap-3 w-full
                  py-3 px-4 rounded-xl transition-all duration-300
                  ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-500 hover:bg-gray-50"
                  }
                `}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </NavLink>
            ))}

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="relative text-base font-medium flex items-center gap-3 w-full py-3 px-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 mt-2"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm">
                  <LogOut className="w-4 h-4" />
                </span>
                <span>Sign Out</span>
              </button>
            ) : (
              <Link to="/login" className="w-full mt-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 px-6 py-3 rounded-xl font-medium text-white hover:bg-blue-700 transition-all duration-300"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

// Import missing icons
const Calendar = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const FileText = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Info = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const LayoutDashboard = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
);

const LogOut = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const Mail = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export default Navbar;
