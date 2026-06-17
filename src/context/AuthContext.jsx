import { createContext, useEffect, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/authApi";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser,
} from "../services/tokenService";

export const AuthContext = createContext(null);

function extractPayload(response) {
  return response?.data && typeof response.data === "object"
    ? response.data
    : response;
}

function extractToken(response) {
  const payload = extractPayload(response);
  return payload?.token ?? payload?.access_token ?? payload?.data?.token ?? null;
}

function extractUser(response) {
  const payload = extractPayload(response);
  return payload?.user ?? payload?.data?.user ?? null;
}

function navigateTo(path) {
  if (typeof window === "undefined") return;
  window.location.hash = path;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());

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

  async function login(credentials, options = {}) {
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
      navigateTo("/");
    }

    return { response, token: nextToken, user: nextUser };
  }

  async function register(details, options = {}) {
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
      navigateTo(nextToken ? "/" : "/login");
    }

    return { response, token: nextToken, user: nextUser };
  }

  function logout() {
    removeToken();
    removeUser();
    setTokenState(null);
    setUserState(null);
    navigateTo("/login");
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      register,
      logout,
    }),
    [isAuthenticated, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
