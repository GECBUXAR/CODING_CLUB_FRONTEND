import enhancedApiClient from "./enhancedApi";

/**
 * Leaderboard Service - Handles all leaderboard-related API calls
 */
const leaderboardService = {
  /**
   * Get global leaderboard across all exams
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - API response
   */
  getGlobalLeaderboard: async (params = {}) => {
    try {
      const response = await enhancedApiClient.get("/leaderboard", { params });
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      
      // If API endpoint doesn't exist yet, return mock data
      if (error.response?.status === 404) {
        console.log("Using mock leaderboard data");
        return {
          success: true,
          data: getMockLeaderboardData(),
        };
      }
      
      return {
        success: false,
        error: error.message || "Failed to fetch leaderboard",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },

  /**
   * Get leaderboard for a specific exam
   * @param {string} examId - Exam ID
   * @returns {Promise} - API response
   */
  getExamLeaderboard: async (examId) => {
    try {
      const response = await enhancedApiClient.get(`/exams/${examId}/leaderboard`);
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error(`Error fetching leaderboard for exam ${examId}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch exam leaderboard",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  },
  
  /**
   * Get leaderboard for a specific course or category
   * @param {string} category - Category name
   * @returns {Promise} - API response
   */
  getCategoryLeaderboard: async (category) => {
    try {
      const response = await enhancedApiClient.get(`/leaderboard/category/${category}`);
      return {
        success: true,
        data: response.data.data || [],
      };
    } catch (error) {
      console.error(`Error fetching leaderboard for category ${category}:`, error);
      return {
        success: false,
        error: error.message || "Failed to fetch category leaderboard",
        isRateLimitError: enhancedApiClient.isRateLimitError(error),
        retryAfter: enhancedApiClient.getRetryAfter(error),
      };
    }
  }
};

/**
 * Generate mock leaderboard data for development
 * @returns {Array} - Mock leaderboard data
 */
function getMockLeaderboardData() {
  const mockData = [
    { "name": "ANKIT KUMAR THAKUR", "roll_no": "24CS20", "marks": 44, "rank": 1 },
    { "name": "Virat Raj", "roll_no": "24CS107", "marks": 41, "rank": 2 },
    { "name": "Harshit Kumar Thakur", "roll_no": "24CS17", "marks": 41, "rank": 3 },
    { "name": "RITIK KUMAR RAI", "roll_no": "24EE20", "marks": 39, "rank": 4 },
    { "name": "Nityanand Tiwari", "roll_no": "24CS02", "marks": 38, "rank": 5 },
    { "name": "VIKASH KUMAR YADAV", "roll_no": "24CS42", "marks": 35, "rank": 6 },
    { "name": "Ranjeet Kumar", "roll_no": "24CS11", "marks": 35, "rank": 7 },
    { "name": "Khushi raj", "roll_no": "24CS34", "marks": 35, "rank": 8 },
    { "name": "suman kumar", "roll_no": "24cs30", "marks": 35, "rank": 9 },
    { "name": "Pranav Prakash", "roll_no": "24CS71", "marks": 32, "rank": 10 },
    { "name": "Nisha Kumari", "roll_no": "24CS09", "marks": 32, "rank": 11 },
    { "name": "Suman Baitha", "roll_no": "24CS72", "marks": 32, "rank": 12 },
    { "name": "Ritesh Kumar", "roll_no": "24cs49", "marks": 30, "rank": 13 },
    { "name": "Nikhil Kumar Sharma", "roll_no": "24EC19", "marks": 30, "rank": 14 },
    { "name": "SIBU PATHAK", "roll_no": "24CS55", "marks": 30, "rank": 15 },
    { "name": "Divya Kumari", "roll_no": "24cs07", "marks": 29, "rank": 16 },
    { "name": "PRINCE RAJ KASHYAP", "roll_no": "24CS08", "marks": 29, "rank": 17 },
    { "name": "Anushka Deep", "roll_no": "24CS14", "marks": 26, "rank": 18 },
    { "name": "AYUSH ANAND", "roll_no": "24CS80", "marks": 26, "rank": 19 },
    { "name": "Anshu Kumari", "roll_no": "24cs19", "marks": 26, "rank": 20 },
  ];
  
  // Add additional fields for display
  return mockData.map(student => ({
    ...student,
    department: student.roll_no.substring(2, 4) || "CS",
    percentile: ((student.marks / 50) * 100).toFixed(1)
  }));
}

export default leaderboardService;
