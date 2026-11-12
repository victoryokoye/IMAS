import axios from "axios";

export interface AppError {
  message: string;
  status?: number;
  /** field name -> message, from the API's `errors` array */
  fieldErrors: Record<string, string>;
  isNetwork: boolean;
}

interface ErrorBody {
  message?: string;
  errors?: { field: string; message: string }[];
  // tolerate the alternative shape from the implementation guide
  error?: { message?: string; details?: unknown };
}

const FALLBACKS: Record<number, string> = {
  400: "The request was not valid. Check the form and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested record was not found.",
  409: "This action conflicts with the current state of the record.",
  422: "Some of the submitted values are not valid.",
  500: "The server hit an unexpected error. Try again shortly.",
};

export function toAppError(err: unknown): AppError {
  if (axios.isAxiosError<ErrorBody>(err)) {
    if (err.response) {
      const { status, data } = err.response;
      const fieldErrors: Record<string, string> = {};
      if (Array.isArray(data?.errors)) {
        data?.errors?.forEach((e) => {
          if (e?.field && !fieldErrors[e.field])
            fieldErrors[e.field] = e.message;
        });
      }

      return {
        message:
          data?.message ??
          data?.error?.message ??
          FALLBACKS[status] ??
          "Something went wrong. Please try again.",
        status,
        fieldErrors,
        isNetwork: false,
      };
    }
    if (err.code === "ECONNABORTED") {
      return {
        message:
          "The server took too long to respond. It may be waking up, so try again in a moment.",
        fieldErrors: {},
        isNetwork: true,
      };
    }
    return {
      message: "Cannot reach the server. Check your connection and try again.",
      fieldErrors: {},
      isNetwork: true,
    };
  }
  return {
    message: err instanceof Error ? err.message : "Something went wrong.",
    fieldErrors: {},
    isNetwork: false,
  };
}
