"use client";

import React from "react";
import { useState } from "react";
import { useEvents } from "@/contexts/event-context";
import { useAuth } from "@/contexts/auth-context";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import EventResultsPanel from "./event-results-panel";

const AllEventsPage = () => {
  const {
    events,
    userEvents,
    loading,
    fetchEvents,
    enrollInEvent,
    unenrollFromEvent,
  } = useEvents();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(events.map((event) => event.category))),
  ];

  // Filter events based on search and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEnrollment = async (eventId, isEnrolled) => {
    try {
      if (isEnrolled) {
        await unenrollFromEvent(eventId);
      } else {
        await enrollInEvent(eventId);
      }
    } catch (error) {
      console.error("Enrollment action failed:", error);
    }
  };

  const handleViewResults = (eventId) => {
    setSelectedEvent(eventId);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Coding Club Events
          </h1>
          <p className="text-gray-600 mt-1">
            Discover and join our exclusive events
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-2">
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                <TabsContent value="all" className="mt-0">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-20 w-full mb-4" />
                            <div className="flex gap-2 mb-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-32" />
                          </CardContent>
                          <CardFooter>
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        No events found matching your criteria.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("All");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">
                                {event.eventName}
                              </CardTitle>
                              <Badge>{event.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {event.description}
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>
                                  {event.date} at {event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span>{event.attendees} attendees</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex gap-2 justify-between">
                            {isAuthenticated && (
                              <Button
                                variant={
                                  event.isEnrolled ? "outline" : "default"
                                }
                                onClick={() =>
                                  handleEnrollment(event.id, !!event.isEnrolled)
                                }
                                className="flex-1"
                              >
                                {event.isEnrolled ? "Unenroll" : "Enroll"}
                              </Button>
                            )}

                            {event.results && (
                              <Button
                                variant="secondary"
                                onClick={() => handleViewResults(event.id)}
                                className="flex-1"
                              >
                                View Results
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </TabsTrigger>
              <TabsTrigger value="enrolled">
                <TabsContent value="enrolled" className="mt-0">
                  {!isAuthenticated ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        Please log in to view your enrolled events.
                      </p>
                      <Button asChild>
                        <a href="/login">Log In</a>
                      </Button>
                    </div>
                  ) : loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-20 w-full mb-4" />
                            <div className="flex gap-2 mb-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-32" />
                          </CardContent>
                          <CardFooter>
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : userEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        You haven't enrolled in any events yet.
                      </p>
                      <Button asChild>
                        <a href="#all">Browse Events</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-xl">
                                {event.eventName}
                              </CardTitle>
                              <Badge>{event.category}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 mb-4 line-clamp-3">
                              {event.description}
                            </p>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>
                                  {event.date} at {event.time}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex gap-2 justify-between">
                            <Button
                              variant="outline"
                              onClick={() => handleEnrollment(event.id, true)}
                              className="flex-1"
                            >
                              Unenroll
                            </Button>

                            {event.results && (
                              <Button
                                variant="secondary"
                                onClick={() => handleViewResults(event.id)}
                                className="flex-1"
                              >
                                View Results
                              </Button>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Event Results</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <EventResultsPanel
              eventId={selectedEvent}
              onClose={handleCloseResults}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllEventsPage;
