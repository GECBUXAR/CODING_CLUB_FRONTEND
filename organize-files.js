/**
 * CODING CLUB FRONTEND - FILE STRUCTURE REORGANIZATION IMPLEMENTATION
 *
 * This script will reorganize your project files according to the recommended structure.
 *
 * How to use:
 * 1. Make sure you've backed up your project
 * 2. Run: node organize-files.js
 * 3. Check the console output for any errors
 */

import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory of the project
const ROOT_DIR = path.resolve(__dirname);
const SRC_DIR = path.join(ROOT_DIR, "src");

// Define the new directory structure
const directories = [
  "src/assets/images",
  "src/assets/icons",
  "src/components/auth",
  "src/components/common",
  "src/components/layout",
  "src/components/navigation",
  "src/components/exams",
  "src/components/dashboard",
  "src/components/ui",
  "src/contexts",
  "src/hooks",
  "src/pages/auth",
  "src/pages/user",
  "src/pages/admin",
  "src/pages/common",
  "src/pages/errors",
  "src/utils",
  "src/services",
  "src/styles",
];

// Files to move (source -> destination)
const filesToMove = [
  // Context files - keeping in same directory but listing for completeness
  {
    from: "src/contexts/auth-context.jsx",
    to: "src/contexts/auth-context.jsx",
  },
  {
    from: "src/contexts/notification-context.jsx",
    to: "src/contexts/notification-context.jsx",
  },
  {
    from: "src/contexts/exam-context.jsx",
    to: "src/contexts/exam-context.jsx",
  },
  {
    from: "src/contexts/faculty-context.jsx",
    to: "src/contexts/faculty-context.jsx",
  },
  {
    from: "src/contexts/response-evaluation-context.jsx",
    to: "src/contexts/response-evaluation-context.jsx",
  },

  // Auth components
  {
    from: "src/components/auth/LoginForm.jsx",
    to: "src/components/auth/LoginForm.jsx",
  },
  {
    from: "src/components/auth/SignupForm.jsx",
    to: "src/components/auth/SignupForm.jsx",
  },
  {
    from: "src/components/auth/AdminSignup.jsx",
    to: "src/components/auth/AdminLoginForm.jsx",
  },

  // Common components
  {
    from: "src/components/common/notification-center.jsx",
    to: "src/components/common/notification-center.jsx",
  },
  {
    from: "src/components/common/cors-warning.jsx",
    to: "src/components/common/cors-warning.jsx",
  },

  // Navigation components
  {
    from: "src/components/navigation/MainNavigation.jsx",
    to: "src/components/navigation/MainNavigation.jsx",
  },

  // Layout components
  { from: "src/components/Footer.jsx", to: "src/components/layout/Footer.jsx" },

  // Pages
  { from: "src/pages/LandingPage.jsx", to: "src/pages/common/HomePage.jsx" },
  { from: "src/pages/AboutPage.jsx", to: "src/pages/common/AboutPage.jsx" },
  { from: "src/pages/ContactPage.jsx", to: "src/pages/common/ContactPage.jsx" },
  { from: "src/pages/LoginPage.jsx", to: "src/pages/auth/LoginPage.jsx" },
  { from: "src/pages/SignupPage.jsx", to: "src/pages/auth/SignupPage.jsx" },
  { from: "src/pages/ProfilePage.jsx", to: "src/pages/user/ProfilePage.jsx" },
  { from: "src/pages/AllEventsPage.jsx", to: "src/pages/user/ExamsPage.jsx" },
  { from: "src/pages/ExamPage.jsx", to: "src/pages/user/ExamDetailPage.jsx" },
  {
    from: "src/pages/AdminDashboardPage.jsx",
    to: "src/pages/admin/AdminDashboard.jsx",
  },
  {
    from: "src/pages/user/MyExamsPage.jsx",
    to: "src/pages/user/MyExamsPage.jsx",
  },

  // Routes and main app files
  { from: "src/App.jsx", to: "src/App.jsx" },
  { from: "src/main.jsx", to: "src/main.jsx" },
];

// Placeholder files to create
const placeholders = [
  {
    path: "src/pages/errors/NotFoundPage.jsx",
    content: `import React from 'react';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-2xl font-medium text-gray-600 mb-6">Page Not Found</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
};

export default NotFoundPage;`,
  },
  {
    path: "src/pages/errors/ForbiddenPage.jsx",
    content: `import React from 'react';

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
      <p className="text-2xl font-medium text-gray-600 mb-6">Access Forbidden</p>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        You don't have permission to access this resource.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
};

export default ForbiddenPage;`,
  },
  {
    path: "src/utils/dateUtils.js",
    content: `/**
 * Format a date string to a human-readable format
 * @param {string} dateString - The date string to format
 * @param {string} format - The format to use (default: 'short')
 * @returns {string} The formatted date string
 */
export const formatDate = (dateString, format = 'short') => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  switch (format) {
    case 'full':
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'medium':
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'time':
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    case 'short':
    default:
      return date.toLocaleDateString('en-US');
  }
};

/**
 * Get a relative time string (e.g. "5 minutes ago")
 * @param {string} dateString - The date string
 * @returns {string} The relative time string
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (isNaN(seconds)) {
    return dateString;
  }
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      return \`\${counter} \${unit}\${counter === 1 ? '' : 's'} ago\`;
    }
  }
  
  return 'just now';
};`,
  },
  {
    path: "src/utils/validators.js",
    content: `/**
 * Email validation
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  // Simple email validation - contains @ and at least one dot after @
  if (!email) return false;
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  return local.length > 0 && domain.includes('.') && domain.split('.').every(part => part.length > 0);
};

/**
 * Password validation
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain an uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain a lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain a number' };
  }
  
  return { isValid: true, message: '' };
};

/**
 * Form validation
 * @param {Object} values - The form values
 * @param {Object} rules - The validation rules
 * @returns {Object} Validation errors
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  for (const field in rules) {
    if (Object.prototype.hasOwnProperty.call(rules, field)) {
      const value = values[field];
      const fieldRules = rules[field];
      
      // Required validation
      if (fieldRules.required && !value) {
        errors[field] = \`\${fieldRules.label || field} is required\`;
        continue;
      }
      
      // Email validation
      if (fieldRules.isEmail && value && !isValidEmail(value)) {
        errors[field] = \`Please enter a valid email address\`;
        continue;
      }
      
      // Min length validation
      if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        errors[field] = \`\${fieldRules.label || field} must be at least \${fieldRules.minLength} characters\`;
        continue;
      }
      
      // Max length validation
      if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
        errors[field] = \`\${fieldRules.label || field} must be less than \${fieldRules.maxLength} characters\`;
        continue;
      }
      
      // Custom validation
      if (fieldRules.validate && typeof fieldRules.validate === 'function') {
        const error = fieldRules.validate(value, values);
        if (error) {
          errors[field] = error;
        }
      }
    }
  }
  
  return errors;
};`,
  },
  {
    path: "src/routes.jsx",
    content: `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/auth-context';
import { RequireAuth } from './contexts/auth-context';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Common Pages
import HomePage from './pages/common/HomePage';
import AboutPage from './pages/common/AboutPage';
import ContactPage from './pages/common/ContactPage';

// User Pages
import ProfilePage from './pages/user/ProfilePage';
import ExamsPage from './pages/user/ExamsPage';
import MyExamsPage from './pages/user/MyExamsPage';
import ExamDetailPage from './pages/user/ExamDetailPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminExamsPage from './pages/admin/AdminExamsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Error Pages
import NotFoundPage from './pages/errors/NotFoundPage';
import ForbiddenPage from './pages/errors/ForbiddenPage';

// Protected Route Components
const UserRoute = ({ children }) => {
  return <RequireAuth allowedRoles={['user', 'admin']}>{children}</RequireAuth>;
};

const AdminRoute = ({ children }) => {
  return <RequireAuth allowedRoles={['admin']}>{children}</RequireAuth>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/" /> : <SignupPage />} 
      />
      
      {/* User Routes */}
      <Route 
        path="/profile" 
        element={
          <UserRoute>
            <ProfilePage />
          </UserRoute>
        } 
      />
      <Route path="/exams" element={<ExamsPage />} />
      <Route 
        path="/exams/:examId" 
        element={<ExamDetailPage />} 
      />
      <Route 
        path="/my-exams" 
        element={
          <UserRoute>
            <MyExamsPage />
          </UserRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/exams" 
        element={
          <AdminRoute>
            <AdminExamsPage />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/reports" 
        element={
          <AdminRoute>
            <AdminReportsPage />
          </AdminRoute>
        } 
      />
      
      {/* Error Routes */}
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;`,
  },
  {
    path: "src/components/layout/Footer.jsx",
    content: `import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-4">Coding Club</h3>
            <p className="text-gray-400 mb-4 max-w-xs">
              Empowering students with coding skills and knowledge through practice, competition, and community.
            </p>
          </div>
          
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/exams" className="text-gray-400 hover:text-white transition-colors">
                  Exams
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <address className="not-italic text-gray-400">
              <p className="mb-2">Email: contact@codingclub.com</p>
              <p className="mb-2">Phone: (123) 456-7890</p>
              <p>Address: 123 College Avenue, Campus Building</p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 sm:mb-0">
            © {currentYear} Coding Club. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="#privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;`,
  },
];

// Create directories
const createDirectories = () => {
  console.log("Creating directory structure...");

  for (const dir of directories) {
    const dirPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirpSync(dirPath);
      console.log(`✓ Created: ${dir}`);
    }
  }
};

// Move files
const moveFiles = () => {
  console.log("\nMoving files to new locations...");

  for (const { from, to } of filesToMove) {
    const srcPath = path.join(ROOT_DIR, from);
    const destPath = path.join(ROOT_DIR, to);

    // Create parent directory if it doesn't exist
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirpSync(destDir);
    }

    // Only copy if source exists
    if (fs.existsSync(srcPath)) {
      try {
        fs.copySync(srcPath, destPath);
        console.log(`✓ Copied: ${from} → ${to}`);
      } catch (err) {
        console.error(`✗ Error copying ${from}: ${err.message}`);
      }
    } else {
      console.log(`⚠ Skipped: ${from} (source file not found)`);
    }
  }
};

// Create placeholder files
const createPlaceholders = () => {
  console.log("\nCreating placeholder files...");

  for (const { path: filePath, content } of placeholders) {
    const fullPath = path.join(ROOT_DIR, filePath);

    // Create parent directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirpSync(dir);
    }

    // Create file if it doesn't exist
    if (!fs.existsSync(fullPath)) {
      try {
        fs.writeFileSync(fullPath, content);
        console.log(`✓ Created: ${filePath}`);
      } catch (err) {
        console.error(`✗ Error creating ${filePath}: ${err.message}`);
      }
    } else {
      console.log(`⚠ Skipped: ${filePath} (file already exists)`);
    }
  }
};

// Fix import statements in a file
const fixImports = (filePath) => {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");

  // Define import replacements
  const importReplacements = [
    // Update these paths as needed
    {
      from: "import .* from ['\"]../components/common/notification-center['\"]",
      to: 'import NotificationCenter from "../components/common/notification-center"',
    },
    {
      from: "import .* from ['\"]../components/common/cors-warning['\"]",
      to: 'import CorsWarning from "../components/common/cors-warning"',
    },
    {
      from: "import .* from ['\"]../contexts/auth-context['\"]",
      to: 'import { AuthProvider, useAuth, RequireAuth } from "../contexts/auth-context"',
    },
    // Add more replacements as needed
  ];

  let updatedContent = content;
  let replaced = false;

  for (const { from, to } of importReplacements) {
    const regex = new RegExp(from, "g");
    if (regex.test(content)) {
      updatedContent = updatedContent.replace(regex, to);
      replaced = true;
    }
  }

  if (replaced) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✓ Fixed imports in: ${filePath}`);
  }
};

// Run all the reorganization steps
const reorganizeProject = async () => {
  console.log("🔄 Starting project reorganization...\n");

  try {
    // Backup the src directory first
    const backupDir = path.join(ROOT_DIR, `src-backup-${Date.now()}`);
    console.log(
      `📦 Backing up src directory to ${path.relative(ROOT_DIR, backupDir)}...`
    );
    fs.copySync(SRC_DIR, backupDir);
    console.log("✓ Backup complete\n");

    // Create the new directory structure
    createDirectories();

    // Move files to their new locations
    moveFiles();

    // Create placeholder files
    createPlaceholders();

    // Fix imports in key files
    console.log("\nFixing import statements...");
    const filesToFix = [
      "src/App.jsx",
      "src/routes.jsx",
      // Add more files as needed
    ];

    for (const file of filesToFix) {
      fixImports(path.join(ROOT_DIR, file));
    }

    console.log("\n✅ Project reorganization complete!");
    console.log(
      "Please review the changes and run your linting tools to catch any remaining issues."
    );
  } catch (error) {
    console.error("\n❌ Error during reorganization:", error);
    console.log(
      "The src-backup directory contains your original files if needed."
    );
  }
};

// Run the reorganization
reorganizeProject().catch(console.error);
