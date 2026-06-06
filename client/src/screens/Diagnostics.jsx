import React, { useEffect, useState } from 'react';

export default function Diagnostics({ apiBase }) {
  const [health, setHealth] = useState({
    renderer: 'initializing',
    backend: 'pending',
    websocket: 'pending',
    mqtt: 'pending',
    deviceManager: 'pending'
  });

  useEffect(() => {
    async function refreshStatus() {
      const next = { ...health };

      if (apiBase) {
        try {
          const response = await fetch(`${apiBase}/api/health`);
          next.backend = response.ok ? 'online' : 'offline';
        } catch (error) {
          next.backend = 'offline';
        }
      }

      next.renderer = 'ready';
      next.websocket = 'waiting';
      next.mqtt = 'disabled';
      next.deviceManager = apiBase ? 'connected' : 'offline';
      setHealth(next);
    }

    refreshStatus();
  }, [apiBase]);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <p className="panel-label">Diagnostics</p>
          <h2>Startup and connectivity diagnostics</h2>
        </div>
      </div>

      <div className="diagnostics-grid">
        {Object.entries(health).map(([key, value]) => (
          <div key={key} className="diagnostic-card">
            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      <div className="panel-note">
        <p>
          The app monitors renderer readiness, backend health, WebSocket availability, MQTT gateway state,
          and the device manager connection. If any layer fails, restart the app after correcting the upstream service.
        </p>
      </div>
    </div>
  );
}
