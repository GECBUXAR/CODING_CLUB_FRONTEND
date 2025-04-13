import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

/**
 * Creates an optimized context provider with memoized state and actions
 * This pattern helps prevent unnecessary re-renders by:
 * 1. Splitting state and dispatch into separate contexts
 * 2. Memoizing action creators
 * 3. Using useMemo for derived state
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.initialState - Initial state object
 * @param {Function} options.reducer - Reducer function (state, action) => newState
 * @param {Object} options.actions - Object with action creator functions
 * @returns {Object} Context provider and hooks
 */
export function createOptimizedContext(options) {
  const {
    initialState,
    reducer,
    actions = {},
  } = options;

  // Create separate contexts for state and dispatch
  const StateContext = createContext(initialState);
  const DispatchContext = createContext(null);

  // Provider component
  const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Memoize the dispatch function to avoid unnecessary re-renders
    const memoizedDispatch = useMemo(() => dispatch, []);

    // Create memoized action creators
    const memoizedActions = useMemo(() => {
      const actionCreators = {};
      
      // Convert each action creator to use the memoized dispatch
      Object.entries(actions).forEach(([key, actionCreator]) => {
        actionCreators[key] = (...args) => {
          const action = actionCreator(...args);
          if (typeof action === 'function') {
            // Handle thunk actions
            return action(dispatch, () => state);
          } else {
            // Handle regular actions
            return dispatch(action);
          }
        };
      });
      
      return actionCreators;
    }, [state, memoizedDispatch]);

    // Memoize the combined value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
      ...state,
      ...memoizedActions
    }), [state, memoizedActions]);

    return (
      <DispatchContext.Provider value={memoizedDispatch}>
        <StateContext.Provider value={contextValue}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  // Custom hooks to access the context
  const useStateContext = () => useContext(StateContext);
  const useDispatchContext = () => useContext(DispatchContext);

  // Create a selector hook for optimized state access
  const useSelector = (selector) => {
    const state = useStateContext();
    return selector(state);
  };

  // Create an action hook for dispatching actions
  const useActions = () => {
    const state = useStateContext();
    const dispatch = useDispatchContext();

    // Return only the action creators
    return useMemo(() => {
      const actionCreators = {};
      Object.keys(actions).forEach(key => {
        actionCreators[key] = state[key];
      });
      return actionCreators;
    }, [state]);
  };

  return {
    Provider,
    useStateContext,
    useDispatchContext,
    useSelector,
    useActions
  };
}

/**
 * Creates a memoized selector that only recalculates when its dependencies change
 * 
 * @param {Function} selector - Function that takes state and returns a derived value
 * @param {Array} dependencies - Array of dependencies that trigger recalculation
 * @returns {Function} Memoized selector function
 */
export function createSelector(selector, dependencies = []) {
  return (state) => {
    // Use useMemo to memoize the result
    return useMemo(() => selector(state), [state, ...dependencies]);
  };
}

/**
 * Creates a memoized action creator that only recreates when its dependencies change
 * 
 * @param {Function} actionCreator - Function that creates an action
 * @param {Array} dependencies - Array of dependencies that trigger recreation
 * @returns {Function} Memoized action creator
 */
export function createAction(actionCreator, dependencies = []) {
  return (...args) => {
    // Use useCallback to memoize the action creator
    return useCallback((...callArgs) => {
      return actionCreator(...callArgs, ...args);
    }, dependencies);
  };
}
