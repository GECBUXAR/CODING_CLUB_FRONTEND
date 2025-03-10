import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import SimpleFooter from "../../components/common/SimpleFooter";

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setFormError(true);
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setFormSubmitted(true);
      setIsLoading(false);
      setFormError(false);

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6 text-blue-600" />,
      title: "Email",
      details: "info@codingclub.org",
      action: "mailto:info@codingclub.org",
    },
    {
      icon: <Phone className="h-6 w-6 text-blue-600" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: <MapPin className="h-6 w-6 text-blue-600" />,
      title: "Address",
      details: "123 Campus Drive, Tech Building, Room 302",
      action: "https://maps.google.com/?q=123+Campus+Drive",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Office Hours",
      details: "Monday-Friday: 10am - 6pm",
      action: null,
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
              Get in Touch
            </h1>
            <div className="w-16 h-1 bg-blue-600 mx-auto mb-6 rounded-full" />
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or want to join our community? We'd love to hear
              from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            {/* Contact Form */}
            <div className="lg:col-span-3 bg-white shadow-md rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Send us a message
              </h2>

              {formSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-1">
                      Message sent successfully!
                    </h3>
                    <p className="text-green-600">
                      Thank you for reaching out. We'll get back to you as soon
                      as possible.
                    </p>
                    <Button
                      className="mt-4 bg-green-500 hover:bg-green-600"
                      size="sm"
                      onClick={() => setFormSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {formError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start mb-4">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-red-700">
                          Please fill out all required fields.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full min-h-[150px] border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="How can we help you?"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-8 h-full">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={`contact-${index}`} className="flex items-start">
                      <div className="bg-white/10 p-3 rounded-lg mr-4">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-blue-100">{item.details}</p>
                        {item.action && (
                          <a
                            href={item.action}
                            className="inline-block mt-1 text-sm text-blue-200 hover:text-white transition-colors"
                            target={
                              item.title === "Address" ? "_blank" : undefined
                            }
                            rel={
                              item.title === "Address"
                                ? "noopener noreferrer"
                                : undefined
                            }
                          >
                            {item.title === "Email" && "Send an email"}
                            {item.title === "Phone" && "Call us"}
                            {item.title === "Address" && "View on map"}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <h3 className="font-semibold mb-3">Connect with us</h3>
                  <div className="flex space-x-3">
                    {["facebook", "twitter", "instagram", "github"].map(
                      (platform) => (
                        <a
                          key={platform}
                          href={`https://${platform}.com/codingclub`}
                          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="sr-only">{platform}</span>
                          <img
                            src={`/icons/${platform}.svg`}
                            alt={platform}
                            className="w-5 h-5"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How can I join the Coding Club?",
                  answer:
                    "You can join by signing up on our website and attending our next orientation session.",
                },
                {
                  question: "Are beginners welcome?",
                  answer:
                    "Absolutely! We welcome members of all skill levels, from complete beginners to experienced developers.",
                },
                {
                  question: "How often do you host events?",
                  answer:
                    "We typically host 2-3 events each month, including workshops, hackathons, and coding sessions.",
                },
                {
                  question: "Is there a membership fee?",
                  answer:
                    "Basic membership is free. We offer a premium membership with additional benefits for a small annual fee.",
                },
              ].map((faq, index) => (
                <div
                  key={`faq-${index}`}
                  className="bg-white p-6 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-semibold mb-2 text-gray-900">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default ContactPage;
