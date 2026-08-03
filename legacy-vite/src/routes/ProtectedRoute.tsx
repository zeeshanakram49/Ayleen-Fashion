import { useEffect, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "./appRoutes";
import { navigateToHash } from "./routeUtils";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigateToHash(APP_ROUTES.login);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return children;
}
