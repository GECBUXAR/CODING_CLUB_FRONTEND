import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
// Import the exam service for API calls
import examService from "../services/examService";
import { useNotification } from "./notification-context";

// Create context
const ResponseEvaluationContext = createContext(null);

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

  const { success, error } = useNotification();

  // Use a ref to store exam IDs that have already been fetched
  const fetchedExamIds = useRef(new Set());

  // Fetch all exam responses
  const fetchExamResponses = useCallback(
    async (examId) => {
      // Skip if no examId provided
      if (!examId) {
        return [];
      }

      // This helps prevent duplicate fetches
      const fetchKey = `${examId}-${Date.now()}`;
      if (fetchedExamIds.current.has(fetchKey)) {
        return Object.values(examResponses[examId] || {});
      }

      try {
        setLoading(true);
        setFetchError(null);
        fetchedExamIds.current.add(fetchKey);

        // Use our enhanced API that handles offline mode
        const result = await examService.getExamResponses(examId);

        if (result?.success) {
          // Normalize and store responses by ID for efficient access
          const normalizedResponses = {};
          for (const resp of result.data || []) {
            normalizedResponses[resp.id] = resp;
          }

          setExamResponses((prev) => ({
            ...prev,
            [examId]: normalizedResponses,
          }));

          if (result.usingFallbackData) {
            console.log("Using sample exam responses data for development");
          }

          return result.data || [];
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

  // Fetch specific response details - use useCallback to create a stable function reference
  const fetchResponseDetails = useCallback(
    async (examId, responseId) => {
      if (!examId || !responseId) return null;

      try {
        setLoading(true);
        const result = await examService.getExamResponseById(responseId);

        if (result?.success) {
          // Update the specific response in our store
          setExamResponses((prev) => ({
            ...prev,
            [examId]: {
              ...(prev[examId] || {}),
              [responseId]: result.data,
            },
          }));

          return result.data;
        }

        throw new Error(result?.error || "Failed to fetch response details");
      } catch (err) {
        console.error("Error fetching response details:", err);
        // Use setTimeout to avoid dependency changes triggering re-renders
        setTimeout(() => {
          error(`Failed to fetch response details: ${err.message}`);
        }, 0);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  // Fetch evaluation criteria for a question
  const fetchEvaluationCriteria = useCallback(
    async (examId, questionId) => {
      if (!examId || !questionId) return [];

      try {
        setLoading(true);
        // This function would need to be properly implemented in the API
        // For now, we're simulating criteria data

        // Mock criteria for development
        const mockCriteria = [
          {
            id: 1,
            description: "Correct understanding of concepts",
            maxScore: 5,
          },
          { id: 2, description: "Clear explanation", maxScore: 3 },
          { id: 3, description: "Proper examples provided", maxScore: 2 },
        ];

        // Store criteria by question ID
        setEvaluationCriteria((prev) => ({
          ...prev,
          [`${examId}-${questionId}`]: mockCriteria,
        }));

        return mockCriteria;
      } catch (err) {
        console.error("Error fetching evaluation criteria:", err);
        // Use setTimeout to avoid dependency changes triggering re-renders
        setTimeout(() => {
          error(`Failed to fetch evaluation criteria: ${err.message}`);
        }, 0);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  // Submit evaluation for a response
  const submitEvaluation = useCallback(
    async (examId, responseId, questionId, evaluationData) => {
      if (!examId || !responseId || !questionId) return null;

      try {
        setLoading(true);
        const result = await examService.evaluateAnswer(
          examId,
          responseId,
          questionId,
          evaluationData
        );

        if (result?.success) {
          // Update evaluations store
          setEvaluations((prev) => ({
            ...prev,
            [`${examId}-${responseId}-${questionId}`]: result.data,
          }));

          // Update the response in our store to reflect the new evaluation
          setExamResponses((prev) => {
            const examResponses = prev[examId] || {};
            const responseData = examResponses[responseId] || {};
            const questions = responseData.questions || [];

            // Find and update the evaluated question
            const updatedQuestions = questions.map((q) =>
              q.id === questionId ? { ...q, evaluation: result.data } : q
            );

            return {
              ...prev,
              [examId]: {
                ...examResponses,
                [responseId]: {
                  ...responseData,
                  questions: updatedQuestions,
                },
              },
            };
          });

          success("Evaluation submitted successfully");
          return result.data;
        }

        throw new Error(result?.error || "Failed to submit evaluation");
      } catch (err) {
        console.error("Error submitting evaluation:", err);
        // Use setTimeout to avoid dependency changes triggering re-renders
        setTimeout(() => {
          error(`Failed to submit evaluation: ${err.message}`);
        }, 0);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [error, success]
  );

  // Get evaluations for a response
  const getResponseEvaluations = useCallback(
    async (examId, responseId) => {
      if (!examId || !responseId) return {};

      try {
        setLoading(true);

        // Get the response data which should contain evaluations
        const result = await examService.getExamResponses(examId);
        const response = result?.data?.find((r) => r.id === responseId);

        if (!response) {
          throw new Error("Response not found");
        }

        // Extract evaluations from questions
        const evaluationsByQuestion = {};
        if (response.questions) {
          for (const question of response.questions) {
            if (question.evaluation) {
              evaluationsByQuestion[question.id] = question.evaluation;
            }
          }
        }

        // Store in our evaluations state
        const evaluationKey = `${examId}-${responseId}`;
        setEvaluations((prev) => ({
          ...prev,
          [evaluationKey]: evaluationsByQuestion,
        }));

        return evaluationsByQuestion;
      } catch (err) {
        console.error("Error fetching evaluations:", err);
        // Use setTimeout to avoid dependency changes triggering re-renders
        setTimeout(() => {
          error(`Failed to fetch evaluations: ${err.message}`);
        }, 0);
        return {};
      } finally {
        setLoading(false);
      }
    },
    [error]
  );

  // Set active entities for UI state
  const setActiveEntities = (examId, responseId, questionId = null) => {
    setActiveExamId(examId);
    setActiveResponseId(responseId);
    setActiveQuestionId(questionId);
  };

  // Get a specific response
  const getResponse = (examId, responseId) => {
    return examResponses[examId]?.[responseId] || null;
  };

  // Get evaluation for a specific question response
  const getEvaluation = (examId, responseId, questionId) => {
    return (
      evaluations[`${examId}-${responseId}-${questionId}`] ||
      evaluations[`${examId}-${responseId}`]?.[questionId] ||
      null
    );
  };

  // Get criteria for a specific question
  const getCriteria = (examId, questionId) => {
    return evaluationCriteria[`${examId}-${questionId}`] || null;
  };

  // Rename this function to avoid conflict with the imported function
  const getLocalExamResponses = (examId) => {
    return examResponses[examId] || [];
  };

  // Compute statistics for an exam
  const computeExamStatistics = (examId) => {
    const responses = Object.values(examResponses[examId] || {});
    if (responses.length === 0) return null;

    const stats = {
      totalResponses: responses.length,
      evaluatedResponses: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: Number.POSITIVE_INFINITY,
      questionStats: {},
    };

    let totalScoreSum = 0;
    let evaluatedCount = 0;

    for (const response of responses) {
      if (response.status === "evaluated") {
        stats.evaluatedResponses++;

        if (response.totalScore !== undefined) {
          evaluatedCount++;
          totalScoreSum += response.totalScore;
          stats.highestScore = Math.max(
            stats.highestScore,
            response.totalScore
          );
          stats.lowestScore = Math.min(stats.lowestScore, response.totalScore);

          // Process question-level statistics
          if (response.questions) {
            for (const question of response.questions) {
              if (!stats.questionStats[question.id]) {
                stats.questionStats[question.id] = {
                  averageScore: 0,
                  totalEvaluated: 0,
                  scoreSum: 0,
                };
              }

              if (question.evaluation) {
                stats.questionStats[question.id].totalEvaluated++;
                stats.questionStats[question.id].scoreSum +=
                  question.evaluation.score;
              }
            }
          }
        }
      }
    }

    // Calculate averages
    if (evaluatedCount > 0) {
      stats.averageScore = totalScoreSum / evaluatedCount;

      // Calculate question averages
      for (const questionId of Object.keys(stats.questionStats)) {
        const qStat = stats.questionStats[questionId];
        if (qStat.totalEvaluated > 0) {
          qStat.averageScore = qStat.scoreSum / qStat.totalEvaluated;
        }
      }
    }

    if (stats.lowestScore === Number.POSITIVE_INFINITY) {
      stats.lowestScore = 0;
    }

    return stats;
  };

  const contextValue = {
    // State
    loading,
    fetchError,
    activeExamId,
    activeResponseId,
    activeQuestionId,

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
  };

  return (
    <ResponseEvaluationContext.Provider value={contextValue}>
      {children}
    </ResponseEvaluationContext.Provider>
  );
};

// Custom hook to use the response evaluation context
export const useResponseEvaluation = () => {
  const context = useContext(ResponseEvaluationContext);
  if (!context) {
    throw new Error(
      "useResponseEvaluation must be used within a ResponseEvaluationProvider"
    );
  }
  return context;
};

export default ResponseEvaluationContext;
