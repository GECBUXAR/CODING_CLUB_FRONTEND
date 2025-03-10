import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      id: "product",
      title: "Product",
      links: [
        { id: "features", name: "Features", href: "/features" },
        { id: "pricing", name: "Pricing", href: "/pricing" },
        { id: "resources", name: "Resources", href: "/resources" },
        { id: "events", name: "Events", href: "/events" },
        { id: "exams", name: "Exams", href: "/exams" },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { id: "about", name: "About Us", href: "/about" },
        { id: "careers", name: "Careers", href: "/careers" },
        { id: "blog", name: "Blog", href: "/blog" },
        { id: "contact", name: "Contact", href: "/contact" },
      ],
    },
    {
      id: "legal",
      title: "Legal",
      links: [
        { id: "terms", name: "Terms", href: "/terms" },
        { id: "privacy", name: "Privacy", href: "/privacy" },
        { id: "cookies", name: "Cookies", href: "/cookies" },
      ],
    },
  ];

  const socialLinks = [
    {
      id: "github",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/coding-club",
      label: "GitHub",
    },
    {
      id: "twitter",
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com/coding-club",
      label: "Twitter",
    },
    {
      id: "instagram",
      icon: <Instagram className="h-5 w-5" />,
      href: "https://instagram.com/coding-club",
      label: "Instagram",
    },
    {
      id: "linkedin",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com/company/coding-club",
      label: "LinkedIn",
    },
    {
      id: "youtube",
      icon: <Youtube className="h-5 w-5" />,
      href: "https://youtube.com/c/coding-club",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Top section with logo and newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
                CC
              </div>
              <span className="text-xl font-semibold">Coding Club</span>
            </div>
            <p className="text-gray-600 max-w-md mb-6">
              Join our community of developers to learn, build, and grow
              together. Stay updated with the latest events and resources.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label={item.label}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((column) => (
              <div key={column.id}>
                <h3 className="font-semibold text-gray-900 mb-3">
                  {column.title}
                </h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.id}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3">
              Subscribe to our newsletter
            </h3>
            <p className="text-gray-600 mb-4">
              Get the latest updates and news right at your inbox.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-grow"
              />
              <Button
                type="submit"
                variant="default"
                size="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom copyright and links */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0">
            © {currentYear} Coding Club. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center space-x-4">
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
              to="/cookies"
              className="hover:text-blue-600 transition-colors"
            >
              Cookies
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

export default ModernFooter;
