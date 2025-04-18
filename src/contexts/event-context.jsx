import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import enhancedApiClient from "../services/enhancedApi";
import { useAuth } from "./optimized-auth-context";

const EventContext = createContext({
  events: [],
  userEvents: [],
  loading: false,
  fetchEvents: () => {},
  fetchUserEvents: () => {},
  enrollInEvent: () => {},
  unenrollFromEvent: () => {},
  getEventById: () => {},
  searchEvents: () => {},
});

export const EventProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialFetchDone = useRef(false);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await enhancedApiClient.get("/events", {}, true);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserEvents = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const response = await enhancedApiClient.get(
        "/events/user-events",
        {},
        true
      );
      setUserEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch user events:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const enrollInEvent = async (eventId) => {
    try {
      setLoading(true);
      await enhancedApiClient.post(`/events/${eventId}/enroll`);

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, isEnrolled: true } : event
        )
      );

      await fetchUserEvents();
    } catch (error) {
      console.error("Failed to enroll in event:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const unenrollFromEvent = async (eventId) => {
    try {
      setLoading(true);
      await enhancedApiClient.post(`/events/${eventId}/unenroll`);

      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, isEnrolled: false } : event
        )
      );

      await fetchUserEvents();
    } catch (error) {
      console.error("Failed to unenroll from event:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getEventById = async (eventId) => {
    try {
      const response = await enhancedApiClient.get(
        `/events/${eventId}`,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get event ${eventId}:`, error);
      return null;
    }
  };

  const searchEvents = async (query, category) => {
    try {
      const params = new URLSearchParams();
      if (query) params.append("q", query);
      if (category) params.append("category", category);

      const response = await enhancedApiClient.get(
        `/events/search?${params.toString()}`,
        {},
        true
      );
      return response.data;
    } catch (error) {
      console.error("Failed to search events:", error);
      return [];
    }
  };

  useEffect(() => {
    // Only fetch on initial mount, not on every rerender
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchEvents();
      if (isAuthenticated) {
        fetchUserEvents();
      }
    }
  }, [isAuthenticated, fetchEvents, fetchUserEvents]);

  return (
    <EventContext.Provider
      value={{
        events,
        userEvents,
        loading,
        fetchEvents,
        fetchUserEvents,
        enrollInEvent,
        unenrollFromEvent,
        getEventById,
        searchEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
