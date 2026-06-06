import React, { useEffect, useState } from 'react';

export default function Logs({ apiBase }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!apiBase) {
      setLogs([]);
      return;
    }

    fetch(`${apiBase}/api/logs`)
      .then((r) => r.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, [apiBase]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Logs</p>
          <h2>Live application events</h2>
        </div>
      </div>

      <div className="panel">
        <div className="deployments-list">
          {logs.length === 0 ? (
            <div className="service-card">
              <p>No log events available. Ensure the backend is running and connected.</p>
            </div>
          ) : (
            logs.map((entry) => (
              <div key={entry.id} className="service-card">
                <div className="device-header">
                  <strong>{entry.level.toUpperCase()}</strong>
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="device-line">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
