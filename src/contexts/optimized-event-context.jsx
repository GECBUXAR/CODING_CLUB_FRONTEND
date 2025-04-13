import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import enhancedApiClient from "../services/enhancedApi";
import { useAuth } from "./optimized-auth-context";

// Create separate contexts for state and actions
const EventStateContext = createContext(null);
const EventActionsContext = createContext(null);

// Event provider component
export const EventProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const initialFetchDone = useRef(false);

  // Use useRef for stable function references
  const fetchEventsRef = useRef(async () => {
    try {
      setLoading(true);
      const response = await enhancedApiClient.get("/events", {}, true);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  });

  // Create stable callbacks
  const fetchEvents = useCallback(() => fetchEventsRef.current(), []);

  // Use useRef for stable function references
  const fetchUserEventsRef = useRef(async () => {
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
  });

  // Update the ref when isAuthenticated changes
  useEffect(() => {
    fetchUserEventsRef.current = async () => {
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
    };
  }, [isAuthenticated]);

  // Create stable callback
  const fetchUserEvents = useCallback(() => fetchUserEventsRef.current(), []);

  // Memoized enroll in event function
  const enrollInEvent = useCallback(
    async (eventId) => {
      try {
        setLoading(true);
        await enhancedApiClient.post(`/events/${eventId}/enroll`);

        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId ? { ...event, isEnrolled: true } : event
          )
        );

        // Use the ref directly to avoid dependency issues
        await fetchUserEventsRef.current();
      } catch (error) {
        console.error("Failed to enroll in event:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [] // No dependencies needed since we use the ref
  );

  // Memoized unenroll from event function
  const unenrollFromEvent = useCallback(
    async (eventId) => {
      try {
        setLoading(true);
        await enhancedApiClient.post(`/events/${eventId}/unenroll`);

        setEvents((prev) =>
          prev.map((event) =>
            event.id === eventId ? { ...event, isEnrolled: false } : event
          )
        );

        // Use the ref directly to avoid dependency issues
        await fetchUserEventsRef.current();
      } catch (error) {
        console.error("Failed to unenroll from event:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [] // No dependencies needed since we use the ref
  );

  // Memoized get event by ID function
  const getEventById = useCallback(async (eventId) => {
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
  }, []);

  // Memoized search events function
  const searchEvents = useCallback(async (query, category) => {
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
  }, []);

  // Effect to fetch events on initial mount
  useEffect(() => {
    // Only fetch on initial mount, not on every rerender
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;

      // Use a timeout to stagger API calls
      const timer = setTimeout(() => {
        fetchEventsRef.current();

        if (isAuthenticated) {
          // Add a small delay before the second API call
          setTimeout(() => {
            fetchUserEventsRef.current();
          }, 1000);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]); // Only depend on isAuthenticated

  // Memoize state value to prevent unnecessary re-renders
  const stateValue = useMemo(
    () => ({
      events,
      userEvents,
      loading,
    }),
    [events, userEvents, loading]
  );

  // Memoize actions value to prevent unnecessary re-renders
  const actionsValue = useMemo(
    () => ({
      fetchEvents,
      fetchUserEvents,
      enrollInEvent,
      unenrollFromEvent,
      getEventById,
      searchEvents,
    }),
    [
      fetchEvents,
      fetchUserEvents,
      enrollInEvent,
      unenrollFromEvent,
      getEventById,
      searchEvents,
    ]
  );

  return (
    <EventStateContext.Provider value={stateValue}>
      <EventActionsContext.Provider value={actionsValue}>
        {children}
      </EventActionsContext.Provider>
    </EventStateContext.Provider>
  );
};

// Custom hooks to use event context
export const useEventState = () => {
  const context = useContext(EventStateContext);
  if (context === undefined) {
    throw new Error("useEventState must be used within an EventProvider");
  }
  return context;
};

export const useEventActions = () => {
  const context = useContext(EventActionsContext);
  if (context === undefined) {
    throw new Error("useEventActions must be used within an EventProvider");
  }
  return context;
};

// Combined hook for backward compatibility
export const useEvents = () => {
  const state = useEventState();
  const actions = useEventActions();
  return { ...state, ...actions };
};
