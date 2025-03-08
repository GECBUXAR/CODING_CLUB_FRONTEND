import React from 'react';

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

export default ForbiddenPage;