import React from 'react';

export default function Dashboard({ services }) {
  return (
    <div className="dashboard-grid">
      <div className="panel">
        <h2>Service Overview</h2>
        <p>Home dashboard for the mesh engine and live service summary.</p>
        <div className="service-summary">
          <div className="metric-row">
            <span>Connected devices</span>
            <strong>{services.deviceCount}</strong>
          </div>
          <div className="metric-row">
            <span>Firmware versions</span>
            <strong>{services.firmwareCount}</strong>
          </div>
          <div className="metric-row">
            <span>Device groups</span>
            <strong>{services.groupCount}</strong>
          </div>
          <div className="metric-row">
            <span>Deployments queued</span>
            <strong>{services.deploymentCount}</strong>
          </div>
        </div>
      </div>

      <div className="panel">
        <h2>Ready to manage</h2>
        <p>
          Use the left side navigation to open any service page. The quick panel on the right
          shows the latest service values and realtime engine state.
        </p>
      </div>
    </div>
  );
}
