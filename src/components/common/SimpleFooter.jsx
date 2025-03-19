import React from "react";
import { Link } from "react-router-dom";

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 py-4 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-2 md:mb-0">
            © {currentYear} Code Crusaders. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms
            </Link>
            <Link
              to="/privacy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-600 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
