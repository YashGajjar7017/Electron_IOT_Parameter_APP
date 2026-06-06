import React, { useEffect, useMemo, useState } from 'react';

export default function LiveMonitor({ apiBase }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (!apiBase) {
      setDevices([]);
      return;
    }

    fetch(`${apiBase}/api/devices`)
      .then((r) => r.json())
      .then(setDevices)
      .catch(() => setDevices([]));
  }, [apiBase]);

  const summary = useMemo(() => {
    const ready = devices.filter((device) => device.status === 'ready').length;
    const online = devices.filter((device) => device.status === 'connected' || device.status === 'ready').length;
    const errors = devices.filter((device) => device.status === 'error').length;
    return { total: devices.length, ready, online, errors };
  }, [devices]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Live Monitor</p>
          <h2>Realtime fleet health</h2>
        </div>
      </div>

      <div className="service-summary">
        <div className="metric-row">
          <span>Total devices</span>
          <strong>{summary.total}</strong>
        </div>
        <div className="metric-row">
          <span>Ready</span>
          <strong>{summary.ready}</strong>
        </div>
        <div className="metric-row">
          <span>Online</span>
          <strong>{summary.online}</strong>
        </div>
        <div className="metric-row">
          <span>Errors</span>
          <strong>{summary.errors}</strong>
        </div>
      </div>

      <div className="device-list">
        {devices.map((device) => (
          <div key={device._id} className="device-card">
            <div className="device-header">
              <div>
                <strong>{device.name}</strong>
                <p className="device-line">{device.ipAddress}:{device.port}</p>
              </div>
              <span>{device.status || 'offline'}</span>
            </div>
            <p className="device-notes">MAC: {device.macAddress}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
