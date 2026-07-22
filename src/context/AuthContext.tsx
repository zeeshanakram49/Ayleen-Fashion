import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { fetchCurrentUser, loginUser, registerUser } from "../api/authApi";
import { APP_ROUTES } from "../routes/appRoutes";
import { navigateToHash } from "../routes/routeUtils";
import { AuthContext } from "./authContextValue";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser,
} from "../services/tokenService";
import type { User } from "../api/apiTypes";
import type { AuthContextType } from "./authContextValue";

function extractPayload(response: unknown): Record<string, unknown> | null {
  if (response && typeof response === "object") {
    const resObj = response as Record<string, unknown>;
    if (resObj.payload && typeof resObj.payload === "object") {
      return resObj.payload as Record<string, unknown>;
    }
    if (resObj.data && typeof resObj.data === "object") {
      return resObj.data as Record<string, unknown>;
    }
    return resObj;
  }
  return null;
}

function extractToken(response: unknown): string | null {
  const payload = extractPayload(response);
  if (!payload) return null;
  
  const token = payload.token ?? payload.access_token;
  if (typeof token === "string") return token;

  const nestedPayload = (payload.data ?? payload.payload) as
    | Record<string, unknown>
    | undefined;
  if (nestedPayload) {
    const nestedToken = nestedPayload.token ?? nestedPayload.access_token;
    if (typeof nestedToken === "string") return nestedToken;
  }

  return null;
}

function extractUser(response: unknown): User | null {
  const payload = extractPayload(response);
  if (!payload) return null;

  const user = payload.user;
  if (user && typeof user === "object") {
    return user as User;
  }

  const nestedPayload = (payload.data ?? payload.payload) as
    | Record<string, unknown>
    | undefined;
  if (
    nestedPayload &&
    nestedPayload.user &&
    typeof nestedPayload.user === "object"
  ) {
    return nestedPayload.user as User;
  }

  return null;
}

function navigateTo(path: string) {
  navigateToHash(path);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => getToken());
  const [user, setUserState] = useState<User | null>(() => getUser());

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    function handleUnauthorized() {
      setTokenState(null);
      setUserState(null);
    }

    window.addEventListener("ayleen:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("ayleen:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    if (!token) return;
    if (user) return;

    let active = true;
    async function loadProfile() {
      try {
        const response = await fetchCurrentUser();
        const nextUser = response.payload ?? response.data ?? null;
        if (!active || !nextUser) return;
        setUser(nextUser);
        setUserState(nextUser);
      } catch {
        removeToken();
        removeUser();
        if (!active) return;
        setTokenState(null);
        setUserState(null);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [token, user]);

  async function login(credentials: Record<string, string>, options: { redirect?: boolean } = {}) {
    const response = await loginUser(credentials);
    const nextToken = extractToken(response);
    const nextUser = extractUser(response);

    if (nextToken) {
      setToken(nextToken);
      setTokenState(nextToken);
    }

    if (nextUser) {
      setUser(nextUser);
      setUserState(nextUser);
    }

    if (options.redirect !== false) {
      navigateTo(APP_ROUTES.home);
    }

    return { response, token: nextToken, user: nextUser };
  }

  async function register(details: Record<string, string>, options: { redirect?: boolean } = {}) {
    const response = await registerUser(details);
    const nextToken = extractToken(response);
    const nextUser = extractUser(response);

    if (nextToken) {
      setToken(nextToken);
      setTokenState(nextToken);
    }

    if (nextUser) {
      setUser(nextUser);
      setUserState(nextUser);
    }

    if (options.redirect !== false) {
      navigateTo(nextToken ? APP_ROUTES.home : APP_ROUTES.login);
    }

    return { response, token: nextToken, user: nextUser };
  }

  function logout() {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
    navigateTo(APP_ROUTES.login);
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [isAuthenticated, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
