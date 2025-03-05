"use client";

import { useState } from "react";
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
import { EventModal } from "@/components/event-modal";
import { UploadResultsModal } from "@/components/upload-results-modal";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog";

export function EventsPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "JavaScript Workshop",
      description: "Learn the basics of JavaScript programming",
      date: "2025-03-10",
      time: "18:00",
      type: "workshop",
      status: "upcoming",
    },
    // ... rest of the initial events array
  ]);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

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

  const confirmDeleteEvent = () => {
    if (currentEvent) {
      setEvents(events.filter((event) => event.id !== currentEvent.id));
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUploadResults = (event) => {
    setCurrentEvent(event);
    setIsUploadModalOpen(true);
  };

  const handlePublishResults = (event) => {
    setCurrentEvent(event);
    console.log(`Publishing results for ${event.title}`);
  };

  const handleSaveEvent = (eventData) => {
    if (currentEvent) {
      setEvents(
        events.map((event) =>
          event.id === currentEvent.id ? { ...event, ...eventData } : event
        )
      );
    } else {
      const newEvent = {
        id: events.length + 1,
        ...eventData,
        status: "upcoming",
      };
      setEvents([...events, newEvent]);
    }
    setIsEventModalOpen(false);
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
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Events</h2>
        <div className="flex gap-2">
          <Button onClick={handleAddEvent}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage all coding club events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-1 h-3 w-3" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {event.time}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(event.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteEvent(event)}
                        >
                          <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                        {event.status === "completed" && (
                          <DropdownMenuItem
                            onClick={() => handleUploadResults(event)}
                          >
                            <Upload className="mr-2 h-4 w-4" /> Upload Results
                          </DropdownMenuItem>
                        )}
                        {event.status === "completed" && (
                          <DropdownMenuItem
                            onClick={() => handlePublishResults(event)}
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
        onConfirm={confirmDeleteEvent}
        title="Delete Event"
        description={`Are you sure you want to delete "${currentEvent?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
