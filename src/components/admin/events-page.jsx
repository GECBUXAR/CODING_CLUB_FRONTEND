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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EventModal } from "@/components/admin/event-modal";
import { UploadResultsModal } from "@/components/admin/upload-results-modal";
import { DeleteConfirmationDialog } from "@/components/admin/delete-confirmation-dialog";
import { toast } from "react-hot-toast";
import apiClient from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("/events");
        setEvents(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error("Failed to load events");
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
      await apiClient.delete(`/events/${currentEvent._id}`);
      setIsDeleteDialogOpen(false);
      toast.success("Event deleted successfully");

      // Update the events list
      setEvents(
        Array.isArray(events)
          ? events.filter((event) => event._id !== currentEvent._id)
          : []
      );
    } catch (err) {
      toast.error("Failed to delete event");
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
      if (currentEvent) {
        // Update existing event
        const response = await apiClient.put(
          `/events/${currentEvent._id}`,
          eventData
        );
        setEvents(
          events.map((event) =>
            event._id === currentEvent._id ? response.data.data : event
          )
        );
        toast.success("Event updated successfully");
      } else {
        // Create new event
        const response = await apiClient.post("/events", eventData);
        setEvents([...events, response.data.data]);
        toast.success("Event created successfully");
      }
      setIsEventModalOpen(false);
    } catch (err) {
      toast.error(
        currentEvent ? "Failed to update event" : "Failed to create event"
      );
      console.error("Event save error:", err);
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Events</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleAddEvent}
            className="bg-primary text-white hover:bg-primary/90"
            variant="default"
            size="default"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <Card className="border rounded-lg shadow-sm">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-xl">All Events</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Manage all coding club events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-[250px]" />
                  <Skeleton className="h-12 w-[150px]" />
                  <Skeleton className="h-12 w-[100px]" />
                  <Skeleton className="h-12 w-[100px]" />
                  <Skeleton className="h-12 w-[100px] ml-auto" />
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No events found. Create your first event!
              </p>
            </div>
          ) : (
            <Table className="w-full">
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="py-3 font-medium">Event Name</TableHead>
                  <TableHead className="py-3 font-medium">
                    Date & Time
                  </TableHead>
                  <TableHead className="py-3 font-medium">Type</TableHead>
                  <TableHead className="py-3 font-medium">Status</TableHead>
                  <TableHead className="text-right py-3 font-medium">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {events.map((event) => (
                  <TableRow
                    key={event._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell className="py-3">
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
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant="outline" className="capitalize">
                        {event.category || event.type || "Event"}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      {getStatusBadge(event.status)}
                    </TableCell>
                    <TableCell className="text-right py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                          >
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

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
