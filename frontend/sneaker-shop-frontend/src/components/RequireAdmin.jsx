import { Navigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function RequireAdmin({ children }) {
  const user = authService.getCurrentUser();
  if (!user || !user.roles || !user.roles.includes("ROLE_ADMIN")) {
    return <Navigate to="/" replace />;
  }
  return children;
} 