import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import isAuthenticated from "./auth.js";

const AuthWrapper = () => {
  const [isValidated, setIsValidated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await isAuthenticated();
      setIsValidated(result);
    };
    checkAuth();
  }, []);

  if (isValidated === null) {
    return <div>Loading...</div>;
  }

  if (!isValidated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AuthWrapper;
