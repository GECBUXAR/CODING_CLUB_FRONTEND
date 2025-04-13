import enhancedApiClient from "./enhancedApi";

/**
 * Event Service - Handles all event-related API calls
 */
const eventService = {
  /**
   * Get all events with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  getAllEvents: async (params = {}) => {
    try {
      const response = await enhancedApiClient.get("/events", { params });
      return {
        success: true,
        data: response.data.data || [],
        pagination: {
          total: response.data.total,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
        },
      };
    } catch (error) {
      console.error("Error fetching events:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch events",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get upcoming events
   * @param {number} limit - Number of events to fetch
   * @returns {Promise} - API response
   */
  getUpcomingEvents: async (limit = 5) => {
    try {
      const response = await enhancedApiClient.get("/events/upcoming", {
        params: { limit },
      });
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Error fetching upcoming events:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch upcoming events",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Search events
   * @param {string} query - Search query
   * @param {number} limit - Number of results to return
   * @returns {Promise} - API response
   */
  searchEvents: async (query, limit = 10) => {
    try {
      const response = await enhancedApiClient.get("/events/search", {
        params: { q: query, limit },
      });
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Error searching events:", error);
      return {
        success: false,
        error: error.message || "Failed to search events",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get user's events
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getUserEvents: async (params = {}) => {
    try {
      const response = await enhancedApiClient.get("/events/user-events", {
        params,
      });
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Error fetching user events:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch your events",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get event by ID
   * @param {string} id - Event ID
   * @returns {Promise} - API response
   */
  getEventById: async (id) => {
    try {
      const response = await enhancedApiClient.get(`/events/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch event details",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Create a new event
   * @param {Object} eventData - Event data
   * @returns {Promise} - API response
   */
  createEvent: async (eventData) => {
    try {
      // Format date if it's a string
      const formattedData = {
        ...eventData,
        date:
          eventData.date && typeof eventData.date === "string"
            ? new Date(eventData.date).toISOString()
            : eventData.date,
      };

      console.log("Creating event with data:", formattedData);

      const response = await enhancedApiClient.post("/events", formattedData);
      console.log("Event creation response:", response.data);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error creating event:", error);
      // More detailed error logging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);

        return {
          success: false,
          error:
            error.response.data?.message ||
            `Server error: ${error.response.status}`,
          statusCode: error.response.status,
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        return {
          success: false,
          error:
            "No response received from server. Please check your network connection.",
          networkError: true,
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        return {
          success: false,
          error: error.message || "Failed to create event",
        };
      }
    }
  },

  /**
   * Update an event
   * @param {string} id - Event ID
   * @param {Object} eventData - Updated event data
   * @returns {Promise} - API response
   */
  updateEvent: async (id, eventData) => {
    try {
      // Format date if it's a string
      const formattedData = {
        ...eventData,
        date:
          eventData.date && typeof eventData.date === "string"
            ? new Date(eventData.date).toISOString()
            : eventData.date,
      };

      const response = await enhancedApiClient.put(
        `/events/${id}`,
        formattedData
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to update event",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Delete an event
   * @param {string} id - Event ID
   * @returns {Promise} - API response
   */
  deleteEvent: async (id) => {
    try {
      await enhancedApiClient.delete(`/events/${id}`);
      return {
        success: true,
        message: "Event deleted successfully",
      };
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to delete event",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Register for an event
   * @param {string} id - Event ID
   * @returns {Promise} - API response
   */
  registerForEvent: async (id) => {
    try {
      const response = await enhancedApiClient.post(`/events/${id}/register`);
      return {
        success: true,
        message:
          response.data.message || "Successfully registered for the event",
      };
    } catch (error) {
      console.error(`Error registering for event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to register for event",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Unregister from an event
   * @param {string} id - Event ID
   * @returns {Promise} - API response
   */
  unregisterFromEvent: async (id) => {
    try {
      const response = await enhancedApiClient.post(`/events/${id}/unregister`);
      return {
        success: true,
        message:
          response.data.message || "Successfully unregistered from the event",
      };
    } catch (error) {
      console.error(`Error unregistering from event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to unregister from event",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Mark attendance for an event
   * @param {string} id - Event ID
   * @param {string} userId - User ID
   * @param {boolean} attended - Whether the user attended
   * @returns {Promise} - API response
   */
  markAttendance: async (id, userId, attended = true) => {
    try {
      const response = await enhancedApiClient.post(
        `/events/${id}/attendance`,
        {
          userId,
          attended,
        }
      );
      return {
        success: true,
        message: response.data.message || "Attendance marked successfully",
      };
    } catch (error) {
      console.error(`Error marking attendance for event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to mark attendance",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Submit feedback for an event
   * @param {string} id - Event ID
   * @param {Object} feedback - Feedback data
   * @returns {Promise} - API response
   */
  submitFeedback: async (id, feedback) => {
    try {
      const response = await enhancedApiClient.post(
        `/events/${id}/feedback`,
        feedback
      );
      return {
        success: true,
        message: response.data.message || "Feedback submitted successfully",
      };
    } catch (error) {
      console.error(`Error submitting feedback for event ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to submit feedback",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },
};

export default eventService;
