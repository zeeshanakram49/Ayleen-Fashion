const TOKEN_KEY = "ayleen_auth_token";
const USER_KEY = "ayleen_auth_user";

function readStorageValue(key) {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function writeStorageValue(key, value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, value);
}

function removeStorageValue(key) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}

export function getToken() {
  return readStorageValue(TOKEN_KEY);
}

export function setToken(token) {
  writeStorageValue(TOKEN_KEY, token);
}

export function removeToken() {
  removeStorageValue(TOKEN_KEY);
}

export function getUser() {
  const storedUser = readStorageValue(USER_KEY);
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    removeUser();
    return null;
  }
}

export function setUser(user) {
  writeStorageValue(USER_KEY, JSON.stringify(user));
}

export function removeUser() {
  removeStorageValue(USER_KEY);
}
