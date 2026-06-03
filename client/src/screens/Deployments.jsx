import React, { useEffect, useState } from 'react';

const apiBase = 'http://localhost:4000';

export default function Deployments() {
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    fetch(`${apiBase}/api/deployments`)
      .then((r) => r.json())
      .then(setDeployments)
      .catch(() => setDeployments([]));
  }, []);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Deployments</p>
          <h2>Firmware rollout and live deployment progress</h2>
        </div>
      </div>

      {deployments.length === 0 ? (
        <div className="panel">
          <p>No deployments available yet. Create a deployment from the backend or add a new deployment.</p>
        </div>
      ) : (
        <div className="deployments-list">
          {deployments.map((deployment) => (
            <div key={deployment._id} className="service-card">
              <div className="device-header">
                <strong>{deployment.firmware?.name || 'Unknown firmware'}</strong>
                <span>{deployment.status}</span>
              </div>
              <div className="device-line">Devices: {deployment.devices?.length || 0}</div>
              <div className="device-line">Started: {new Date(deployment.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
