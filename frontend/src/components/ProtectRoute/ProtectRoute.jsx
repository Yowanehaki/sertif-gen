import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { isTokenValid } from "../../services/adminAuth/tokenValidation.service";

const ProtectedRoute = ({ children }) => {
  const [_, setRerender] = useState(0);

  useEffect(() => {
    const onStorage = () => setRerender(x => x + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const token = localStorage.getItem("token");

  if (!token || !isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;