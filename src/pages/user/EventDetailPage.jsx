import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ChevronLeft,
  Star,
  MessageSquare,
} from "lucide-react";
import { extractIdFromParam } from "@/utils/urlUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/optimized-auth-context";
import eventService from "@/services/eventService";

export default function EventDetailPage() {
  const { eventParam } = useParams();
  const eventId = extractIdFromParam(eventParam);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const response = await eventService.getEventById(eventId);

        if (response.success && response.data) {
          setEvent(response.data);

          // Check if user is registered
          if (
            authState?.isAuthenticated &&
            response.data.participants &&
            Array.isArray(response.data.participants)
          ) {
            const registered = response.data.participants.some(
              (p) => p.user && p.user._id === authState.user._id
            );
            setIsRegistered(registered);
          }
        } else {
          throw new Error(response.error || "Failed to fetch event details");
        }
      } catch (error) {
        console.error("Failed to fetch event details:", error);
        toast.error(error.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id, authState?.isAuthenticated, authState?.user?._id]);

  // Handle event registration
  const handleRegister = async () => {
    if (!authState?.isAuthenticated) {
      toast.error("Please log in to register for events");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    try {
      const response = await eventService.registerForEvent(id);

      if (response.success) {
        toast.success(
          response.message || "Successfully registered for the event"
        );
        setIsRegistered(true);

        // Refresh event details to get updated participants list
        const eventResponse = await eventService.getEventById(id);
        if (eventResponse.success) {
          setEvent(eventResponse.data);
        }
      } else {
        throw new Error(response.error || "Failed to register for event");
      }
    } catch (error) {
      toast.error(error.message || "Failed to register for event");
      console.error("Registration error:", error);
    }
  };

  // Handle event unregistration
  const handleUnregister = async () => {
    try {
      const response = await eventService.unregisterFromEvent(id);

      if (response.success) {
        toast.success(
          response.message || "Successfully unregistered from the event"
        );
        setIsRegistered(false);

        // Refresh event details to get updated participants list
        const eventResponse = await eventService.getEventById(id);
        if (eventResponse.success) {
          setEvent(eventResponse.data);
        }
      } else {
        throw new Error(response.error || "Failed to unregister from event");
      }
    } catch (error) {
      toast.error(error.message || "Failed to unregister from event");
      console.error("Unregistration error:", error);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async () => {
    if (!authState?.isAuthenticated) {
      toast.error("Please log in to submit feedback");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const response = await eventService.submitFeedback(id, {
        rating: feedbackRating,
        comment: feedbackComment,
      });

      if (response.success) {
        toast.success(response.message || "Feedback submitted successfully");
        setIsFeedbackModalOpen(false);

        // Refresh event details
        const eventResponse = await eventService.getEventById(id);
        if (eventResponse.success) {
          setEvent(eventResponse.data);
        }
      } else {
        throw new Error(response.error || "Failed to submit feedback");
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit feedback");
      console.error("Feedback submission error:", error);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if user can submit feedback
  const canSubmitFeedback = () => {
    if (!authState?.isAuthenticated || !event) return false;

    // Check if user attended the event
    if (!event.participants || !Array.isArray(event.participants)) return false;

    const userParticipation = event.participants.find(
      (p) => p.user && p.user._id === authState.user._id
    );

    return userParticipation?.attended && event.status === "completed";
  };

  // Render loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-40 mb-2" />
          <Skeleton className="h-12 w-3/4 mb-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          <div>
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Render 404 if event not found
  if (!event) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/events")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => navigate("/events")}
        className="mb-6"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      {/* Event header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="capitalize">
            {event.category || "Event"}
          </Badge>
          <Badge
            variant={
              event.status === "upcoming"
                ? "secondary"
                : event.status === "completed"
                ? "success"
                : event.status === "cancelled"
                ? "destructive"
                : "outline"
            }
          >
            {event.status}
          </Badge>
          {event.isFeatured && (
            <Badge variant="default" className="bg-amber-500">
              Featured
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {event.title}
        </h1>
        <p className="text-muted-foreground">
          Organized by {event.organizer?.name || "Coding Club"}
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Event details */}
        <div className="md:col-span-2">
          {event.image && (
            <div className="rounded-lg overflow-hidden mb-6 border">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none mb-8">
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <div className="whitespace-pre-line">{event.description}</div>
          </div>

          {event.speakers && event.speakers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Speakers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers.map((speaker, index) => (
                  <Card key={`speaker-${speaker.name}-${index}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {speaker.avatar ? (
                          <img
                            src={speaker.avatar}
                            alt={speaker.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xl font-semibold">
                              {speaker.name?.charAt(0) || "S"}
                            </span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{speaker.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {speaker.title}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {event.tags && event.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <Badge
                    key={`tag-${tag}-${index}`}
                    variant="secondary"
                    className="capitalize"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Event Details</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Calendar className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {formatDate(event.date)}
                    </p>
                  </div>
                </div>

                {event.time && (
                  <div className="flex items-start">
                    <Clock className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                )}

                {event.location && (
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start">
                    <Users className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-muted-foreground">
                        {event.participants && Array.isArray(event.participants)
                          ? event.participants.length
                          : 0}{" "}
                        / {event.capacity} participants
                      </p>
                    </div>
                  </div>
                )}

                {event.skillLevel && (
                  <div className="flex items-start">
                    <Tag className="mr-3 h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Skill Level</p>
                      <p className="text-muted-foreground capitalize">
                        {event.skillLevel}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Registration */}
          {event.isRegistrationRequired && event.status === "published" && (
            <div className="mb-6">
              {isRegistered ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleUnregister}
                >
                  Cancel Registration
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={
                    event.capacity &&
                    (event.participants && Array.isArray(event.participants)
                      ? event.participants.length >= event.capacity
                      : false)
                  }
                >
                  Register for Event
                </Button>
              )}

              {!authState?.isAuthenticated && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  You need to be logged in to register
                </p>
              )}

              {event.capacity &&
                (event.participants && Array.isArray(event.participants)
                  ? event.participants.length >= event.capacity
                  : false) && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    This event has reached its capacity
                  </p>
                )}
            </div>
          )}

          {/* Feedback button */}
          {canSubmitFeedback() && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          )}
        </div>
      </div>

      {/* Feedback modal */}
      <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Share your thoughts about this event. Your feedback helps us
              improve future events.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <label
                htmlFor="rating"
                className="block text-sm font-medium mb-2"
              >
                Rating (1-5 stars)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant={feedbackRating >= rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackRating(rating)}
                    className="h-10 w-10 p-0"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        feedbackRating >= rating ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="feedback-comment"
                className="block text-sm font-medium mb-2"
              >
                Comments (optional)
              </label>
              <Textarea
                placeholder="Share your experience..."
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFeedbackModalOpen(false)}
              disabled={submittingFeedback}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={submittingFeedback}
            >
              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
