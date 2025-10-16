import React from "react";

type Props = {
  jobId?: string | null;
  status?: "pending" | "processing" | "completed" | "failed" | null;
  progress?: number | null;
  message?: string | null;
  isPolling: boolean;
  onTogglePolling: () => void;
  onFetchErrors?: () => void;
};

// PUBLIC_INTERFACE
export default function StatusPanel({
  jobId,
  status,
  progress,
  message,
  isPolling,
  onTogglePolling,
  onFetchErrors,
}: Props) {
  /** Shows current job status and manual controls for polling and error retrieval. */
  return (
    <div className="card">
      <h2 className="card-title">Job Status</h2>
      {!jobId ? (
        <p className="muted">No job started yet.</p>
      ) : (
        <>
          <div className="status-row">
            <span className="label">Job ID:</span>
            <span className="value code">{jobId}</span>
          </div>
          <div className="status-row">
            <span className="label">Status:</span>
            <span className={`badge ${status}`}>{status}</span>
          </div>
          <div className="status-row">
            <span className="label">Progress:</span>
            <span className="value">
              {typeof progress === "number" ? `${Math.round(progress * 100)}%` : "N/A"}
            </span>
          </div>
          {message && (
            <div className="status-row">
              <span className="label">Message:</span>
              <span className="value">{message}</span>
            </div>
          )}

          <div className="actions">
            <button className="btn" onClick={onTogglePolling}>
              {isPolling ? "Stop Polling" : "Start Polling"}
            </button>
            {onFetchErrors && (
              <button className="btn btn-secondary" onClick={onFetchErrors}>
                Fetch Errors
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
