"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import axios from "axios";

// API base URL and timeout - match the values from api.js
const API_BASE_URL = "http://localhost:39303/api/v1";
const API_TIMEOUT = 5000; // Increased to 5 seconds

// Helper function to detect offline development mode - same as in api.js
const isLikelyOfflineDevelopment = () => {
  return API_BASE_URL.includes("localhost");
};

// Function to create a promise that rejects after a timeout - same as in api.js
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

// Initial state for faculty data
const initialState = {
  faculty: [],
  testimonials: [],
  loading: false,
  error: null,
};

// Action types
const ActionTypes = {
  FETCH_FACULTY_START: "FETCH_FACULTY_START",
  FETCH_FACULTY_SUCCESS: "FETCH_FACULTY_SUCCESS",
  FETCH_FACULTY_ERROR: "FETCH_FACULTY_ERROR",
  ADD_FACULTY_MEMBER: "ADD_FACULTY_MEMBER",
  UPDATE_FACULTY_MEMBER: "UPDATE_FACULTY_MEMBER",
  DELETE_FACULTY_MEMBER: "DELETE_FACULTY_MEMBER",
  FETCH_TESTIMONIALS_SUCCESS: "FETCH_TESTIMONIALS_SUCCESS",
};

// Reducer function to handle state changes
function facultyReducer(state, action) {
  switch (action.type) {
    case ActionTypes.FETCH_FACULTY_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case ActionTypes.FETCH_FACULTY_SUCCESS:
      return {
        ...state,
        faculty: action.payload,
        loading: false,
        error: null,
      };
    case ActionTypes.FETCH_TESTIMONIALS_SUCCESS:
      return {
        ...state,
        testimonials: action.payload,
        loading: false,
        error: null,
      };
    case ActionTypes.FETCH_FACULTY_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case ActionTypes.ADD_FACULTY_MEMBER:
      return {
        ...state,
        faculty: [...state.faculty, action.payload],
      };
    case ActionTypes.UPDATE_FACULTY_MEMBER:
      return {
        ...state,
        faculty: state.faculty.map((member) =>
          member.id === action.payload.id ? action.payload : member
        ),
      };
    case ActionTypes.DELETE_FACULTY_MEMBER:
      return {
        ...state,
        faculty: state.faculty.filter((member) => member.id !== action.payload),
      };
    default:
      return state;
  }
}

// Create context with default value
const FacultyContext = createContext(null);

// Custom hook to use the context
export function useFaculty() {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
}

// Sample data for when API fails
const sampleFaculty = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Computer Science Professor & Head of Department",
    status: "active",
    type: "faculty",
    quote:
      "Teaching computer science is about inspiring the next generation of innovators.",
    imgUrl:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    joinDate: "2020-01-15",
  },
  {
    id: 4,
    name: "Sam Wilson",
    email: "sam.wilson@example.com",
    role: "Assistant Professor",
    status: "inactive",
    type: "faculty",
    quote:
      "Building a strong foundation in algorithms helps students excel in all areas of programming.",
    imgUrl:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    joinDate: "2021-01-05",
  },
  {
    id: 5,
    name: "Taylor Brown",
    email: "taylor.brown@example.com",
    role: "Assistant Professor",
    status: "pending",
    type: "faculty",
    quote:
      "Teaching students to think logically is the key to success in computer science.",
    imgUrl:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    joinDate: "2022-09-15",
  },
];

// Sample testimonials
const sampleTestimonials = [
  {
    id: "testimonial-raj",
    imageSrc: "/rajshekar.jpg",
    altText: "Dr. Chandra Shekar",
    quote:
      "Creating web games was easier than I thought. The step-by-step tutorials made complex concepts accessible.",
    name: "Dr. Chandra Shekar",
    role: "Computer Science Professor & Head of Department",
  },
  {
    id: "testimonial-rina",
    imageSrc: "/rina.jpg",
    altText: "Dr. Rina Kumari",
    quote:
      "The chat with the tutors is good because I can get help as soon as I get stuck. It's like having a mentor available 24/7.",
    name: "Dr. Rina Kumari",
    role: "Assistant Professor",
  },
];

// Provider component
export function FacultyProvider({ children }) {
  const [state, dispatch] = useReducer(facultyReducer, initialState);
  // Use a ref to track fetch attempts and prevent loops
  const fetchAttempted = useRef(false);

  // Function to fetch faculty data from the backend - using useCallback to prevent useEffect infinite loops
  const fetchFaculty = useCallback(async () => {
    // Skip if we've already tried to fetch in development mode
    if (isLikelyOfflineDevelopment() && fetchAttempted.current) {
      return;
    }

    dispatch({ type: ActionTypes.FETCH_FACULTY_START });
    fetchAttempted.current = true;

    try {
      // Use race between fetch and timeout, like in our api.js
      const result = await Promise.race([
        axios.get(`${API_BASE_URL}/faculty`),
        timeoutPromise(API_TIMEOUT),
      ]);

      dispatch({
        type: ActionTypes.FETCH_FACULTY_SUCCESS,
        payload: result.data,
      });
    } catch (error) {
      console.error("Error fetching faculty data:", error);

      // Use sample data if backend fetch fails
      console.log("Using sample faculty data as fallback");

      dispatch({
        type: ActionTypes.FETCH_FACULTY_SUCCESS,
        payload: sampleFaculty,
      });

      // Only dispatch error once
      if (state.error === null) {
        dispatch({
          type: ActionTypes.FETCH_FACULTY_ERROR,
          payload: error.message || "Failed to fetch faculty data",
        });
      }
    }
  }, [state.error]);

  // Function to fetch testimonials - using useCallback to prevent useEffect infinite loops
  const fetchTestimonials = useCallback(async () => {
    // Skip additional requests in development mode
    if (isLikelyOfflineDevelopment() && state.testimonials.length > 0) {
      return;
    }

    dispatch({ type: ActionTypes.FETCH_FACULTY_START });

    try {
      // Use race between fetch and timeout, like in our api.js
      const result = await Promise.race([
        axios.get(`${API_BASE_URL}/testimonials`),
        timeoutPromise(API_TIMEOUT),
      ]);

      dispatch({
        type: ActionTypes.FETCH_TESTIMONIALS_SUCCESS,
        payload: result.data,
      });
    } catch (error) {
      console.error("Error fetching testimonials:", error);

      // Use sample data if backend fetch fails - this is crucial for development
      console.log("Using sample testimonials data as fallback");

      dispatch({
        type: ActionTypes.FETCH_TESTIMONIALS_SUCCESS,
        payload: sampleTestimonials,
      });

      // Don't repeatedly dispatch error for testimonials
      if (state.testimonials.length === 0 && state.error === null) {
        dispatch({
          type: ActionTypes.FETCH_FACULTY_ERROR,
          payload: error.message || "Failed to fetch testimonials",
        });
      }
    }
  }, [state.testimonials.length, state.error]);

  // Function to add a new faculty member to the backend
  const addFacultyMember = useCallback(
    async (facultyData) => {
      try {
        // Use race between fetch and timeout
        const result = await Promise.race([
          axios.post(`${API_BASE_URL}/faculty`, facultyData, {
            headers: { "Content-Type": "application/json" },
          }),
          timeoutPromise(API_TIMEOUT),
        ]);

        const newFaculty = result.data;

        dispatch({
          type: ActionTypes.ADD_FACULTY_MEMBER,
          payload: newFaculty,
        });

        return newFaculty;
      } catch (error) {
        console.error("Error adding faculty member:", error);

        // For development, still add to local state even if API fails
        const newFaculty = {
          ...facultyData,
          id: Date.now(),
        };

        dispatch({
          type: ActionTypes.ADD_FACULTY_MEMBER,
          payload: newFaculty,
        });

        if (state.error === null) {
          dispatch({
            type: ActionTypes.FETCH_FACULTY_ERROR,
            payload: error.message || "Failed to add faculty member",
          });
        }

        return newFaculty;
      }
    },
    [state.error]
  );

  // Function to update a faculty member
  const updateFacultyMember = useCallback(
    async (id, facultyData) => {
      try {
        // Use race between fetch and timeout
        const result = await Promise.race([
          axios.put(`${API_BASE_URL}/faculty/${id}`, facultyData, {
            headers: { "Content-Type": "application/json" },
          }),
          timeoutPromise(API_TIMEOUT),
        ]);

        const updatedFaculty = result.data;

        dispatch({
          type: ActionTypes.UPDATE_FACULTY_MEMBER,
          payload: updatedFaculty,
        });

        return updatedFaculty;
      } catch (error) {
        console.error("Error updating faculty member:", error);

        // For development mode, update the local state anyway
        const updatedFaculty = {
          ...facultyData,
          id,
        };

        dispatch({
          type: ActionTypes.UPDATE_FACULTY_MEMBER,
          payload: updatedFaculty,
        });

        if (state.error === null) {
          dispatch({
            type: ActionTypes.FETCH_FACULTY_ERROR,
            payload: error.message || "Failed to update faculty member",
          });
        }

        return updatedFaculty;
      }
    },
    [state.error]
  );

  // Function to delete a faculty member
  const deleteFacultyMember = useCallback(
    async (id) => {
      try {
        // Use race between fetch and timeout
        await Promise.race([
          axios.delete(`${API_BASE_URL}/faculty/${id}`),
          timeoutPromise(API_TIMEOUT),
        ]);

        dispatch({
          type: ActionTypes.DELETE_FACULTY_MEMBER,
          payload: id,
        });

        return { success: true };
      } catch (error) {
        console.error("Error deleting faculty member:", error);

        // For development, still delete from local state
        dispatch({
          type: ActionTypes.DELETE_FACULTY_MEMBER,
          payload: id,
        });

        if (state.error === null) {
          dispatch({
            type: ActionTypes.FETCH_FACULTY_ERROR,
            payload: error.message || "Failed to delete faculty member",
          });
        }

        // We still consider this successful in dev mode since we updated local state
        return { success: true, isOfflineMode: true };
      }
    },
    [state.error]
  );

  // Fetch faculty and testimonials on mount
  useEffect(() => {
    // Only fetch if we haven't already tried in development mode
    if (!fetchAttempted.current) {
      fetchFaculty();
      fetchTestimonials();
    }
  }, [fetchFaculty, fetchTestimonials]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: ActionTypes.FETCH_FACULTY_ERROR, payload: null });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.error]);

  // Provide context values
  return (
    <FacultyContext.Provider
      value={{
        faculty: state.faculty,
        testimonials: state.testimonials,
        loading: state.loading,
        error: state.error,
        fetchFaculty,
        fetchTestimonials,
        addFacultyMember,
        updateFacultyMember,
        deleteFacultyMember,
      }}
    >
      {children}
    </FacultyContext.Provider>
  );
}
