import axiosInstance from "../services/api";

// Get all exams
export const getExams = async () => {
  try {
    const response = await axiosInstance.get("/events");
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch exams",
    };
  }
};

// Get exam by ID
export const getExamById = async (examId) => {
  try {
    const response = await axiosInstance.get(`/events/${examId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch exam details",
    };
  }
};

// Create a new exam (admin only)
export const createExam = async (examData) => {
  try {
    const response = await axiosInstance.post("/events", examData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create exam",
    };
  }
};

// Update an exam (admin only)
export const updateExam = async (examId, examData) => {
  try {
    const response = await axiosInstance.put(`/events/${examId}`, examData);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update exam",
    };
  }
};

// Delete an exam (admin only)
export const deleteExam = async (examId) => {
  try {
    await axiosInstance.delete(`/events/${examId}`);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete exam",
    };
  }
};

// Get exam responses for a specific exam
export const getExamResponses = async (examId) => {
  try {
    const response = await axiosInstance.get(`/exams/${examId}/responses`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching exam responses:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch exam responses",
    };
  }
};

// Get a specific exam response by ID
export const getExamResponseById = async (examId, responseId) => {
  try {
    const response = await axiosInstance.get(
      `/exams/${examId}/responses/${responseId}`
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching exam response:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch exam response",
    };
  }
};

// Update an exam response
export const updateExamResponse = async (examId, responseId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/exams/${examId}/responses/${responseId}`,
      updateData
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error updating exam response:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update exam response",
    };
  }
};

// Get evaluation criteria for an exam
export const getEvaluationCriteria = async (examId) => {
  try {
    const response = await axiosInstance.get(`/exams/${examId}/criteria`);
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching evaluation criteria:", error);
    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to fetch evaluation criteria",
    };
  }
};

// Submit evaluation for a response
export const submitEvaluation = async (examId, responseId, evaluationData) => {
  try {
    const response = await axiosInstance.post(
      `/exams/${examId}/responses/${responseId}/evaluate`,
      evaluationData
    );
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error submitting evaluation:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Failed to submit evaluation",
    };
  }
};

// Check API connection - used by admin panel
export const checkApiConnection = async () => {
  try {
    const response = await axiosInstance.get("/health-check");
    return {
      online: true,
      message: response.data?.message || "Connected to API successfully",
    };
  } catch (error) {
    console.error("API Connection check failed:", error);
    return {
      online: false,
      message: error.message || "Could not connect to API",
    };
  }
};

export default {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamResponses,
  getExamResponseById,
  updateExamResponse,
  getEvaluationCriteria,
  submitEvaluation,
  checkApiConnection,
};
