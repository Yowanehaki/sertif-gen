import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookieUtils";
import { isTokenValid } from "../../services/adminAuth/tokenValidation.service";

const LoginProtectRoute = ({ children }) => {
  const token = getCookie("token");

  // If user is already logged in and token is valid, redirect to dashboard
  if (token && isTokenValid()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default LoginProtectRoute; 