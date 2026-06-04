import { Navigate, useLocation } from 'react-router-dom';

const AuthWrapper = ({ isAuthenticated }) => {
  // Optional: Save the current location to redirect back after login
  const location = useLocation();
  
  if (isAuthenticated) {
    // Redirect to dashboard or register if preferred for logged-in users
    return <Navigate to="/chat" replace />; 
  }
  
  return <Navigate to="/register" replace />;
};

export default AuthWrapper;