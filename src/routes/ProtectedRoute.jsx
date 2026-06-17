import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.hash = "/login";
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return children;
}
