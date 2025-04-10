import { useState, useEffect } from "react";
import {
  Calendar,
  Check,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
  Upload,
  Search,
  Filter,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EventModal } from "@/components/admin/event-modal";
import { UploadResultsModal } from "@/components/admin/upload-results-modal";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { toast } from "react-hot-toast";
import eventService from "@/services/eventService";

// Import our reusable components
import { PageHeader } from "@/components/admin/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("date-desc");

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Use our new eventService
        const response = await eventService.getAllEvents({
          // Add any filters you want here
          isExam: false, // Only get regular events, not exams
        });

        if (response.success) {
          setEvents(response.data || []);
        } else {
          throw new Error(response.error || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error(error.message || "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteEvent = (event) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      // Use our new eventService
      const response = await eventService.deleteEvent(currentEvent._id);

      if (response.success) {
        setIsDeleteDialogOpen(false);
        toast.success(response.message || "Event deleted successfully");

        // Update the events list
        setEvents(
          Array.isArray(events)
            ? events.filter((event) => event._id !== currentEvent._id)
            : []
        );
      } else {
        throw new Error(response.error || "Failed to delete event");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete event");
      console.error("Error deleting event:", err);
    }
  };

  const handleUploadResults = (event) => {
    setCurrentEvent(event);
    setIsUploadModalOpen(true);
  };

  const handlePublishResults = (event) => {
    setCurrentEvent(event);
    toast.success(`Publishing results for ${event.title}`);
    // Implement the API call for publishing results
  };

  const handleSaveEvent = async (eventData) => {
    try {
      let response;

      if (currentEvent) {
        // Update existing event using our new eventService
        response = await eventService.updateEvent(currentEvent._id, eventData);

        if (response.success) {
          // Update the events list with the updated event
          const updatedEvent = response.data;
          setEvents(
            events.map((event) =>
              event._id === currentEvent._id ? updatedEvent : event
            )
          );
          toast.success("Event updated successfully");
          setIsEventModalOpen(false);
        } else {
          // Handle specific error cases
          if (response.statusCode === 401) {
            toast.error(
              "You need to be logged in to update events. Please log in again."
            );
          } else {
            toast.error(response.error || "Failed to update event");
          }
          console.error("Update event error:", response);
        }
      } else {
        // Create new event using our new eventService
        response = await eventService.createEvent(eventData);

        if (response.success) {
          const newEvent = response.data;
          // Add the new event to the events list
          setEvents(Array.isArray(events) ? [...events, newEvent] : [newEvent]);
          toast.success("Event created successfully");
          setIsEventModalOpen(false);
        } else {
          // Handle specific error cases
          if (response.statusCode === 401) {
            toast.error(
              "You need to be logged in to create events. Please log in again."
            );
          } else if (response.networkError) {
            toast.error(
              "Network error. Please check your connection and try again."
            );
          } else {
            toast.error(response.error || "Failed to create event");
          }
          console.error("Create event error:", response);
        }
      }
    } catch (err) {
      toast.error(
        err.message ||
          (currentEvent ? "Failed to update event" : "Failed to create event")
      );
      console.error("Event save error:", err);
    }
  };

  // Filter and sort events based on search query, status filter, and sort order
  const filteredEvents = events
    .filter((event) => {
      // Apply search filter
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOrder) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortOrder("date-desc");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Upcoming
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Completed
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-700">
            {status}
          </Badge>
        );
    }
  };

  // Define table columns
  const columns = [
    {
      header: "Event Name",
      accessorKey: "title",
      cell: (event) => <span className="font-medium">{event.title}</span>,
    },
    {
      header: "Date & Time",
      accessorKey: "date",
      cell: (event) => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm">
            <Calendar className="mr-1 h-3 w-3" />
            {new Date(event.date).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {event.time}
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "category",
      cell: (event) => (
        <Badge variant="outline" className="capitalize">
          {event.category || event.type || "Event"}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (event) => getStatusBadge(event.status),
    },
    {
      header: "Actions",
      cell: (event) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
              <DropdownMenuItem
                onClick={() => handleEditEvent(event)}
                className="cursor-pointer flex items-center text-sm"
                inset
              >
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteEvent(event)}
                className="cursor-pointer flex items-center text-sm text-red-600"
                inset
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
              {event.status === "completed" && (
                <DropdownMenuItem
                  onClick={() => handleUploadResults(event)}
                  className="cursor-pointer flex items-center text-sm"
                  inset
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Results
                </DropdownMenuItem>
              )}
              {event.status === "completed" && (
                <DropdownMenuItem
                  onClick={() => handlePublishResults(event)}
                  className="cursor-pointer flex items-center text-sm"
                  inset
                >
                  <Check className="mr-2 h-4 w-4" /> Publish Results
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      className: "text-right",
    },
  ];

  // Define filter options
  const filterOptions = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      placeholder: "Filter by status",
      options: [
        { value: "all", label: "All Statuses" },
        { value: "upcoming", label: "Upcoming" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
      ],
    },
    {
      value: sortOrder,
      onChange: setSortOrder,
      placeholder: "Sort by",
      options: [
        { value: "date-desc", label: "Newest First" },
        { value: "date-asc", label: "Oldest First" },
        { value: "name-asc", label: "Name (A-Z)" },
        { value: "name-desc", label: "Name (Z-A)" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Event Management"
        description="Create and manage events for your coding club members"
        actions={[
          {
            label: "Add Event",
            icon: <Plus className="h-4 w-4 mr-2" />,
            onClick: handleAddEvent,
            variant: "default",
          },
        ]}
      />

      {/* Filter Bar */}
      <FilterBar
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterOptions}
        onResetFilters={resetFilters}
      />

      {/* Events Table */}
      <DataTable
        columns={columns}
        data={filteredEvents}
        loading={loading}
        emptyState={{
          icon: <Calendar className="h-8 w-8 text-slate-400" />,
          title: "No events found",
          description:
            events.length === 0
              ? "Create your first event to get started"
              : "No events match your current filters. Try adjusting your search or filter criteria.",
          action:
            events.length === 0
              ? {
                  label: "Add Event",
                  icon: <Plus className="mr-2 h-4 w-4" />,
                  onClick: handleAddEvent,
                }
              : null,
        }}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        event={currentEvent}
      />

      <UploadResultsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        event={currentEvent}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Event"
        description={`Are you sure you want to delete "${currentEvent?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
