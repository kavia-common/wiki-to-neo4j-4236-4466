import React, { useCallback, useEffect, useRef, useState } from "react";
import InputForm from "../components/InputForm";
import StatusPanel from "../components/StatusPanel";
import GraphView from "../components/GraphView";
import { submitInput, getStatus, getGraph, getErrors } from "../api/client";

// PUBLIC_INTERFACE
export default function Home() {
  /** Main page: input submission, job lifecycle, polling, and visualization. */
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "processing" | "completed" | "failed" | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [graph, setGraph] = useState<{ nodes: any[]; edges: any[] } | null>(null);
  const [graphLoading, setGraphLoading] = useState(false);
  const [graphError, setGraphError] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ error: string; details?: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [polling, setPolling] = useState(false);
  const pollTimer = useRef<number | null>(null);

  const clearTimer = () => {
    if (pollTimer.current) {
      window.clearTimeout(pollTimer.current);
      pollTimer.current = null;
    }
  };

  const startPolling = useCallback(() => {
    setPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setPolling(false);
  }, []);

  const scheduleNextPoll = useCallback(() => {
    clearTimer();
    pollTimer.current = window.setTimeout(async () => {
      if (!jobId) return;
      try {
        const data = await getStatus(jobId);
        setStatus(data.status);
        setProgress(typeof data.progress === "number" ? data.progress : null);
        setMessage(data.message || null);

        if (data.status === "completed") {
          // Stop polling and fetch graph
          setPolling(false);
          setGraphLoading(true);
          setGraphError(null);
          try {
            const g = await getGraph(jobId);
            setGraph(g);
          } catch (e: any) {
            setGraphError(e?.error || "Failed to load graph.");
          } finally {
            setGraphLoading(false);
          }
        } else if (data.status === "failed") {
          // Stop polling and fetch errors
          setPolling(false);
          try {
            const err = await getErrors(jobId);
            setErrors(err);
          } catch (e: any) {
            setErrors({ error: e?.error || "Failed to fetch error details." });
          }
        } else {
          // keep polling
          if (polling) {
            scheduleNextPoll();
          }
        }
      } catch (e: any) {
        // Stop polling on critical error
        setPolling(false);
        setMessage(e?.error || "An error occurred while fetching status.");
      }
    }, 1500);
  }, [jobId, polling]);

  useEffect(() => {
    if (polling && jobId) {
      scheduleNextPoll();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [polling, jobId, scheduleNextPoll]);

  const handleSubmit = async (payload: { url?: string; topic?: string }) => {
    setSubmitting(true);
    setErrors(null);
    setGraph(null);
    setGraphError(null);
    setMessage(null);
    setProgress(null);
    setStatus(null);
    try {
      const res = await submitInput(payload);
      setJobId(res.jobId);
      setStatus("pending");
      setPolling(true);
    } catch (e: any) {
      setErrors({ error: e?.error || "Failed to submit input.", details: e?.details });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePolling = () => {
    setPolling((p) => !p);
  };

  const handleFetchErrors = async () => {
    if (!jobId) return;
    try {
      const err = await getErrors(jobId);
      setErrors(err);
    } catch (e: any) {
      setErrors({ error: e?.error || "Failed to fetch error details." });
    }
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="brand">Wiki → Neo4j</div>
      </header>

      <main className="grid-2">
        <section>
          <InputForm onSubmit={handleSubmit} isSubmitting={submitting} />
          {errors && (
            <div className="card">
              <h2 className="card-title">Errors</h2>
              <div className="alert">
                <div><strong>{errors.error}</strong></div>
                {errors.details && <pre className="pre">{errors.details}</pre>}
              </div>
            </div>
          )}
          <StatusPanel
            jobId={jobId}
            status={status}
            progress={progress ?? null}
            message={message}
            isPolling={polling}
            onTogglePolling={handleTogglePolling}
            onFetchErrors={handleFetchErrors}
          />
        </section>

        <section>
          <GraphView graph={graph} isLoading={graphLoading} errorText={graphError} />
        </section>
      </main>

      <footer className="footer">
        <span className="muted">
          Configure API env vars in .env and restart the dev server.
        </span>
      </footer>
    </div>
  );
}
