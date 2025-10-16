import React from "react";

type GraphData = {
  nodes: any[];
  edges: any[];
};

type Props = {
  graph?: GraphData | null;
  isLoading?: boolean;
  errorText?: string | null;
};

// PUBLIC_INTERFACE
export default function GraphView({ graph, isLoading, errorText }: Props) {
  /** Basic placeholder visualization of graph nodes and edges. */
  return (
    <div className="card">
      <h2 className="card-title">Graph Visualization</h2>
      {isLoading && <p>Loading graph...</p>}
      {errorText && <div className="alert">{errorText}</div>}
      {!isLoading && !errorText && graph && (
        <div className="graph-grid">
          <div>
            <h3>Nodes ({graph.nodes.length})</h3>
            <ul className="list">
              {graph.nodes.slice(0, 50).map((n, idx) => (
                <li key={idx}>
                  <code>{JSON.stringify(n)}</code>
                </li>
              ))}
            </ul>
            {graph.nodes.length > 50 && (
              <p className="muted">Showing first 50 nodes...</p>
            )}
          </div>
          <div>
            <h3>Edges ({graph.edges.length})</h3>
            <ul className="list">
              {graph.edges.slice(0, 50).map((e, idx) => (
                <li key={idx}>
                  <code>{JSON.stringify(e)}</code>
                </li>
              ))}
            </ul>
            {graph.edges.length > 50 && (
              <p className="muted">Showing first 50 edges...</p>
            )}
          </div>
        </div>
      )}
      {!isLoading && !errorText && !graph && (
        <p className="muted">No graph to display yet.</p>
      )}
    </div>
  );
}
