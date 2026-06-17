function firstMessageFromErrors(errors) {
  if (!errors || typeof errors !== "object") return "";

  for (const value of Object.values(errors)) {
    if (Array.isArray(value) && value.length > 0) {
      return String(value[0]);
    }

    if (typeof value === "string") {
      return value;
    }

    if (value && typeof value === "object") {
      const nestedMessage = firstMessageFromErrors(value);
      if (nestedMessage) return nestedMessage;
    }
  }

  return "";
}

export function getApiErrorMessage(error) {
  const data = error?.response?.data;

  if (typeof data === "string") return data;
  if (data?.message) return String(data.message);
  if (data?.error) return String(data.error);

  const validationMessage = firstMessageFromErrors(data?.errors);
  if (validationMessage) return validationMessage;

  if (error?.message) return String(error.message);

  return "Something went wrong. Please try again.";
}
