import { createContext, useContext, useReducer, useEffect } from "react";
import { examService } from "@/services";

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
  loading: true,
  error: null,
};

// Create the reducer
function examReducer(state, action) {
  switch (action.type) {
    case "FETCH_EXAMS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_EXAMS_SUCCESS":
      return { ...state, exams: action.payload, loading: false, error: null };
    case "FETCH_EXAMS_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_EXAMS":
      return { ...state, exams: action.payload };
    case "ADD_EXAM":
      return { ...state, exams: [...state.exams, action.payload] };
    case "UPDATE_EXAM":
      return {
        ...state,
        exams: state.exams.map((exam) =>
          exam._id === action.payload.id || exam.id === action.payload.id
            ? action.payload
            : exam
        ),
      };
    case "DELETE_EXAM":
      return {
        ...state,
        exams: state.exams.filter(
          (exam) => exam._id !== action.payload && exam.id !== action.payload
        ),
      };
    case "SET_QUESTIONS":
      return { ...state, questions: action.payload };
    case "ADD_QUESTION":
      return { ...state, questions: [...state.questions, action.payload] };
    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((question) =>
          question._id === action.payload.id ||
          question.id === action.payload.id
            ? action.payload
            : question
        ),
      };
    case "DELETE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter(
          (question) =>
            question._id !== action.payload && question.id !== action.payload
        ),
      };
    case "SET_SUBMISSIONS":
      return { ...state, submissions: action.payload };
    case "ADD_SUBMISSION":
      return { ...state, submissions: [...state.submissions, action.payload] };
    case "UPDATE_SUBMISSION":
      return {
        ...state,
        submissions: state.submissions.map((submission) =>
          submission._id === action.payload.id ||
          submission.id === action.payload.id
            ? action.payload
            : submission
        ),
      };
    case "SET_RESPONSES":
      return { ...state, responses: action.payload };
    case "ADD_RESPONSE":
      return { ...state, responses: [...state.responses, action.payload] };
    case "UPDATE_RESPONSE":
      return {
        ...state,
        responses: state.responses.map((response) =>
          response._id === action.payload.id ||
          response.id === action.payload.id
            ? action.payload
            : response
        ),
      };
    default:
      return state;
  }
}

// Create the context
const ExamContext = createContext(null);

// Create a hook to use the context
export function useExamContext() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error("useExamContext must be used within an ExamProvider");
  }
  return context;
}

// Create the provider component
export function ExamProvider({ children }) {
  const [state, dispatch] = useReducer(examReducer, initialState);

  // Fetch exams from the backend when the provider mounts
  useEffect(() => {
    const fetchExams = async () => {
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
    };

    fetchExams();
  }, []);

  const getExamById = (id) => {
    return state.exams.find((exam) => exam._id === id || exam.id === id);
  };

  const getQuestionsForExam = (examId) => {
    return state.questions.filter(
      (question) => question.examId === examId || question.exam === examId
    );
  };

  const getSubmissionsForExam = (examId) => {
    return state.submissions.filter(
      (submission) => submission.examId === examId || submission.exam === examId
    );
  };

  const evaluateResponse = (responseId, evaluation) => {
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
      dispatch({ type: "UPDATE_RESPONSE", payload: updatedResponse });
    }
  };

  const calculateExamStatistics = (examId) => {
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
  };

  const calculateQuestionStatistics = (questionId) => {
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
  };

  const value = {
    state,
    dispatch,
    getExamById,
    getQuestionsForExam,
    getSubmissionsForExam,
    evaluateResponse,
    calculateExamStatistics,
    calculateQuestionStatistics,
    loading: state.loading,
    error: state.error,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}
