import { createContext } from "react";
import type { User } from "../api/apiTypes";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    credentials: Record<string, string>,
    options?: { redirect?: boolean },
  ) => Promise<{ response: unknown; token: string | null; user: User | null }>;
  register: (
    details: Record<string, string>,
    options?: { redirect?: boolean },
  ) => Promise<{ response: unknown; token: string | null; user: User | null }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
