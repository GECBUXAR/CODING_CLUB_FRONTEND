# Coding Club Frontend

A modern web application for managing coding club activities, exams, and user interactions.

## File Structure

The project follows a well-organized structure:

```
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

## Test Accounts

For development and testing purposes, you can use the following test accounts:

| Role    | Email            | Password    |
|---------|------------------|-------------|
| User    | user@test.com    | password123 |
| Admin   | admin@test.com   | admin123    |
| Faculty | faculty@test.com | faculty123  |

These accounts are automatically available in development mode and can be used to test different user roles and permissions throughout the application.

## Features

- Role-based access control (Student, Admin, Faculty)
- User authentication with a unified login system
- Exam management
- User progress tracking
- Responsive design

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
