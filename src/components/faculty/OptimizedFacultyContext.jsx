import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from "react";
import apiClient from "../../services/api";

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

  // Fetch faculty data on mount
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        dispatch({ type: ActionTypes.FETCH_FACULTY_START });
        const response = await apiClient.get("/faculty");
        dispatch({
          type: ActionTypes.FETCH_FACULTY_SUCCESS,
          payload: response.data,
        });
      } catch (error) {
        console.error("Error fetching faculty:", error);
        dispatch({
          type: ActionTypes.FETCH_FACULTY_ERROR,
          payload: error.message || "Failed to fetch faculty",
        });
      }
    };

    fetchFaculty();
  }, []);

  // Action creators
  const addFacultyMember = useCallback(async (facultyData) => {
    try {
      const response = await apiClient.post("/faculty", facultyData);
      dispatch({
        type: ActionTypes.ADD_FACULTY_MEMBER,
        payload: response.data,
      });
      return { success: true, data: response.data };
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
      const response = await apiClient.put(`/faculty/${id}`, facultyData);
      dispatch({
        type: ActionTypes.UPDATE_FACULTY_MEMBER,
        payload: response.data,
      });
      return { success: true, data: response.data };
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
      await apiClient.delete(`/faculty/${id}`);
      dispatch({
        type: ActionTypes.DELETE_FACULTY_MEMBER,
        payload: id,
      });
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

  // Memoize the actions value to prevent unnecessary re-renders
  const actionsValue = useMemo(
    () => ({
      addFacultyMember,
      updateFacultyMember,
      deleteFacultyMember,
    }),
    [addFacultyMember, updateFacultyMember, deleteFacultyMember]
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
