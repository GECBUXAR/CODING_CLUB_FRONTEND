import axios from "axios";
import { API_CONFIG } from "@/config";

// Get all exams
export const getExams = async () => {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/events`);
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
    const response = await axios.get(`${API_CONFIG.BASE_URL}/events/${examId}`);
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
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/events`,
      examData
    );
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
    const response = await axios.put(
      `${API_CONFIG.BASE_URL}/events/${examId}`,
      examData
    );
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
    await axios.delete(`${API_CONFIG.BASE_URL}/events/${examId}`);
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
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/exams/${examId}/responses`
    );
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
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/exams/${examId}/responses/${responseId}`
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
    const response = await axios.put(
      `${API_CONFIG.BASE_URL}/exams/${examId}/responses/${responseId}`,
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
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/exams/${examId}/criteria`
    );
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
    const response = await axios.post(
      `${API_CONFIG.BASE_URL}/exams/${examId}/responses/${responseId}/evaluate`,
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

/**
 * Check if the API is reachable
 * @returns {Promise<{online: boolean, message: string}>}
 */
export async function checkApiConnection() {
  try {
    const response = await axios.get(`${API_CONFIG.BASE_URL}/health-check`, {
      timeout: 5000, // 5 seconds timeout
    });

    if (response.status === 200) {
      return { online: true, message: "API is online" };
    }
    return { online: false, message: "API returned non-200 status" };
  } catch (error) {
    console.error("API connection check failed:", error);
    return {
      online: false,
      message: error?.message || "Could not connect to API",
    };
  }
}

/**
 * Generic API handler for error handling
 */
export async function apiRequest(method, endpoint, data = null, options = {}) {
  try {
    const response = await axios({
      method,
      url: `${API_CONFIG.BASE_URL}${endpoint}`,
      data: method !== "get" ? data : null,
      params: method === "get" ? data : null,
      ...options,
    });

    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API ${method.toUpperCase()} request failed:`, error);

    return {
      success: false,
      error: error?.response?.data || {
        message: error?.message || "Request failed",
      },
    };
  }
}

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
  apiRequest,
};
