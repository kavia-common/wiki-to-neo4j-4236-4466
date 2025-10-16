import React, { useState } from "react";
import { isNonEmptyString, isValidUrl } from "../utils/validators";

type Props = {
  onSubmit: (data: { url?: string; topic?: string }) => void;
  isSubmitting?: boolean;
};

type Errors = {
  url?: string;
  topic?: string;
  form?: string;
};

// PUBLIC_INTERFACE
export default function InputForm({ onSubmit, isSubmitting }: Props) {
  /** Input form for URL or Topic with validation (at least one required). */
  const [url, setUrl] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!isNonEmptyString(url) && !isNonEmptyString(topic)) {
      newErrors.form = "Please provide a valid URL or a Topic.";
    }

    if (isNonEmptyString(url) && !isValidUrl(url)) {
      newErrors.url = "Please enter a valid URL (http(s)://...).";
    }

    if (isNonEmptyString(topic) && topic.trim().length < 2) {
      newErrors.topic = "Topic should be at least 2 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload: { url?: string; topic?: string } = {};
    if (isNonEmptyString(url)) payload.url = url.trim();
    if (isNonEmptyString(topic)) payload.topic = topic.trim();
    onSubmit(payload);
  };

  return (
    <form className="card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Submit Wikipedia Input</h2>
      <p className="muted">
        Provide either a full Wikipedia page URL or a topic name. At least one is required.
      </p>

      {errors.form && <div className="alert">{errors.form}</div>}

      <div className="form-group">
        <label htmlFor="url">Wikipedia URL</label>
        <input
          id="url"
          type="url"
          className={errors.url ? "input error" : "input"}
          placeholder="https://en.wikipedia.org/wiki/Graph"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        {errors.url && <div className="error-text">{errors.url}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="topic">Or Topic</label>
        <input
          id="topic"
          type="text"
          className={errors.topic ? "input error" : "input"}
          placeholder="e.g., Knowledge graph"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        {errors.topic && <div className="error-text">{errors.topic}</div>}
      </div>

      <div className="actions">
        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
