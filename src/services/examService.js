import apiClient from "./api";

// Get all exams
export const getAllExams = async () => {
  try {
    const response = await apiClient.get("/events");
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
    const response = await apiClient.get(`/events/${examId}`);
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
    const response = await apiClient.post("/events", examData);
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
    const response = await apiClient.put(`/events/${examId}`, examData);
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
    await apiClient.delete(`/events/${examId}`);
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

// Get user's exams
export const getUserExams = async () => {
  try {
    const response = await apiClient.get("/events/user-events");
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch your exams",
    };
  }
};

// Submit exam answers
export const submitExamAnswers = async (examId, answers) => {
  try {
    const response = await apiClient.post(`/events/${examId}/submit`, {
      answers,
    });
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to submit exam answers",
    };
  }
};

// Get exam results
export const getExamResults = async (examId) => {
  try {
    const response = await apiClient.get(`/results/by-event/${examId}`);
    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch exam results",
    };
  }
};
