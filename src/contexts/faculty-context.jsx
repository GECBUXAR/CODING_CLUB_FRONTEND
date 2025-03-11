"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useRef,
} from "react";
import apiClient from "../services/api";

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
    // Skip if we've already tried to fetch and are in development with sample data
    if (fetchAttempted.current && import.meta.env.DEV) {
      return;
    }

    dispatch({ type: ActionTypes.FETCH_FACULTY_START });
    fetchAttempted.current = true;

    try {
      const response = await apiClient.get("/faculty");

      dispatch({
        type: ActionTypes.FETCH_FACULTY_SUCCESS,
        payload: response.data.data || [],
      });
    } catch (error) {
      console.error("Error fetching faculty:", error);

      // Use sample data in development or if there's an error
      if (import.meta.env.DEV) {
        console.log("Using sample faculty data");
        dispatch({
          type: ActionTypes.FETCH_FACULTY_SUCCESS,
          payload: sampleFaculty,
        });
      } else {
        dispatch({
          type: ActionTypes.FETCH_FACULTY_ERROR,
          payload: error.message || "Failed to fetch faculty data",
        });
      }
    }
  }, []);

  // Function to fetch testimonials
  const fetchTestimonials = useCallback(async () => {
    if (fetchAttempted.current && import.meta.env.DEV) {
      return;
    }

    dispatch({ type: ActionTypes.FETCH_FACULTY_START });
    fetchAttempted.current = true;

    try {
      const response = await apiClient.get("/testimonials");

      dispatch({
        type: ActionTypes.FETCH_TESTIMONIALS_SUCCESS,
        payload: response.data.data || [],
      });
    } catch (error) {
      console.error("Error fetching testimonials:", error);

      // Use sample data in development or if there's an error
      if (import.meta.env.DEV) {
        console.log("Using sample testimonial data");
        dispatch({
          type: ActionTypes.FETCH_TESTIMONIALS_SUCCESS,
          payload: sampleTestimonials,
        });
      } else {
        dispatch({
          type: ActionTypes.FETCH_FACULTY_ERROR,
          payload: error.message || "Failed to fetch testimonials",
        });
      }
    }
  }, []);

  // Add a new faculty member
  const addFacultyMember = useCallback(async (facultyData) => {
    dispatch({ type: ActionTypes.FETCH_FACULTY_START });

    try {
      const response = await apiClient.post("/faculty", facultyData);

      dispatch({
        type: ActionTypes.ADD_FACULTY_MEMBER,
        payload: response.data.data,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error adding faculty member:", error);

      dispatch({
        type: ActionTypes.FETCH_FACULTY_ERROR,
        payload: error.message || "Failed to add faculty member",
      });

      return {
        success: false,
        error: error.message || "Failed to add faculty member",
      };
    }
  }, []);

  // Update a faculty member
  const updateFacultyMember = useCallback(async (id, facultyData) => {
    dispatch({ type: ActionTypes.FETCH_FACULTY_START });

    try {
      const response = await apiClient.put(`/faculty/${id}`, facultyData);

      dispatch({
        type: ActionTypes.UPDATE_FACULTY_MEMBER,
        payload: response.data.data,
      });

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error updating faculty member:", error);

      dispatch({
        type: ActionTypes.FETCH_FACULTY_ERROR,
        payload: error.message || "Failed to update faculty member",
      });

      return {
        success: false,
        error: error.message || "Failed to update faculty member",
      };
    }
  }, []);

  // Delete a faculty member
  const deleteFacultyMember = useCallback(async (id) => {
    dispatch({ type: ActionTypes.FETCH_FACULTY_START });

    try {
      await apiClient.delete(`/faculty/${id}`);

      dispatch({
        type: ActionTypes.DELETE_FACULTY_MEMBER,
        payload: id,
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting faculty member:", error);

      dispatch({
        type: ActionTypes.FETCH_FACULTY_ERROR,
        payload: error.message || "Failed to delete faculty member",
      });

      return {
        success: false,
        error: error.message || "Failed to delete faculty member",
      };
    }
  }, []);

  // Fetch faculty data on mount
  useEffect(() => {
    fetchFaculty();
    fetchTestimonials();
  }, [fetchFaculty, fetchTestimonials]);

  // Prepare value object for context provider
  const value = {
    faculty: state.faculty,
    testimonials: state.testimonials,
    loading: state.loading,
    error: state.error,
    fetchFaculty,
    fetchTestimonials,
    addFacultyMember,
    updateFacultyMember,
    deleteFacultyMember,
  };

  return (
    <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>
  );
}
