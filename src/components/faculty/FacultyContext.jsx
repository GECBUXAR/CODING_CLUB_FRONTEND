import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import apiClient from "@/services/api";

// Initial state for faculty data
const initialState = {
  faculty: [],
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
          member._id === action.payload._id ? action.payload : member
        ),
      };
    case ActionTypes.DELETE_FACULTY_MEMBER:
      return {
        ...state,
        faculty: state.faculty.filter(
          (member) => member._id !== action.payload
        ),
      };
    default:
      return state;
  }
}

// Create context
const FacultyContext = createContext(null);

// Custom hook to use the context
export function useFaculty() {
  const context = useContext(FacultyContext);
  if (context === undefined) {
    throw new Error("useFaculty must be used within a FacultyProvider");
  }
  return context;
}

export function FacultyProvider({ children }) {
  const [state, dispatch] = useReducer(facultyReducer, initialState);

  // Function to fetch faculty data
  const fetchFaculty = useCallback(async () => {
    dispatch({ type: ActionTypes.FETCH_FACULTY_START });

    try {
      const response = await apiClient.get("/faculty");

      dispatch({
        type: ActionTypes.FETCH_FACULTY_SUCCESS,
        payload: response.data.data || [],
      });
    } catch (error) {
      console.error("Error fetching faculty:", error);
      dispatch({
        type: ActionTypes.FETCH_FACULTY_ERROR,
        payload: error.message,
      });
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
  }, [fetchFaculty]);

  // Prepare value object for context provider
  const value = {
    faculty: state.faculty,
    loading: state.loading,
    error: state.error,
    fetchFaculty,
    addFacultyMember,
    updateFacultyMember,
    deleteFacultyMember,
  };

  return (
    <FacultyContext.Provider value={value}>{children}</FacultyContext.Provider>
  );
}
