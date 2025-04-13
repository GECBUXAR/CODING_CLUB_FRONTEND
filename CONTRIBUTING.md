# Contributing to Coding Club Frontend

Thank you for considering contributing to the Coding Club Frontend! This document provides detailed guidelines to help you contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Submitting Changes](#submitting-changes)
- [Pull Request Process](#pull-request-process)
- [Additional Resources](#additional-resources)

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/CODING_CLUB_FRONTEND.git
   cd CODING_CLUB_FRONTEND
   ```
3. Add the original repository as a remote:
   ```bash
   git remote add upstream https://github.com/GECBUXAR/CODING_CLUB_FRONTEND.git
   ```
4. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-you-are-fixing
   ```
2. Make your changes
3. Test your changes thoroughly
4. Commit your changes with clear, descriptive commit messages
5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a Pull Request from your fork to the main repository

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Add comments for complex logic

### React Components

- Use functional components with hooks
- Keep components small and focused
- Follow the component naming convention (PascalCase)
- Place components in the appropriate directory based on their purpose
- Use TypeScript interfaces or PropTypes for prop validation

### File Organization

- Place new components in the appropriate directory under `src/components/`
- Create new pages in the appropriate directory under `src/pages/`
- Add new services in `src/services/`
- Add new utilities in `src/utils/`

### State Management

- Use React Context for global state management
- Keep state as local as possible
- Use React Query for server state management
- Create custom hooks for reusable state logic

### Styling

- Use Tailwind CSS for styling
- Follow the existing design system
- Use the shadcn/ui component library for consistent UI elements
- Make sure your UI is responsive and works on all screen sizes

## Submitting Changes

### Commit Messages

Write clear, concise commit messages that explain the changes you've made:

```
feat: Add user performance dashboard

- Add performance metrics visualization
- Implement filtering by date range
- Add export functionality
```

Use prefixes like:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for maintenance tasks

### Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Test your changes in different browsers if applicable
- Test for accessibility

## Pull Request Process

1. Update the README.md or documentation with details of changes if needed
2. Make sure your code follows the coding standards
3. Ensure all tests pass
4. Fill in the PR template with all required information
5. Request a review from maintainers
6. Address any feedback from reviewers
7. Once approved, your PR will be merged

### PR Template

When creating a PR, please include:

- A clear description of the changes
- The motivation for the changes
- Any relevant screenshots or GIFs for UI changes
- References to related issues
- Any potential concerns or areas that need special attention

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/guide/)

Thank you for contributing to the Coding Club Frontend!
