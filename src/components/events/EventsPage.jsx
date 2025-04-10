import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/auth-context";
import eventService from "@/services/eventService";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const { state: authState } = useAuth();
  const navigate = useNavigate();

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await eventService.getAllEvents({
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

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await eventService.getUpcomingEvents(5);
        
        if (response.success) {
          setUpcomingEvents(response.data || []);
        } else {
          console.error("Failed to fetch upcoming events:", response.error);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Fetch user's events if authenticated
  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!authState?.isAuthenticated) return;
      
      try {
        const response = await eventService.getUserEvents();
        
        if (response.success) {
          setUserEvents(response.data || []);
        } else {
          console.error("Failed to fetch user events:", response.error);
        }
      } catch (error) {
        console.error("Failed to fetch user events:", error);
      }
    };

    fetchUserEvents();
  }, [authState?.isAuthenticated]);

  // Handle event registration
  const handleRegister = async (eventId) => {
    if (!authState?.isAuthenticated) {
      toast.error("Please log in to register for events");
      navigate("/login", { state: { from: "/events" } });
      return;
    }

    try {
      const response = await eventService.registerForEvent(eventId);
      
      if (response.success) {
        toast.success(response.message || "Successfully registered for the event");
        
        // Update user events
        const userEventsResponse = await eventService.getUserEvents();
        if (userEventsResponse.success) {
          setUserEvents(userEventsResponse.data || []);
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
  const handleUnregister = async (eventId) => {
    try {
      const response = await eventService.unregisterFromEvent(eventId);
      
      if (response.success) {
        toast.success(response.message || "Successfully unregistered from the event");
        
        // Update user events
        const userEventsResponse = await eventService.getUserEvents();
        if (userEventsResponse.success) {
          setUserEvents(userEventsResponse.data || []);
        }
      } else {
        throw new Error(response.error || "Failed to unregister from event");
      }
    } catch (error) {
      toast.error(error.message || "Failed to unregister from event");
      console.error("Unregistration error:", error);
    }
  };

  // Filter events based on search query and category filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      event.category?.toLowerCase() === categoryFilter.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Check if user is registered for an event
  const isRegistered = (eventId) => {
    return userEvents.some(event => event._id === eventId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render event card
  const renderEventCard = (event) => {
    const registered = isRegistered(event._id);
    
    return (
      <Card key={event._id} className="overflow-hidden">
        {event.image && (
          <div className="h-48 overflow-hidden">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <Badge variant={event.status === "upcoming" ? "secondary" : "outline"}>
              {event.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {event.description}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.date)}</span>
            </div>
            {event.time && (
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.time}</span>
              </div>
            )}
            {event.location && (
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.location}</span>
              </div>
            )}
            {event.capacity && (
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  {event.participants?.length || 0} / {event.capacity} participants
                </span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/events/${event._id}`)}
          >
            View Details
          </Button>
          {event.status === "published" && event.isRegistrationRequired && (
            registered ? (
              <Button 
                variant="destructive" 
                onClick={() => handleUnregister(event._id)}
              >
                Unregister
              </Button>
            ) : (
              <Button 
                onClick={() => handleRegister(event._id)}
                disabled={event.capacity && event.participants?.length >= event.capacity}
              >
                Register
              </Button>
            )
          )}
        </CardFooter>
      </Card>
    );
  };

  // Render loading skeleton
  const renderSkeleton = () => {
    return Array(6).fill(0).map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <div className="h-48">
          <Skeleton className="h-full w-full" />
        </div>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Events</h1>
          <p className="text-muted-foreground">
            Discover and register for upcoming coding club events
          </p>
        </div>
      </div>

      {/* Filter and search */}
      <div className="bg-card rounded-lg border p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="workshop">Workshops</SelectItem>
              <SelectItem value="competition">Competitions</SelectItem>
              <SelectItem value="seminar">Seminars</SelectItem>
              <SelectItem value="hackathon">Hackathons</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger 
            value="registered" 
            disabled={!authState?.isAuthenticated}
            onClick={() => {
              if (!authState?.isAuthenticated) {
                toast.error("Please log in to view your registered events");
              }
            }}
          >
            My Events
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderSkeleton()}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(renderEventCard)}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No events found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(renderEventCard)}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No upcoming events</h3>
              <p className="text-muted-foreground">
                Check back later for new events
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="registered" className="mt-6">
          {authState?.isAuthenticated ? (
            userEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userEvents.map(renderEventCard)}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg bg-muted/20">
                <h3 className="text-lg font-medium mb-2">No registered events</h3>
                <p className="text-muted-foreground">
                  You haven't registered for any events yet
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">Please log in</h3>
              <p className="text-muted-foreground mb-4">
                You need to be logged in to view your registered events
              </p>
              <Button onClick={() => navigate("/login", { state: { from: "/events" } })}>
                Log In
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
