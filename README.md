# Coding Club Frontend

A modern web application for managing coding club activities, exams, and user interactions. This platform provides a comprehensive solution for educational institutions to manage coding clubs, conduct exams, track student performance, and facilitate learning.

## Overview

The Coding Club Frontend is built with React and uses modern web technologies to provide a responsive and intuitive user interface. It connects to the Coding Club Backend API to fetch and store data.

## Technology Stack

- **React**: A JavaScript library for building user interfaces
- **Vite**: Next-generation frontend tooling for faster development
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **shadcn/ui**: A collection of reusable components built with Radix UI and Tailwind CSS
- **React Router**: For navigation and routing
- **React Query**: For efficient server state management
- **Axios**: For making HTTP requests
- **Sonner**: For toast notifications
- **Lucide React**: For modern icons

## File Structure

The project follows a well-organized structure:

```text
src/
├── assets/               # Static assets
│   ├── images/           # Image files
│   └── icons/            # Icon files
├── components/           # Reusable components
│   ├── auth/             # Authentication components
│   ├── common/           # Shared components
│   ├── dashboard/        # Dashboard components
│   ├── exams/            # Exam-related components
│   ├── layout/           # Layout components (Footer, Container)
│   ├── navigation/       # Navigation components
│   └── ui/               # UI components (buttons, inputs, etc.)
├── contexts/             # React context providers
│   ├── auth-context.jsx  # Authentication context
│   ├── exam-context.jsx  # Exam data context
│   └── ...               # Other contexts
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── admin/            # Admin pages
│   ├── auth/             # Authentication pages
│   ├── common/           # Public pages
│   ├── errors/           # Error pages
│   └── user/             # User pages
├── services/             # API services
├── styles/               # Global styles
├── utils/                # Utility functions
├── App.jsx               # Main App component
├── main.jsx              # Entry point
└── routes.jsx            # Application routes
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Features

- **Role-based Access Control**: Different interfaces and permissions for Students, Admins, and Faculty members
- **User Authentication**: Secure login system with JWT authentication
- **Exam Management**: Create, edit, and manage coding exams with various question types
- **Real-time Evaluation**: Automatic and manual evaluation of exam submissions
- **Performance Analytics**: Detailed performance tracking and visualization for students and administrators
- **Leaderboards**: Competitive rankings to encourage student engagement
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Event Management**: Create and manage coding events, workshops, and competitions
- **Resource Library**: Access to learning materials and documentation

## Contributing

We welcome contributions to the Coding Club Frontend! Here's a quick overview of the contribution process:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For detailed contribution guidelines, please see our [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
