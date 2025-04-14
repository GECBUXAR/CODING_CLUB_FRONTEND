import enhancedApiClient from "./enhancedApi";

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
      const response = await enhancedApiClient.get("/exams", { params });
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(`/exams/${id}`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam details",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(`/exams/${id}/questions`);
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.post(`/exams/${id}/register`);
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get exam responses (for evaluation)
   * @param {string} id - Exam ID
   * @returns {Promise} - API response
   */
  getExamResponses: async (id) => {
    try {
      const response = await enhancedApiClient.get(`/exams/${id}/responses`);
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error) {
      console.error(`Error fetching exam responses for ${id}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam responses",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get a specific exam response by ID
   * @param {string} responseId - Response ID
   * @returns {Promise} - API response
   */
  getExamResponseById: async (responseId) => {
    try {
      const response = await enhancedApiClient.get(
        `/exams/responses/${responseId}`
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error fetching exam response ${responseId}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam response",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(`/exams/${id}/results`);
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.post(
        `/enhanced-exams/${id}/submit`,
        {
          answers,
          timeSpent,
        }
      );
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get("/events/user-events");

      if (response.data?.data) {
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(
        `/results/${resultId}`,
        {},
        true
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(
        `/enhanced-exams/${examId}/results/${resultId}`,
        {},
        true
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
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(
        `/enhanced-exams/${examId}/results/user/${userId}`,
        {},
        true
      );
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error) {
      console.error("Error fetching user exam results:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch user exam results",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(
        `/results/exam/${examId}/leaderboard`,
        {},
        true
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching exam leaderboard:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam leaderboard",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.put(
        `/enhanced-exams/${examId}/results/${resultId}/answers/${answerId}/evaluate`,
        evaluation
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Answer evaluated successfully",
      };
    } catch (error) {
      console.error("Error evaluating answer:", error);
      return {
        success: false,
        error: error.message || "Failed to evaluate answer",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.post(
        `/enhanced-exams/${examId}/results/${resultId}/certificate`
      );
      return {
        success: true,
        data: response.data.data,
        message: response.data.message || "Certificate generated successfully",
      };
    } catch (error) {
      console.error("Error generating certificate:", error);
      return {
        success: false,
        error: error.message || "Failed to generate certificate",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get exam statistics (admin only)
   * @returns {Promise} - API response
   */
  getExamStatistics: async () => {
    try {
      const response = await enhancedApiClient.get(
        "/results/statistics/exams",
        {},
        true
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching exam statistics:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam statistics",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
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
      const response = await enhancedApiClient.get(
        `/results/user/${userId}/performance`,
        {},
        true
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error fetching user performance:", error);
      return {
        success: false,
        error: error.message || "Failed to fetch user performance",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Create a new exam
   * @param {Object} examData - Exam data
   * @returns {Promise} - API response
   */
  createExam: async (examData) => {
    try {
      // Format date if it's a string
      const formattedData = {
        ...examData,
        date:
          examData.date && typeof examData.date === "string"
            ? new Date(examData.date).toISOString()
            : examData.date,
        isExam: true, // Always set isExam to true
        category: examData.category || "exam", // Default category to exam
      };

      console.log("Creating exam with data:", formattedData);

      const response = await enhancedApiClient.post("/events", formattedData);
      console.log("Exam creation response:", response.data);

      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error creating exam:", error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to create exam",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Update an exam
   * @param {string} id - Exam ID
   * @param {Object} examData - Updated exam data
   * @returns {Promise} - API response
   */
  updateExam: async (id, examData) => {
    try {
      // Format date if it's a string
      const formattedData = {
        ...examData,
        date:
          examData.date && typeof examData.date === "string"
            ? new Date(examData.date).toISOString()
            : examData.date,
        isExam: true, // Always ensure isExam is true
      };

      const response = await enhancedApiClient.put(
        `/events/${id}`,
        formattedData
      );
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      console.error(`Error updating exam ${id}:`, error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update exam",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Upload previous exam scores for multiple students
   * @param {string} examId - Exam ID
   * @param {Array} studentScores - Array of student score objects
   * @returns {Promise} - API response
   */
  uploadPreviousExamScores: async (examId, studentScores) => {
    try {
      console.log(
        `Uploading scores for exam ${examId} for ${studentScores.length} students`
      );

      // Format the data for the API
      const formattedData = {
        examId,
        scores: studentScores.map((student) => ({
          name: student.name,
          rollNo: student.roll_no,
          score: student.marks,
        })),
      };

      const response = await enhancedApiClient.post(
        `/exams/${examId}/bulk-results`,
        formattedData
      );

      return {
        success: true,
        data: response.data.data,
        message:
          response.data.message ||
          `Successfully uploaded scores for ${studentScores.length} students`,
      };
    } catch (error) {
      console.error(`Error uploading exam scores for exam ${examId}:`, error);
      return {
        success: false,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to upload exam scores",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Upload temporary exam scores from a JSON array
   * @param {string} examId - Exam ID
   * @param {string} jsonData - JSON string containing student scores
   * @returns {Promise} - API response
   */
  uploadTemporaryExamScores: async (examId, jsonData) => {
    try {
      let studentScores;

      // Parse the JSON if it's a string
      if (typeof jsonData === "string") {
        try {
          studentScores = JSON.parse(jsonData);
        } catch (parseError) {
          throw new Error(`Invalid JSON format: ${parseError.message}`);
        }
      } else {
        // If it's already an object, use it directly
        studentScores = jsonData;
      }

      if (!Array.isArray(studentScores)) {
        throw new Error("Student scores must be an array");
      }

      console.log(
        `Processing ${studentScores.length} student scores for exam ${examId}`
      );

      // Validate the data format
      const validatedScores = studentScores.map((student, index) => {
        if (!student.name) {
          throw new Error(`Missing student name at index ${index}`);
        }
        if (!student.roll_no) {
          throw new Error(`Missing roll number for student ${student.name}`);
        }
        if (student.marks === undefined || student.marks === null) {
          throw new Error(`Missing marks for student ${student.name}`);
        }

        return {
          name: student.name,
          rollNo: student.roll_no,
          score: parseInt(student.marks, 10),
        };
      });

      // Store in local storage for temporary use
      localStorage.setItem(
        `temp_exam_scores_${examId}`,
        JSON.stringify(validatedScores)
      );

      // If there's an API endpoint for this, we can use it
      // For now, we'll just return success with the validated data
      return {
        success: true,
        data: validatedScores,
        message: `Successfully processed ${validatedScores.length} student scores for temporary storage`,
      };
    } catch (error) {
      console.error(`Error processing temporary exam scores:`, error);
      return {
        success: false,
        error: error.message || "Failed to process exam scores",
      };
    }
  },
};

export default examService;
