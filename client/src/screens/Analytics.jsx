import React, { useEffect, useState } from 'react';

export default function Analytics({ apiBase }) {
  const [stats, setStats] = useState({
    deviceCount: 0,
    firmwareCount: 0,
    groupCount: 0,
    deploymentCount: 0,
    updatedAt: ''
  });

  useEffect(() => {
    if (!apiBase) {
      setStats({ deviceCount: 0, firmwareCount: 0, groupCount: 0, deploymentCount: 0, updatedAt: '' });
      return;
    }

    fetch(`${apiBase}/api/services`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => setStats({ deviceCount: 0, firmwareCount: 0, groupCount: 0, deploymentCount: 0, updatedAt: '' }));
  }, [apiBase]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Analytics</p>
          <h2>Fleet insights</h2>
        </div>
      </div>

      <div className="service-summary">
        <div className="metric-row">
          <span>Total devices</span>
          <strong>{stats.deviceCount}</strong>
        </div>
        <div className="metric-row">
          <span>Active firmware</span>
          <strong>{stats.firmwareCount}</strong>
        </div>
        <div className="metric-row">
          <span>Network groups</span>
          <strong>{stats.groupCount}</strong>
        </div>
        <div className="metric-row">
          <span>Deployments</span>
          <strong>{stats.deploymentCount}</strong>
        </div>
      </div>

      <div className="panel-note">
        <p>Use this view to track fleet size, deployment cadence, and availability trends from the backend aggregation service.</p>
      </div>
    </div>
  );
}
