/**
 * Consolidated API Service
 * 
 * This service provides a unified interface for making API calls to the backend.
 * It uses the apiClient from services/api.js for all requests and provides
 * consistent error handling and response formatting.
 */

import apiClient from './api';

/**
 * Generic request handler with consistent error handling
 * 
 * @param {Function} apiCall - The API call function to execute
 * @param {string} errorMessage - Default error message if the API call fails
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
const handleRequest = async (apiCall, errorMessage) => {
  try {
    const response = await apiCall();
    return {
      success: true,
      data: response.data.data || response.data,
    };
  } catch (error) {
    console.error(`API Error: ${errorMessage}`, error);
    return {
      success: false,
      error: error.message || error.response?.data?.message || errorMessage,
    };
  }
};

/**
 * Authentication related API calls
 */
export const authService = {
  login: (credentials) => 
    handleRequest(
      () => apiClient.post('/users/login', credentials),
      'Login failed'
    ),
  
  adminLogin: (credentials) => 
    handleRequest(
      () => apiClient.post('/admin/login', credentials),
      'Admin login failed'
    ),
  
  signup: (userData) => 
    handleRequest(
      () => apiClient.post('/users/signup', userData),
      'Registration failed'
    ),
  
  adminSignup: (userData) => 
    handleRequest(
      () => apiClient.post('/admin/signup', userData),
      'Admin registration failed'
    ),
  
  logout: () => 
    handleRequest(
      () => apiClient.post('/users/logout'),
      'Logout failed'
    ),
  
  getProfile: () => 
    handleRequest(
      () => apiClient.get('/users/profile'),
      'Failed to fetch user profile'
    ),
  
  getAdminProfile: () => 
    handleRequest(
      () => apiClient.get('/admin/profile'),
      'Failed to fetch admin profile'
    ),
  
  checkAuth: () => 
    handleRequest(
      () => apiClient.get('/users/me'),
      'Authentication check failed'
    ),
  
  checkIfAdmin: (email) => 
    handleRequest(
      () => apiClient.get(`/admin/check-by-email?email=${encodeURIComponent(email)}`),
      'Admin check failed'
    ),
};

/**
 * Event/Exam related API calls
 */
export const eventService = {
  getAllEvents: (params = {}) => 
    handleRequest(
      () => apiClient.get('/events', { params }),
      'Failed to fetch events'
    ),
  
  getEventById: (eventId) => 
    handleRequest(
      () => apiClient.get(`/events/${eventId}`),
      'Failed to fetch event details'
    ),
  
  createEvent: (eventData) => 
    handleRequest(
      () => apiClient.post('/events', eventData),
      'Failed to create event'
    ),
  
  updateEvent: (eventId, eventData) => 
    handleRequest(
      () => apiClient.put(`/events/${eventId}`, eventData),
      'Failed to update event'
    ),
  
  deleteEvent: (eventId) => 
    handleRequest(
      () => apiClient.delete(`/events/${eventId}`),
      'Failed to delete event'
    ),
  
  getUpcomingEvents: () => 
    handleRequest(
      () => apiClient.get('/events/upcoming'),
      'Failed to fetch upcoming events'
    ),
  
  getUserEvents: () => 
    handleRequest(
      () => apiClient.get('/events/user-events'),
      'Failed to fetch user events'
    ),
  
  registerForEvent: (eventId) => 
    handleRequest(
      () => apiClient.post(`/events/${eventId}/register`),
      'Failed to register for event'
    ),
  
  unregisterFromEvent: (eventId) => 
    handleRequest(
      () => apiClient.post(`/events/${eventId}/unregister`),
      'Failed to unregister from event'
    ),
};

/**
 * Exam response related API calls
 */
export const examService = {
  getExamResponses: (examId) => 
    handleRequest(
      () => apiClient.get(`/exams/${examId}/responses`),
      'Failed to fetch exam responses'
    ),
  
  getExamResponseById: (examId, responseId) => 
    handleRequest(
      () => apiClient.get(`/exams/${examId}/responses/${responseId}`),
      'Failed to fetch exam response'
    ),
  
  updateExamResponse: (examId, responseId, updateData) => 
    handleRequest(
      () => apiClient.put(`/exams/${examId}/responses/${responseId}`, updateData),
      'Failed to update exam response'
    ),
  
  getEvaluationCriteria: (examId) => 
    handleRequest(
      () => apiClient.get(`/exams/${examId}/criteria`),
      'Failed to fetch evaluation criteria'
    ),
  
  submitEvaluation: (examId, responseId, evaluationData) => 
    handleRequest(
      () => apiClient.post(`/exams/${examId}/responses/${responseId}/evaluate`, evaluationData),
      'Failed to submit evaluation'
    ),
};

/**
 * Faculty related API calls
 */
export const facultyService = {
  getAllFaculty: () => 
    handleRequest(
      () => apiClient.get('/faculty'),
      'Failed to fetch faculty members'
    ),
  
  getFacultyById: (facultyId) => 
    handleRequest(
      () => apiClient.get(`/faculty/${facultyId}`),
      'Failed to fetch faculty details'
    ),
  
  createFaculty: (facultyData) => 
    handleRequest(
      () => apiClient.post('/faculty', facultyData),
      'Failed to create faculty'
    ),
  
  updateFaculty: (facultyId, facultyData) => 
    handleRequest(
      () => apiClient.put(`/faculty/${facultyId}`, facultyData),
      'Failed to update faculty'
    ),
  
  deleteFaculty: (facultyId) => 
    handleRequest(
      () => apiClient.delete(`/faculty/${facultyId}`),
      'Failed to delete faculty'
    ),
  
  getFacultyTestimonials: () => 
    handleRequest(
      () => apiClient.get('/faculty/testimonials'),
      'Failed to fetch faculty testimonials'
    ),
};

/**
 * Utility API calls
 */
export const utilService = {
  checkApiConnection: () => 
    handleRequest(
      () => apiClient.get('/.well-known/version', { timeout: 5000 }),
      'API connection check failed'
    ),
};

// Export a default object with all services
export default {
  auth: authService,
  events: eventService,
  exams: examService,
  faculty: facultyService,
  utils: utilService,
  
  // Generic request method for custom endpoints
  request: (method, endpoint, data = null, options = {}) => 
    handleRequest(
      () => apiClient({
        method,
        url: endpoint,
        data: method !== 'get' ? data : null,
        params: method === 'get' ? data : null,
        ...options,
      }),
      `Request to ${endpoint} failed`
    ),
};
