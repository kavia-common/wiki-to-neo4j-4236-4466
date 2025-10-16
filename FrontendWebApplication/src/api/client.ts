import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Centralized API client using Axios with HTTP Basic Auth, configured via environment variables.
 * Handles base URL, headers, and basic error formatting.
 */

// Helpers to read env with CRA-compatible prefix.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";
const API_BASIC_USER = process.env.REACT_APP_API_BASIC_USER || "";
const API_BASIC_PASS = process.env.REACT_APP_API_BASIC_PASS || "";

// Construct Basic Auth header value safely.
const basicAuthHeader =
  API_BASIC_USER && API_BASIC_PASS
    ? "Basic " + btoa(`${API_BASIC_USER}:${API_BASIC_PASS}`)
    : undefined;

const instance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
    ...(basicAuthHeader ? { Authorization: basicAuthHeader } : {}),
  },
  withCredentials: false,
});

/**
 * Normalize errors into a consistent shape for the UI.
 */
function formatError(e: any): { status?: number; error: string; details?: string } {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const data: any = e.response?.data;
    const error = data?.error || e.message || "Request failed";
    const details = data?.details || JSON.stringify(data || {});
    return { status, error, details };
  }
  return { error: String(e) };
}

// PUBLIC_INTERFACE
export async function submitInput(payload: {
  url?: string;
  topic?: string;
}): Promise<{ jobId: string }> {
  /** Submit user input to start a job. Returns a jobId on success. */
  try {
    const res = await instance.post("/api/input", payload);
    return res.data as { jobId: string };
  } catch (e) {
    throw formatError(e);
  }
}

// PUBLIC_INTERFACE
export async function getStatus(jobId: string): Promise<{
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress?: number;
  message?: string;
}> {
  /** Get the current status for a job. */
  try {
    const res = await instance.get(`/api/status/${encodeURIComponent(jobId)}`);
    return res.data;
  } catch (e) {
    throw formatError(e);
  }
}

// PUBLIC_INTERFACE
export async function getGraph(jobId: string): Promise<{
  nodes: any[];
  edges: any[];
}> {
  /** Retrieve graph data (nodes/edges) for a completed job. */
  try {
    const res = await instance.get(`/api/graph/${encodeURIComponent(jobId)}`);
    return res.data;
  } catch (e) {
    throw formatError(e);
  }
}

// PUBLIC_INTERFACE
export async function getErrors(jobId: string): Promise<{
  error: string;
  details?: string;
}> {
  /** Fetch error details for a job. */
  try {
    const res = await instance.get(`/api/errors/${encodeURIComponent(jobId)}`);
    return res.data;
  } catch (e) {
    throw formatError(e);
  }
}

// PUBLIC_INTERFACE
export function getApiConfig(): {
  baseUrl: string;
  hasAuth: boolean;
  userConfigured: boolean;
} {
  /** Return current API client configuration details for debugging/status display. */
  return {
    baseUrl: API_BASE_URL,
    hasAuth: Boolean(basicAuthHeader),
    userConfigured: Boolean(API_BASIC_USER),
  };
}
