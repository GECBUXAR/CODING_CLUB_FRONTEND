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
   * @returns {Promise} - API response
   */
  submitExamAnswers: async (id, answers) => {
    try {
      const response = await apiClient.post(`/exams/${id}/submit`, { answers });
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
};

export default examService;
