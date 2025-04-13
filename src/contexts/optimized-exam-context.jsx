import React, { useContext, useEffect, useMemo, useCallback } from "react";
import { examService } from "@/services";
import { createOptimizedContext } from "./optimized-context";

// Define constants for our question types
export const QuestionTypes = {
  MULTIPLE_CHOICE: "multiple-choice",
  TRUE_FALSE: "true-false",
  SHORT_ANSWER: "short-answer",
  CODE: "code",
};

// Initial state
const initialState = {
  exams: [],
  questions: [],
  responses: [],
  submissions: [],
  loading: true,
  error: null,
};

// Reducer function
function examReducer(state, action) {
  switch (action.type) {
    case "FETCH_EXAMS_START":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_EXAMS_SUCCESS":
      return {
        ...state,
        exams: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_EXAMS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "FETCH_QUESTIONS_SUCCESS":
      return {
        ...state,
        questions: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_RESPONSES_SUCCESS":
      return {
        ...state,
        responses: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_SUBMISSIONS_SUCCESS":
      return {
        ...state,
        submissions: action.payload,
        loading: false,
        error: null,
      };
    case "UPDATE_RESPONSE":
      return {
        ...state,
        responses: state.responses.map((response) =>
          response._id === action.payload._id ||
          response.id === action.payload.id
            ? action.payload
            : response
        ),
      };
    default:
      return state;
  }
}

// Define action creators
const actions = {
  fetchExams: () => async (dispatch) => {
    try {
      dispatch({ type: "FETCH_EXAMS_START" });
      const response = await examService.getAllExams();

      if (response.success) {
        dispatch({ type: "FETCH_EXAMS_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "FETCH_EXAMS_ERROR",
          payload: response.error || "Failed to fetch exams",
        });
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      dispatch({
        type: "FETCH_EXAMS_ERROR",
        payload: error.message || "An error occurred while fetching exams",
      });
    }
  },

  fetchQuestions: (examId) => async (dispatch) => {
    try {
      dispatch({ type: "FETCH_EXAMS_START" });
      const response = await examService.getQuestionsForExam(examId);

      if (response.success) {
        dispatch({ type: "FETCH_QUESTIONS_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "FETCH_EXAMS_ERROR",
          payload: response.error || "Failed to fetch questions",
        });
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      dispatch({
        type: "FETCH_EXAMS_ERROR",
        payload: error.message || "An error occurred while fetching questions",
      });
    }
  },

  fetchResponses: (examId) => async (dispatch) => {
    try {
      dispatch({ type: "FETCH_EXAMS_START" });
      const response = await examService.getResponsesForExam(examId);

      if (response.success) {
        dispatch({ type: "FETCH_RESPONSES_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "FETCH_EXAMS_ERROR",
          payload: response.error || "Failed to fetch responses",
        });
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      dispatch({
        type: "FETCH_EXAMS_ERROR",
        payload: error.message || "An error occurred while fetching responses",
      });
    }
  },

  fetchSubmissions: (examId) => async (dispatch) => {
    try {
      dispatch({ type: "FETCH_EXAMS_START" });
      const response = await examService.getSubmissionsForExam(examId);

      if (response.success) {
        dispatch({ type: "FETCH_SUBMISSIONS_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "FETCH_EXAMS_ERROR",
          payload: response.error || "Failed to fetch submissions",
        });
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      dispatch({
        type: "FETCH_EXAMS_ERROR",
        payload: error.message || "An error occurred while fetching submissions",
      });
    }
  },

  updateResponse: (response) => ({
    type: "UPDATE_RESPONSE",
    payload: response,
  }),
};

// Create the optimized context
const {
  Provider: OptimizedExamProvider,
  useStateContext: useExamState,
  useDispatchContext: useExamDispatch,
  useActions: useExamActions,
} = createOptimizedContext({
  initialState,
  reducer: examReducer,
  actions,
});

// Create a wrapper component to handle initialization and provide additional methods
export function ExamProvider({ children }) {
  // Create the enhanced provider component
  const EnhancedProvider = ({ children }) => {
    const { fetchExams } = useExamActions();
    const state = useExamState();

    // Fetch exams on initial mount
    useEffect(() => {
      fetchExams();
    }, [fetchExams]);

    // Helper methods that work with the state
    const getExamById = useCallback(
      (id) => {
        return state.exams.find((exam) => exam._id === id || exam.id === id);
      },
      [state.exams]
    );

    const getQuestionsForExam = useCallback(
      (examId) => {
        return state.questions.filter(
          (question) => question.examId === examId || question.exam === examId
        );
      },
      [state.questions]
    );

    const getSubmissionsForExam = useCallback(
      (examId) => {
        return state.submissions.filter(
          (submission) => submission.examId === examId || submission.exam === examId
        );
      },
      [state.submissions]
    );

    const evaluateResponse = useCallback(
      (responseId, evaluation) => {
        const { updateResponse } = useExamActions();
        const response = state.responses.find(
          (r) => r._id === responseId || r.id === responseId
        );
        
        if (response) {
          const updatedResponse = { ...response, ...evaluation };
          if (
            evaluation.isCorrect !== undefined &&
            response.earnedPoints === undefined
          ) {
            updatedResponse.earnedPoints = evaluation.isCorrect
              ? state.questions.find(
                  (q) =>
                    q._id === response.questionId ||
                    q.id === response.questionId ||
                    q._id === response.question ||
                    q.id === response.question
                )?.points || 0
              : 0;
          }
          updateResponse(updatedResponse);
        }
      },
      [state.responses, state.questions, useExamActions]
    );

    const calculateExamStatistics = useCallback(
      (examId) => {
        const submissions = getSubmissionsForExam(examId);
        const totalSubmissions = submissions.length;

        if (totalSubmissions === 0) {
          return {
            examId,
            totalSubmissions: 0,
            averageScore: 0,
            passRate: 0,
            averageTimeSpent: 0,
            questionStatistics: [],
          };
        }

        const exam = getExamById(examId);
        const passingScore = exam?.settings?.passingScore || 70;

        let totalScore = 0;
        let totalPassed = 0;
        let totalTimeSpent = 0;

        for (const submission of submissions) {
          if (submission.score !== undefined) {
            totalScore += submission.score;
            if (submission.score >= passingScore) {
              totalPassed++;
            }
          }
          totalTimeSpent += submission.timeSpent;
        }

        const averageScore = totalScore / totalSubmissions;
        const passRate = (totalPassed / totalSubmissions) * 100;
        const averageTimeSpent = totalTimeSpent / totalSubmissions;

        // Calculate statistics for each question
        const questions = getQuestionsForExam(examId);
        const questionStatistics = questions.map((question) =>
          calculateQuestionStatistics(question.id)
        );

        return {
          examId,
          totalSubmissions,
          averageScore,
          passRate,
          averageTimeSpent,
          questionStatistics,
        };
      },
      [getSubmissionsForExam, getExamById, getQuestionsForExam]
    );

    const calculateQuestionStatistics = useCallback(
      (questionId) => {
        const responses = state.responses.filter(
          (response) => response.questionId === questionId
        );
        const totalResponses = responses.length;

        if (totalResponses === 0) {
          return {
            questionId,
            totalResponses: 0,
            correctResponses: 0,
            incorrectResponses: 0,
            averageScore: 0,
            averageTimeSpent: 0,
            averageConfidence: 0,
            difficultyRating: 0,
          };
        }

        let correctResponses = 0;
        let totalScore = 0;
        let totalTimeSpent = 0;
        let totalConfidence = 0;

        for (const response of responses) {
          if (response.isCorrect) {
            correctResponses++;
          }
          if (response.earnedPoints !== undefined) {
            totalScore += response.earnedPoints;
          }
          totalTimeSpent += response.timeSpent;
          if (response.confidenceLevel !== undefined) {
            totalConfidence += response.confidenceLevel;
          }
        }

        const incorrectResponses = totalResponses - correctResponses;
        const averageScore = totalScore / totalResponses;
        const averageTimeSpent = totalTimeSpent / totalResponses;
        const averageConfidence =
          totalConfidence /
            responses.filter((r) => r.confidenceLevel !== undefined).length || 0;

        // Calculate difficulty rating (higher means more difficult)
        const difficultyRating = 100 - (correctResponses / totalResponses) * 100;

        return {
          questionId,
          totalResponses,
          correctResponses,
          incorrectResponses,
          averageScore,
          averageTimeSpent,
          averageConfidence,
          difficultyRating,
        };
      },
      [state.responses]
    );

    // Create a context value with additional methods
    const additionalMethods = useMemo(
      () => ({
        getExamById,
        getQuestionsForExam,
        getSubmissionsForExam,
        evaluateResponse,
        calculateExamStatistics,
        calculateQuestionStatistics,
      }),
      [
        getExamById,
        getQuestionsForExam,
        getSubmissionsForExam,
        evaluateResponse,
        calculateExamStatistics,
        calculateQuestionStatistics,
      ]
    );

    // Create a context for the additional methods
    const AdditionalMethodsContext = React.createContext(null);

    return (
      <AdditionalMethodsContext.Provider value={additionalMethods}>
        {children}
      </AdditionalMethodsContext.Provider>
    );
  };

  // Memoize the provider to prevent unnecessary re-renders
  const MemoizedProvider = useMemo(() => {
    return (
      <OptimizedExamProvider>
        <EnhancedProvider>{children}</EnhancedProvider>
      </OptimizedExamProvider>
    );
  }, [children]);

  return MemoizedProvider;
}

// Create a hook to use the exam context
export function useExamContext() {
  const state = useExamState();
  const actions = useExamActions();
  const dispatch = useExamDispatch();
  
  // Get additional methods from context
  const AdditionalMethodsContext = React.createContext(null);
  const additionalMethods = useContext(AdditionalMethodsContext);
  
  if (!additionalMethods) {
    throw new Error("useExamContext must be used within an ExamProvider");
  }
  
  // Combine state, actions, dispatch, and additional methods
  return {
    ...state,
    ...actions,
    dispatch,
    ...additionalMethods,
  };
}
