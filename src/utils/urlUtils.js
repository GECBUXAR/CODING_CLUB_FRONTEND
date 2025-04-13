/**
 * URL Utilities for the Coding Club Frontend
 * This file contains functions for handling URLs and navigation
 */

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - URL-friendly slug
 */
export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim();
};

/**
 * Build a URL with both ID and slug for better SEO and readability
 * @param {string} baseUrl - The base URL path (e.g., '/exams')
 * @param {string} id - The item ID
 * @param {string} title - The title to convert to a slug
 * @returns {string} - Complete URL with ID and slug
 */
export const buildUrl = (baseUrl, id, title) => {
  if (!id) return baseUrl;
  const slug = generateSlug(title);
  return `${baseUrl}/${id}${slug ? `-${slug}` : ''}`;
};

/**
 * Extract ID from a URL that contains both ID and slug
 * @param {string} paramValue - The URL parameter value (e.g., '123-example-slug')
 * @returns {string} - The extracted ID
 */
export const extractIdFromParam = (paramValue) => {
  if (!paramValue) return null;
  
  // If the parameter contains a hyphen, extract the ID part
  if (paramValue.includes('-')) {
    return paramValue.split('-')[0];
  }
  
  // Otherwise, return the parameter as is (assuming it's just an ID)
  return paramValue;
};

/**
 * Build exam URL with slug
 * @param {Object} exam - Exam object with id and title
 * @returns {string} - URL for the exam
 */
export const getExamUrl = (exam) => {
  if (!exam || !exam._id) return '/exams';
  return buildUrl('/exams', exam._id || exam.id, exam.title);
};

/**
 * Build event URL with slug
 * @param {Object} event - Event object with id and title
 * @returns {string} - URL for the event
 */
export const getEventUrl = (event) => {
  if (!event || !event._id) return '/events';
  return buildUrl('/events', event._id || event.id, event.title);
};

/**
 * Build user profile URL with slug
 * @param {Object} user - User object with id and name
 * @returns {string} - URL for the user profile
 */
export const getUserProfileUrl = (user) => {
  if (!user || !user._id) return '/profile';
  return buildUrl('/profile', user._id || user.id, user.name);
};

/**
 * Build exam result URL with slug
 * @param {Object} exam - Exam object
 * @param {string} resultId - Result ID
 * @returns {string} - URL for the exam result
 */
export const getExamResultUrl = (exam, resultId) => {
  if (!exam || !exam._id || !resultId) return '/exams';
  return `${getExamUrl(exam)}/results/${resultId}`;
};

/**
 * Build exam leaderboard URL
 * @param {Object} exam - Exam object
 * @returns {string} - URL for the exam leaderboard
 */
export const getExamLeaderboardUrl = (exam) => {
  if (!exam || !exam._id) return '/exams';
  return `${getExamUrl(exam)}/leaderboard`;
};

/**
 * Parse URL parameters to extract meaningful data
 * @param {string} paramValue - The URL parameter value
 * @returns {Object} - Object containing id and slug
 */
export const parseUrlParam = (paramValue) => {
  if (!paramValue) return { id: null, slug: null };
  
  // If the parameter contains a hyphen, split it into ID and slug
  if (paramValue.includes('-')) {
    const [id, ...slugParts] = paramValue.split('-');
    return {
      id,
      slug: slugParts.join('-')
    };
  }
  
  // Otherwise, return the parameter as the ID with no slug
  return {
    id: paramValue,
    slug: null
  };
};
