import { useState, useEffect } from "react";

export const DashboardOverview = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: "01",
    hours: "02",
    minutes: "00",
    seconds: "00",
  });
  const [email, setEmail] = useState("");

  useEffect(() => {
    const targetDate = new Date("2024-12-31T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000); // Fixed line

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your newsletter signup logic here
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="max-w-2xl w-full text-center space-y-8 mt-8">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-pulse">
          Coming Soon
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          We're working hard to bring you something amazing. Stay tuned!
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-blue-600">
              {timeLeft.days}
            </div>
            <div className="text-gray-500">Days</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-blue-600">
              {timeLeft.hours}
            </div>
            <div className="text-gray-500">Hours</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-blue-600">
              {timeLeft.minutes}
            </div>
            <div className="text-gray-500">Minutes</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-blue-600">
              {timeLeft.seconds}
            </div>
            <div className="text-gray-500">Seconds</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email for updates"
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Notify Me
            </button>
          </div>
        </form>

        <div className="mt-8 text-gray-500">
          Follow us on social media for updates
          <div className="flex justify-center gap-4 mt-4">
            {/* Add social media icons here */}
            <a href="#" className="hover:text-blue-600">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-600">
              Facebook
            </a>
            <a href="#" className="hover:text-blue-600">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default DashboardOverview;
