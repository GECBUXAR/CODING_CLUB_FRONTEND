# Optimized Context API Implementation

This directory contains the context providers for the Coding Club application. We've implemented an optimized context pattern to improve performance and reduce unnecessary re-renders.

## Context Optimization Pattern

The optimized context pattern follows these principles:

1. **Context Splitting**: Separate state and actions into different contexts to prevent unnecessary re-renders
2. **Memoization**: Use `useMemo` and `useCallback` to memoize values and functions
3. **Selective Updates**: Components can subscribe to only the parts of the context they need

## Available Contexts

### 1. Auth Context
- `optimized-auth-context.jsx`: Handles user authentication, login, logout, and session management

### 2. Notification Context
- `optimized-notification-context.jsx`: Manages application notifications and alerts

### 3. Exam Context
- `optimized-exam-context.jsx`: Handles exam data, questions, and submissions

### 4. Event Context
- `optimized-event-context.jsx`: Manages event data and user enrollments

### 5. Response Evaluation Context
- `optimized-response-evaluation-context.jsx`: Handles exam response evaluation and grading

### 6. Faculty Context
- Located in `components/faculty/OptimizedFacultyContext.jsx`: Manages faculty data

## Usage Examples

### Basic Usage

```jsx
import { useNotification } from "@/contexts/optimized-notification-context";

function MyComponent() {
  const { success, error } = useNotification();
  
  const handleAction = () => {
    try {
      // Do something
      success("Action completed successfully");
    } catch (err) {
      error("Action failed: " + err.message);
    }
  };
  
  return <button onClick={handleAction}>Perform Action</button>;
}
```

### Selective State Access

```jsx
import { useExamState, useExamActions } from "@/contexts/optimized-exam-context";

function ExamList() {
  // Only re-render when exams or loading state changes
  const { exams, loading } = useExamState();
  const { fetchExams } = useExamActions();
  
  useEffect(() => {
    fetchExams();
  }, [fetchExams]);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {exams.map(exam => (
        <li key={exam.id}>{exam.title}</li>
      ))}
    </ul>
  );
}
```

### Backward Compatibility

For backward compatibility, we provide combined hooks that merge state and actions:

```jsx
import { useAuth } from "@/contexts/optimized-auth-context";

function ProfileButton() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Performance Benefits

- **Reduced Re-renders**: Components only re-render when the specific state they use changes
- **Memoized Functions**: Action functions are memoized to prevent unnecessary re-renders
- **Optimized Context Creation**: Context values are memoized to prevent unnecessary re-renders
- **Selective Subscription**: Components can subscribe to only the parts of the context they need

## Migration Guide

When migrating from the old context pattern to the optimized pattern:

1. Replace imports:
   ```jsx
   // Old
   import { useAuth } from "@/contexts/auth-context";
   
   // New
   import { useAuth } from "@/contexts/optimized-auth-context";
   ```

2. For more granular control, use the split hooks:
   ```jsx
   // Old
   const { user, login } = useAuth();
   
   // New - more efficient
   const { user } = useAuthState();
   const { login } = useAuthActions();
   ```
