// ResultPanel.jsx - A new component for displaying event results
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ChevronDownIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

gsap.registerPlugin(useGSAP);

const ResultPanel = ({ event, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const panelRef = useRef(null);
  const headerRef = useRef(null);
  const tableRef = useRef(null);

  // Filter the results based on search term and status filter
  const filteredResults =
    event?.results.filter((result) => {
      const matchesSearch =
        result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.reg_no.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || result.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  // Animations for panel elements
  useGSAP(() => {
    if (panelRef.current) {
      // Animate header
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.4,
        delay: 0.1,
        ease: "power2.out",
      });

      // Animate table rows with stagger
      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll("tr");
        gsap.from(rows, {
          y: 15,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          delay: 0.3,
          ease: "power1.out",
        });
      }
    }
  }, [event?.id]);

  // Function to determine status chip styling
  const getStatusStyles = (status) => {
    switch (status) {
      case "passed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "pending":
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  // Function to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "passed":
        return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircleIcon className="h-4 w-4 text-red-400" />;
      case "pending":
      default:
        return <ClockIcon className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div ref={panelRef} className="flex flex-col h-full">
      {/* Panel header */}
      <div ref={headerRef} className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
            Results: {event?.eventName}
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="text-sm text-gray-400 mb-6">
          {event?.date} {event?.time && `• ${event.time}`}
          {event?.results?.length && ` • ${event.results.length} participants`}
        </div>

        {/* Search and filter */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search participants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-9 py-2 bg-gray-800/80 border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option value="all">All Status</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
            <FunnelIcon className="h-4 w-4 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 px-3 py-2 bg-violet-600/80 hover:bg-violet-600 rounded-lg text-sm text-white transition-colors">
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Results table */}
      <div className="flex-1 overflow-y-auto p-6">
        <table ref={tableRef} className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-800">
              <th className="pb-3 text-gray-400 font-medium text-sm">
                Reg. No.
              </th>
              <th className="pb-3 text-gray-400 font-medium text-sm">Name</th>
              <th className="pb-3 text-gray-400 font-medium text-sm">Status</th>
              <th className="pb-3 text-gray-400 font-medium text-sm text-right">
                marks
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.length > 0 ? (
              filteredResults.map((result, index) => (
                <tr
                  key={result.reg_no}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-4 text-gray-300">{result.reg_no}</td>
                  <td className="py-4 font-medium text-white">{result.name}</td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
                        result.status
                      )}`}
                    >
                      {getStatusIcon(result.status)}
                      {result.status.charAt(0).toUpperCase() +
                        result.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-right font-mono">
                    {result.marks !== null ? result.marks : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-500">
                  {searchTerm || statusFilter !== "all"
                    ? "No results match your search criteria"
                    : "No results available for this event"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer section for pagination or additional actions */}
      <div className="p-6 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Showing {filteredResults.length} of {event?.results?.length || 0}{" "}
            results
          </div>

          {/* Pagination controls if needed */}
          {filteredResults.length > 0 && (
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gray-800 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                Previous
              </button>
              <span className="text-gray-400 text-sm">Page 1</span>
              <button className="px-3 py-1.5 bg-gray-800 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultPanel;
