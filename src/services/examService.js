import apiClient from "./api";

/**
 * Exam Service - Handles all exam-related API calls
 */
const examService = {
  /**
   * Get all exams with optional filtering
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  getAllExams: async (params = {}) => {
    try {
      const response = await apiClient.get("/exams", { params });
      return {
        success: true,
        data: response.data.data || [],
        pagination: {
          total: response.data.total,
          currentPage: response.data.currentPage,
          totalPages: response.data.totalPages,
        },
      };
    } catch (error) {
      console.error("Error fetching exams:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch exams",
      };
    }
  },

  /**
   * Get exam by ID
   * @param {string} id - Exam ID
   * @returns {Promise} - API response
   */
  getExamById: async (id) => {
    try {
      const response = await apiClient.get(`/exams/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam details",
      };
    }
  },

  /**
   * Get exam questions
   * @param {string} id - Exam ID
   * @returns {Promise} - API response
   */
  getExamQuestions: async (id) => {
    try {
      const response = await apiClient.get(`/exams/${id}/questions`);
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error) {
      console.error(`Error fetching exam questions for ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam questions",
      };
    }
  },

  /**
   * Register for an exam
   * @param {string} id - Exam ID
   * @returns {Promise} - API response
   */
  registerForExam: async (id) => {
    try {
      const response = await apiClient.post(`/exams/${id}/register`);
      return {
        success: true,
        message:
          response.data.message || "Successfully registered for the exam",
      };
    } catch (error) {
      console.error(`Error registering for exam ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to register for exam",
      };
    }
  },

  /**
   * Get user's exam results
   * @param {string} id - Exam ID
   * @returns {Promise} - API response
   */
  getExamResults: async (id) => {
    try {
      const response = await apiClient.get(`/exams/${id}/results`);
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error) {
      console.error(`Error fetching exam results for ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam results",
      };
    }
  },

  /**
   * Submit exam answers
   * @param {string} id - Exam ID
   * @param {Array} answers - Array of answer objects
   * @param {Number} timeSpent - Time spent in seconds
   * @returns {Promise} - API response
   */
  submitExamAnswers: async (id, answers, timeSpent) => {
    try {
      const response = await apiClient.post(`/enhanced-exams/${id}/submit`, {
        answers,
        timeSpent,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Exam submitted successfully",
      };
    } catch (error) {
      console.error(`Error submitting exam answers for ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to submit exam answers",
      };
    }
  },

  /**
   * Get user's enrolled exams
   * @returns {Promise} - API response
   */
  getUserExams: async () => {
    try {
      // Use the events endpoint to get all user events
      const response = await apiClient.get("/events/user-events");

      if (response.data && response.data.data) {
        // Filter the events to only include exams (isExam: true)
        const userExams = response.data.data.filter(
          (event) => event.isExam === true
        );

        return {
          success: true,
          data: userExams || [],
        };
      }

      return {
        success: true,
        data: [],
      };
    } catch (error) {
      console.error("Error fetching user exams:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch your exams",
      };
    }
  },

  /**
   * Get a specific exam result
   * @param {string} examId - Exam ID
   * @param {string} resultId - Result ID
   * @returns {Promise} - API response
   */
  getExamResult: async (examId, resultId) => {
    try {
      const response = await apiClient.get(`/results/${resultId}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam result ${resultId}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam result",
      };
    }
  },

  /**
   * Get a specific exam result (admin view)
   * @param {string} examId - Exam ID
   * @param {string} resultId - Result ID
   * @returns {Promise} - API response
   */
  getExamResultAdmin: async (examId, resultId) => {
    try {
      const response = await apiClient.get(
        `/enhanced-exams/${examId}/results/${resultId}`
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam result ${resultId}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam result",
      };
    }
  },

  /**
   * Get exam results for a specific user
   * @param {string} examId - Exam ID
   * @param {string} userId - User ID
   * @returns {Promise} - API response
   */
  getUserExamResults: async (examId, userId) => {
    try {
      const response = await apiClient.get(
        `/enhanced-exams/${examId}/results/user/${userId}`
      );
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error) {
      console.error(`Error fetching user exam results:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch user exam results",
      };
    }
  },

  /**
   * Get exam leaderboard
   * @param {string} examId - Exam ID
   * @returns {Promise} - API response
   */
  getExamLeaderboard: async (examId) => {
    try {
      const response = await apiClient.get(
        `/results/exam/${examId}/leaderboard`
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam leaderboard:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam leaderboard",
      };
    }
  },

  /**
   * Evaluate an exam answer (admin only)
   * @param {string} examId - Exam ID
   * @param {string} resultId - Result ID
   * @param {string} answerId - Answer ID
   * @param {Object} evaluation - Evaluation data
   * @returns {Promise} - API response
   */
  evaluateAnswer: async (examId, resultId, answerId, evaluation) => {
    try {
      const response = await apiClient.put(
        `/enhanced-exams/${examId}/results/${resultId}/answers/${answerId}/evaluate`,
        evaluation
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Answer evaluated successfully",
      };
    } catch (error) {
      console.error(`Error evaluating answer:`, error);
      return {
        success: false,
        error: error.message || "Failed to evaluate answer",
      };
    }
  },

  /**
   * Generate certificate for a passed exam
   * @param {string} examId - Exam ID
   * @param {string} resultId - Result ID
   * @returns {Promise} - API response
   */
  generateCertificate: async (examId, resultId) => {
    try {
      const response = await apiClient.post(
        `/enhanced-exams/${examId}/results/${resultId}/certificate`
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Certificate generated successfully",
      };
    } catch (error) {
      console.error(`Error generating certificate:`, error);
      return {
        success: false,
        error: error.message || "Failed to generate certificate",
      };
    }
  },

  /**
   * Get exam statistics (admin only)
   * @returns {Promise} - API response
   */
  getExamStatistics: async () => {
    try {
      const response = await apiClient.get(`/results/statistics/exams`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam statistics:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam statistics",
      };
    }
  },

  /**
   * Get user performance across all exams
   * @param {string} userId - User ID
   * @returns {Promise} - API response
   */
  getUserPerformance: async (userId) => {
    try {
      const response = await apiClient.get(
        `/results/user/${userId}/performance`
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching user performance:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch user performance",
      };
    }
  },
};

export default examService;
