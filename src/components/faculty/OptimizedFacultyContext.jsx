import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import enhancedApiClient from "../../services/enhancedApi";
import { loadEndpoint, clearEndpointCache } from "../../services/apiManager";

// Action types
export const ActionTypes = {
  FETCH_FACULTY_START: "FETCH_FACULTY_START",
  FETCH_FACULTY_SUCCESS: "FETCH_FACULTY_SUCCESS",
  FETCH_FACULTY_ERROR: "FETCH_FACULTY_ERROR",
  ADD_FACULTY_MEMBER: "ADD_FACULTY_MEMBER",
  UPDATE_FACULTY_MEMBER: "UPDATE_FACULTY_MEMBER",
  DELETE_FACULTY_MEMBER: "DELETE_FACULTY_MEMBER",
};

// Initial state
const initialState = {
  faculty: [],
  loading: false,
  error: null,
};

// Reducer function
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

// Create separate contexts for state and actions
const FacultyStateContext = createContext(null);
const FacultyActionsContext = createContext(null);

// Faculty provider component
export function FacultyProvider({ children }) {
  const [state, dispatch] = useReducer(facultyReducer, initialState);

  // Track if initial fetch has been done
  const initialFetchDone = useRef(false);

  // Define fetchFaculty as a callback so it can be used in useEffect and exposed in context
  const fetchFaculty = useCallback(async (useCache = true) => {
    try {
      // Only show loading state if we don't have cached data
      dispatch({ type: ActionTypes.FETCH_FACULTY_START });

      // Use API Manager to load faculty data
      // This prevents duplicate requests and implements throttling
      const response = await loadEndpoint("/faculty", !useCache);

      // Check if response has the expected structure
      const facultyData = response?.data?.data || response?.data || [];

      dispatch({
        type: ActionTypes.FETCH_FACULTY_SUCCESS,
        payload: facultyData,
      });

      return { success: true, data: facultyData };
    } catch (error) {
      console.error("Error fetching faculty:", error);
      dispatch({
        type: ActionTypes.FETCH_FACULTY_ERROR,
        payload: error.message || "Failed to fetch faculty",
      });

      return {
        success: false,
        error: error.message || "Failed to fetch faculty",
      };
    }
  }, []);

  // Fetch faculty data on mount with delay
  useEffect(() => {
    // Only fetch on initial mount, not on every rerender
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;

      // Use a longer delay to ensure API Manager has initialized
      setTimeout(() => {
        // This will either use cached data from API Manager or trigger a new request
        // but with proper throttling and deduplication
        fetchFaculty(true);
      }, 2000);
    }
  }, [fetchFaculty]);

  // Action creators
  const addFacultyMember = useCallback(async (facultyData) => {
    try {
      const response = await enhancedApiClient.post("/faculty", facultyData);

      // Check if response has the expected structure
      const newFaculty = response?.data?.data || response?.data;

      dispatch({
        type: ActionTypes.ADD_FACULTY_MEMBER,
        payload: newFaculty,
      });

      // Clear the faculty cache to ensure fresh data on next fetch
      clearEndpointCache("/faculty");

      return { success: true, data: newFaculty };
    } catch (error) {
      console.error("Error adding faculty member:", error);
      return {
        success: false,
        error: error.message || "Failed to add faculty member",
      };
    }
  }, []);

  const updateFacultyMember = useCallback(async (id, facultyData) => {
    try {
      const response = await enhancedApiClient.put(
        `/faculty/${id}`,
        facultyData
      );

      // Check if response has the expected structure
      const updatedFaculty = response?.data?.data || response?.data;

      dispatch({
        type: ActionTypes.UPDATE_FACULTY_MEMBER,
        payload: updatedFaculty,
      });

      // Clear the faculty cache to ensure fresh data on next fetch
      clearEndpointCache("/faculty");

      return { success: true, data: updatedFaculty };
    } catch (error) {
      console.error("Error updating faculty member:", error);
      return {
        success: false,
        error: error.message || "Failed to update faculty member",
      };
    }
  }, []);

  const deleteFacultyMember = useCallback(async (id) => {
    try {
      await enhancedApiClient.delete(`/faculty/${id}`);
      dispatch({
        type: ActionTypes.DELETE_FACULTY_MEMBER,
        payload: id,
      });

      // Clear the faculty cache to ensure fresh data on next fetch
      clearEndpointCache("/faculty");

      return { success: true };
    } catch (error) {
      console.error("Error deleting faculty member:", error);
      return {
        success: false,
        error: error.message || "Failed to delete faculty member",
      };
    }
  }, []);

  // Memoize the state value to prevent unnecessary re-renders
  const stateValue = useMemo(() => state, [state]);

  // Function to refresh faculty data (just a wrapper around fetchFaculty with cache cleared)
  const refreshFaculty = useCallback(async () => {
    // Clear the cache first to ensure we get fresh data
    clearEndpointCache("/faculty");
    return fetchFaculty(false); // Don't use cache for refresh
  }, [fetchFaculty]);

  // Memoize the actions value to prevent unnecessary re-renders
  const actionsValue = useMemo(
    () => ({
      addFacultyMember,
      updateFacultyMember,
      deleteFacultyMember,
      fetchFaculty, // Expose the fetch function
      refreshFaculty, // Convenience method to refresh with cache cleared
    }),
    [
      addFacultyMember,
      updateFacultyMember,
      deleteFacultyMember,
      fetchFaculty,
      refreshFaculty,
    ]
  );

  return (
    <FacultyStateContext.Provider value={stateValue}>
      <FacultyActionsContext.Provider value={actionsValue}>
        {children}
      </FacultyActionsContext.Provider>
    </FacultyStateContext.Provider>
  );
}

// Custom hooks to use faculty context
export const useFacultyState = () => {
  const context = useContext(FacultyStateContext);
  if (context === undefined) {
    throw new Error("useFacultyState must be used within a FacultyProvider");
  }
  return context;
};

export const useFacultyActions = () => {
  const context = useContext(FacultyActionsContext);
  if (context === undefined) {
    throw new Error("useFacultyActions must be used within a FacultyProvider");
  }
  return context;
};

// Combined hook for backward compatibility
export const useFaculty = () => {
  const state = useFacultyState();
  const actions = useFacultyActions();
  return { ...state, ...actions };
};
