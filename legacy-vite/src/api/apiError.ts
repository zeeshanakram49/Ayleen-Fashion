function firstMessageFromErrors(errors: unknown): string {
  if (!errors || typeof errors !== "object") return "";

  const errObj = errors as Record<string, unknown>;

  for (const value of Object.values(errObj)) {
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

export function getApiErrorMessage(error: unknown): string {
  if (!error) return "Something went wrong. Please try again.";

  const errObj = error as Record<string, unknown>;

  // Handle normalized ApiError object directly
  if (typeof errObj.message === "string" && errObj.raw !== undefined) {
    return errObj.message;
  }

  const response = errObj.response as Record<string, unknown> | undefined;
  const data = response?.data as Record<string, unknown> | string | undefined;

  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    if (typeof data.payload === "string") return data.payload;
    if (data.message) return String(data.message);
    if (data.error) return String(data.error);

    const validationMessage = firstMessageFromErrors(data.errors);
    if (validationMessage) return validationMessage;
  }

  if (typeof errObj.message === "string") return errObj.message;

  return "Something went wrong. Please try again.";
}
