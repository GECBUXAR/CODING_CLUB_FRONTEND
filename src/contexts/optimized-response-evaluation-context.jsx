import React, { createContext, useContext, useState, useCallback, useRef, useMemo } from "react";
import examService from "../services/examService";
import { useNotification } from "./optimized-notification-context";

// Create separate contexts for state and actions
const ResponseEvaluationStateContext = createContext(null);
const ResponseEvaluationActionsContext = createContext(null);

/**
 * Provider component for response evaluation data management
 */
export const ResponseEvaluationProvider = ({ children }) => {
  // State for all responses data
  const [examResponses, setExamResponses] = useState({});
  const [evaluationCriteria, setEvaluationCriteria] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [activeExamId, setActiveExamId] = useState(null);
  const [activeResponseId, setActiveResponseId] = useState(null);
  const [activeQuestionId, setActiveQuestionId] = useState(null);

  // Use notification context for success/error messages
  const { success, error } = useNotification();

  // Track which exams we've already fetched to avoid duplicate requests
  const fetchedExamIds = useRef(new Set());

  // Helper function to get a response by ID
  const getResponse = useCallback(
    (responseId) => {
      // Look through all exam responses to find the matching response
      for (const examId in examResponses) {
        const responses = examResponses[examId] || [];
        const response = responses.find(
          (r) => r._id === responseId || r.id === responseId
        );
        if (response) return response;
      }
      return null;
    },
    [examResponses]
  );

  // Helper function to get all responses for an exam
  const getLocalExamResponses = useCallback(
    (examId) => {
      return examResponses[examId] || [];
    },
    [examResponses]
  );

  // Helper function to get evaluation for a response
  const getEvaluation = useCallback(
    (responseId) => {
      return evaluations[responseId] || null;
    },
    [evaluations]
  );

  // Helper function to get criteria for an exam
  const getCriteria = useCallback(
    (examId) => {
      return evaluationCriteria[examId] || null;
    },
    [evaluationCriteria]
  );

  // Fetch responses for an exam
  const fetchExamResponses = useCallback(
    async (examId) => {
      if (!examId) return [];

      // Create a unique key for this fetch operation
      const fetchKey = `exam_${examId}_${Date.now()}`;

      // Check if we're already fetching this exam's responses
      if (fetchedExamIds.current.has(fetchKey)) {
        return examResponses[examId] || [];
      }

      // Mark that we're fetching this exam's responses
      fetchedExamIds.current.add(fetchKey);

      try {
        setLoading(true);
        setFetchError(null);

        const result = await examService.getExamResponses(examId);

        if (result.success) {
          // Update the responses for this exam
          setExamResponses((prev) => ({
            ...prev,
            [examId]: result.data,
          }));

          return result.data;
        }

        throw new Error(result?.error || "Failed to fetch exam responses");
      } catch (err) {
        console.error("Error fetching exam responses:", err);
        setFetchError(err.message || "Unknown error");

        // Only show the error notification once per session to avoid loops
        if (!examResponses[examId]) {
          // Use a stable version of error that won't trigger dependency changes
          setTimeout(() => {
            error(`Failed to fetch exam responses: ${err.message}`);
          }, 0);
        }

        return [];
      } finally {
        setLoading(false);

        // Remove the fetch key after a delay
        setTimeout(() => {
          fetchedExamIds.current.delete(fetchKey);
        }, 5000);
      }
    },
    [examResponses, error]
  );

  // Fetch details for a specific response
  const fetchResponseDetails = useCallback(
    async (responseId) => {
      if (!responseId) return null;

      try {
        setLoading(true);
        setFetchError(null);

        const result = await examService.getResponseDetails(responseId);

        if (result.success) {
          // Find which exam this response belongs to
          const examId = result.data.examId || result.data.exam;

          // Update the responses for this exam
          setExamResponses((prev) => {
            const examResponses = prev[examId] || [];
            const existingIndex = examResponses.findIndex(
              (r) => r._id === responseId || r.id === responseId
            );

            if (existingIndex >= 0) {
              // Update existing response
              const updatedResponses = [...examResponses];
              updatedResponses[existingIndex] = result.data;
              return {
                ...prev,
                [examId]: updatedResponses,
              };
            } else {
              // Add new response
              return {
                ...prev,
                [examId]: [...examResponses, result.data],
              };
            }
          });

          return result.data;
        }

        throw new Error(result?.error || "Failed to fetch response details");
      } catch (err) {
        console.error("Error fetching response details:", err);
        setFetchError(err.message || "Unknown error");
        error(`Failed to fetch response details: ${err.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  // Fetch evaluation criteria for an exam
  const fetchEvaluationCriteria = useCallback(
    async (examId) => {
      if (!examId) return null;

      // If we already have criteria for this exam, return it
      if (evaluationCriteria[examId]) {
        return evaluationCriteria[examId];
      }

      try {
        setLoading(true);
        setFetchError(null);

        const result = await examService.getEvaluationCriteria(examId);

        if (result.success) {
          // Update the criteria for this exam
          setEvaluationCriteria((prev) => ({
            ...prev,
            [examId]: result.data,
          }));

          return result.data;
        }

        throw new Error(
          result?.error || "Failed to fetch evaluation criteria"
        );
      } catch (err) {
        console.error("Error fetching evaluation criteria:", err);
        setFetchError(err.message || "Unknown error");
        error(`Failed to fetch evaluation criteria: ${err.message}`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [evaluationCriteria, error]
  );

  // Submit an evaluation for a response
  const submitEvaluation = useCallback(
    async (responseId, evaluationData) => {
      if (!responseId || !evaluationData) {
        error("Missing response ID or evaluation data");
        return false;
      }

      try {
        setLoading(true);
        setFetchError(null);

        const result = await examService.submitEvaluation(
          responseId,
          evaluationData
        );

        if (result.success) {
          // Update the evaluations
          setEvaluations((prev) => ({
            ...prev,
            [responseId]: {
              ...evaluationData,
              submittedAt: new Date().toISOString(),
            },
          }));

          // Update the response status
          const response = getResponse(responseId);
          if (response) {
            const examId = response.examId || response.exam;
            setExamResponses((prev) => {
              const examResponses = prev[examId] || [];
              const updatedResponses = examResponses.map((r) => {
                if (r._id === responseId || r.id === responseId) {
                  return {
                    ...r,
                    status: "evaluated",
                    evaluation: evaluationData,
                  };
                }
                return r;
              });

              return {
                ...prev,
                [examId]: updatedResponses,
              };
            });
          }

          success("Evaluation submitted successfully");
          return true;
        }

        throw new Error(result?.error || "Failed to submit evaluation");
      } catch (err) {
        console.error("Error submitting evaluation:", err);
        setFetchError(err.message || "Unknown error");
        error(`Failed to submit evaluation: ${err.message}`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getResponse, success, error]
  );

  // Get all evaluations for a response
  const getResponseEvaluations = useCallback(
    async (responseId) => {
      if (!responseId) return [];

      try {
        setLoading(true);
        setFetchError(null);

        const result = await examService.getResponseEvaluations(responseId);

        if (result.success) {
          // Update the evaluations for this response
          if (result.data && result.data.length > 0) {
            const latestEvaluation = result.data[0]; // Assuming sorted by date
            setEvaluations((prev) => ({
              ...prev,
              [responseId]: latestEvaluation,
            }));
          }

          return result.data || [];
        }

        throw new Error(
          result?.error || "Failed to fetch response evaluations"
        );
      } catch (err) {
        console.error("Error fetching response evaluations:", err);
        setFetchError(err.message || "Unknown error");
        error(`Failed to fetch response evaluations: ${err.message}`);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  // Set active entities (exam, response, question)
  const setActiveEntities = useCallback(
    (examId, responseId, questionId) => {
      setActiveExamId(examId);
      setActiveResponseId(responseId);
      setActiveQuestionId(questionId);
    },
    []
  );

  // Compute statistics for an exam
  const computeExamStatistics = useCallback(
    (examId) => {
      const responses = getLocalExamResponses(examId);
      if (!responses || responses.length === 0) {
        return {
          totalResponses: 0,
          evaluatedResponses: 0,
          pendingResponses: 0,
          averageScore: 0,
        };
      }

      const totalResponses = responses.length;
      const evaluatedResponses = responses.filter(
        (r) => r.status === "evaluated"
      ).length;
      const pendingResponses = totalResponses - evaluatedResponses;

      // Calculate average score for evaluated responses
      let totalScore = 0;
      let scoredResponses = 0;

      responses.forEach((response) => {
        if (
          response.status === "evaluated" &&
          response.score !== undefined &&
          response.score !== null
        ) {
          totalScore += response.score;
          scoredResponses++;
        }
      });

      const averageScore =
        scoredResponses > 0 ? totalScore / scoredResponses : 0;

      return {
        totalResponses,
        evaluatedResponses,
        pendingResponses,
        averageScore,
      };
    },
    [getLocalExamResponses]
  );

  // Memoize the state value to prevent unnecessary re-renders
  const stateValue = useMemo(
    () => ({
      loading,
      fetchError,
      activeExamId,
      activeResponseId,
      activeQuestionId,
    }),
    [loading, fetchError, activeExamId, activeResponseId, activeQuestionId]
  );

  // Memoize the actions value to prevent unnecessary re-renders
  const actionsValue = useMemo(
    () => ({
      // Data access methods
      getResponse,
      getLocalExamResponses,
      getEvaluation,
      getCriteria,
      computeExamStatistics,

      // Actions
      fetchExamResponses,
      fetchResponseDetails,
      fetchEvaluationCriteria,
      submitEvaluation,
      getResponseEvaluations,
      setActiveEntities,
    }),
    [
      getResponse,
      getLocalExamResponses,
      getEvaluation,
      getCriteria,
      computeExamStatistics,
      fetchExamResponses,
      fetchResponseDetails,
      fetchEvaluationCriteria,
      submitEvaluation,
      getResponseEvaluations,
      setActiveEntities,
    ]
  );

  return (
    <ResponseEvaluationStateContext.Provider value={stateValue}>
      <ResponseEvaluationActionsContext.Provider value={actionsValue}>
        {children}
      </ResponseEvaluationActionsContext.Provider>
    </ResponseEvaluationStateContext.Provider>
  );
};

// Custom hooks to use the response evaluation context
export const useResponseEvaluationState = () => {
  const context = useContext(ResponseEvaluationStateContext);
  if (!context) {
    throw new Error(
      "useResponseEvaluationState must be used within a ResponseEvaluationProvider"
    );
  }
  return context;
};

export const useResponseEvaluationActions = () => {
  const context = useContext(ResponseEvaluationActionsContext);
  if (!context) {
    throw new Error(
      "useResponseEvaluationActions must be used within a ResponseEvaluationProvider"
    );
  }
  return context;
};

// Combined hook for backward compatibility
export const useResponseEvaluation = () => {
  const state = useResponseEvaluationState();
  const actions = useResponseEvaluationActions();
  return { ...state, ...actions };
};
