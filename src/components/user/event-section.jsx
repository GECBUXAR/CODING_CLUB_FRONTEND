import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ClockIcon,
  CalendarDaysIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";

// Mock data for demonstration - replace with real data from context
const mockUpcomingEvents = [
  {
    id: 1,
    title: "Web Development Workshop",
    description:
      "Learn modern web development techniques with the latest frameworks",
    date: new Date(2023, 8, 15),
    time: "10:00 AM - 2:00 PM",
    location: "Building A, Room 203",
    status: "upcoming",
    totalParticipants: 45,
  },
  {
    id: 2,
    title: "Python for Data Science",
    description:
      "Introduction to data analysis with Python and related libraries",
    date: new Date(2023, 8, 20),
    time: "1:00 PM - 5:00 PM",
    location: "Building B, Computer Lab",
    status: "upcoming",
    totalParticipants: 32,
  },
];

const mockPastEvents = [
  {
    id: 3,
    title: "JavaScript Hackathon",
    description:
      "48-hour coding challenge to build innovative web applications",
    date: new Date(2023, 7, 5),
    result: {
      attended: true,
      position: 2,
      certificate: true,
    },
    status: "completed",
  },
  {
    id: 4,
    title: "UI/UX Design Principles",
    description:
      "Workshop on creating intuitive and accessible user interfaces",
    date: new Date(2023, 6, 28),
    result: {
      attended: true,
      position: null,
      certificate: true,
    },
    status: "completed",
  },
];

export function EventSection() {
  const [activeEvents, _setActiveEvents] = useState(mockUpcomingEvents);
  const [pastEvents, _setPastEvents] = useState(mockPastEvents);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {activeEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle>{event.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                      Enrolled
                    </Badge>
                  </div>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>
                        {event.date.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ClockIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPinIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <UsersIcon className="mr-2 h-4 w-4 opacity-70" />
                      <span>{event.totalParticipants} participants</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Event Details</Button>
                  <Button>Add to Calendar</Button>
                </CardFooter>
              </Card>
            ))}

            {activeEvents.length === 0 && (
              <div className="col-span-2 text-center p-10 bg-muted rounded-lg">
                <CalendarDaysIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No Upcoming Events</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  You're not enrolled in any upcoming events
                </p>
                <Button asChild variant="default">
                  <Link to="/user/events/available">Browse Events</Link>
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Past Events Tab */}
        <TabsContent value="past" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {pastEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span>
                      {event.date.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="space-y-2 border-t pt-3">
                    <h4 className="text-sm font-medium">Event Results</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <span className="mr-2 font-medium">Attendance:</span>
                        {event.result.attended ? (
                          <span className="flex items-center text-green-600">
                            <CheckIcon className="h-4 w-4 mr-1" /> Attended
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <XIcon className="h-4 w-4 mr-1" /> Absent
                          </span>
                        )}
                      </div>

                      {event.result.position && (
                        <div className="flex items-center">
                          <span className="mr-2 font-medium">Position:</span>
                          <span className="text-amber-600 font-medium">
                            {event.result.position === 1
                              ? "1st Place 🥇"
                              : event.result.position === 2
                              ? "2nd Place 🥈"
                              : event.result.position === 3
                              ? "3rd Place 🥉"
                              : `${event.result.position}th Place`}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center col-span-2">
                        <span className="mr-2 font-medium">Certificate:</span>
                        {event.result.certificate ? (
                          <span className="flex items-center text-green-600">
                            <CheckIcon className="h-4 w-4 mr-1" /> Available
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <XIcon className="h-4 w-4 mr-1" /> Not Available
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View Details</Button>
                  {event.result.certificate && (
                    <Button variant="default">Download Certificate</Button>
                  )}
                </CardFooter>
              </Card>
            ))}

            {pastEvents.length === 0 && (
              <div className="col-span-2 text-center p-10 bg-muted rounded-lg">
                <CalendarDaysIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No Past Events</h3>
                <p className="text-sm text-muted-foreground">
                  You haven't participated in any events yet
                </p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
