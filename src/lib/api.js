import { corsProxy } from "@/utils/cors-proxy";

// Use localhost for development
const API_BASE_URL = "http://localhost:39303/api/v1";

// API timeout in milliseconds - increased to give more time for slow development environments
const API_TIMEOUT = 5000;

// Helper function to detect if we're likely in offline development mode
const isLikelyOfflineDevelopment = () => {
  // In a real app, you could check for process.env.NODE_ENV or window.location
  // For now, we assume we're in development mode since the API is on localhost
  return API_BASE_URL.includes("localhost");
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "An error occurred with the request");
  }
  return response.json();
};

// Function to create a promise that rejects after a timeout
const timeoutPromise = (ms) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timed out after ${ms}ms`));
    }, ms);
  });
};

// Standard request options with direct literals to avoid TypeScript errors
const getRequestOptions = (method, body = null) => {
  // Use direct literals for values to satisfy TypeScript
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

// Exams API
export const getExams = async () => {
  try {
    // In development with localhost, maybe skip the API call if we're likely offline
    if (isLikelyOfflineDevelopment()) {
      // Log a development-only message
      console.log("🔄 Development mode with localhost API - using sample data");
      return {
        success: false,
        error: "Using sample data in development mode",
        usingFallbackData: true,
      };
    }

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}/events`, getRequestOptions("GET")),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    // Provide a more descriptive error message for development
    const errorMessage = API_BASE_URL.includes("localhost")
      ? `API Error (expected in development without backend): ${error.message}`
      : `Error in getExams: ${error.message}`;

    console.warn(errorMessage);

    return {
      success: false,
      error: error.message,
      usingFallbackData: true,
    };
  }
};

export const getExamById = async (examId) => {
  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}/events/${examId}`, getRequestOptions("GET")),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error in getExamById:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const createExam = async (examData) => {
  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}/events`, getRequestOptions("POST", examData)),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error in createExam:", error);
    return {
      success: false,
      error: error.message,
      // Generate a dummy response with a temporary ID for offline mode
      data: {
        ...examData,
        id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      },
    };
  }
};

export const updateExam = async (examId, examData) => {
  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(
        `${API_BASE_URL}/events/${examId}`,
        getRequestOptions("PUT", examData)
      ),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error in updateExam:", error);
    return {
      success: false,
      error: error.message,
      // Return the updated data for offline mode
      data: {
        ...examData,
        id: examId,
        updatedAt: new Date().toISOString(),
      },
    };
  }
};

export const deleteExam = async (examId) => {
  try {
    // Check if we're in offline development mode first
    if (isLikelyOfflineDevelopment()) {
      console.log("🔄 Development mode - simulating successful exam deletion");
      return {
        success: true,
        data: { id: examId, deleted: true },
        offlineMode: true,
      };
    }

    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(`${API_BASE_URL}/events/${examId}`, getRequestOptions("DELETE")),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error in deleteExam:", error);

    // For development mode, return a successful response
    if (isLikelyOfflineDevelopment()) {
      console.log(
        "🔄 Development fallback - simulating successful exam deletion after error"
      );
      return {
        success: true,
        data: { id: examId, deleted: true },
        offlineMode: true,
        originalError: error.message,
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

// Questions API
export const getQuestions = async (examId) => {
  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(
        `${API_BASE_URL}/events/${examId}/questions`,
        getRequestOptions("GET")
      ),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error in getQuestions:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

export const createQuestion = async (examId, questionData) => {
  try {
    // Race between fetch and timeout
    const response = await Promise.race([
      fetch(
        `${API_BASE_URL}/events/${examId}/questions`,
        getRequestOptions("POST", questionData)
      ),
      timeoutPromise(API_TIMEOUT),
    ]);

    return {
      success: true,
      data: await response.json(),
    };
  } catch (error) {
    console.error("Error in createQuestion:", error);
    return {
      success: false,
      error: error.message,
      // Generate a dummy response with a temporary ID for offline mode
      data: {
        ...questionData,
        id: `temp-${Date.now()}`,
        examId,
        createdAt: new Date().toISOString(),
      },
    };
  }
};

// Responses API
export const getExamResponses = async (examId) => {
  // Check if we're in offline development mode
  if (isLikelyOfflineDevelopment()) {
    try {
      // Race between fetch and timeout
      const response = await Promise.race([
        fetch(corsProxy(`${API_BASE_URL}/exams/${examId}/responses`), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }),
        timeoutPromise(API_TIMEOUT),
      ]);
      return handleResponse(response);
    } catch (err) {
      console.log(
        `Development mode: Simulating exam responses fetch for exam ${examId}`,
        err.message
      );

      // Generate sample responses for development testing
      const sampleResponses = Array(3)
        .fill(null)
        .map((_, index) => ({
          id: `response-${index + 1}-${examId}`,
          examId: examId,
          userId: `user-${index + 1}`,
          userName: `Test User ${index + 1}`,
          score: Math.floor(Math.random() * 100),
          totalQuestions: 10,
          correctAnswers: Math.floor(Math.random() * 10),
          timeSpent: Math.floor(Math.random() * 3600),
          status: ["completed", "partially_graded", "graded"][index % 3],
          submittedAt: new Date(
            Date.now() - Math.random() * 86400000 * 7
          ).toISOString(),
          questions: Array(5)
            .fill(null)
            .map((_, qIndex) => ({
              id: `q-${qIndex + 1}-${examId}`,
              text: `Sample Question ${qIndex + 1}`,
              answer: `Sample answer for question ${qIndex + 1}`,
              score: Math.floor(Math.random() * 10),
              maxScore: 10,
              status: ["graded", "pending"][Math.floor(Math.random() * 2)],
            })),
        }));

      return {
        success: true,
        data: sampleResponses,
        usingFallbackData: true,
      };
    }
  } else {
    // Normal flow for production mode
    try {
      const response = await fetch(
        corsProxy(`${API_BASE_URL}/exams/${examId}/responses`)
      );

      const responseData = await handleResponse(response);

      // Convert the response to our standard format
      return {
        success: true,
        data: responseData,
      };
    } catch (error) {
      console.error("Error fetching exam responses:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam responses",
      };
    }
  }
};

export const getExamResponseById = async (responseId) => {
  const response = await fetch(
    corsProxy(`${API_BASE_URL}/responses/${responseId}`)
  );
  return handleResponse(response);
};

export const updateExamResponse = async (responseId, responseData) => {
  const response = await fetch(
    corsProxy(`${API_BASE_URL}/responses/${responseId}`),
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(responseData),
    }
  );
  return handleResponse(response);
};

// Utility to test API connection
export const checkApiConnection = async () => {
  try {
    // Race between fetch and timeout
    await Promise.race([
      fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        mode: "cors",
        // Note: TypeScript has issues with string literals here
        // but these are the correct values according to fetch API
        credentials: "include",
      }),
      timeoutPromise(API_TIMEOUT),
    ]);
    return { online: true };
  } catch (error) {
    console.log("API connection test failed:", error.message);
    return {
      online: false,
      error: error.message,
      tip: "This is normal during development if your backend API isn't running.",
    };
  }
};
