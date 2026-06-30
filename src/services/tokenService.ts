import type { User } from "../api/apiTypes";

const TOKEN_KEY = "ayleen_auth_token";
const USER_KEY = "ayleen_auth_user";

function readStorageValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function writeStorageValue(key: string, value: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function removeStorageValue(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function getToken(): string | null {
  return readStorageValue(TOKEN_KEY);
}

export function setToken(token: string): void {
  writeStorageValue(TOKEN_KEY, token);
}

export function removeToken(): void {
  removeStorageValue(TOKEN_KEY);
}

export function getUser(): User | null {
  const storedUser = readStorageValue(USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    removeUser();
    return null;
  }
}

export function setUser(user: User): void {
  writeStorageValue(USER_KEY, JSON.stringify(user));
}

export function removeUser(): void {
  removeStorageValue(USER_KEY);
}
