import React, { useEffect, useState } from 'react';

export default function Deployments({ apiBase }) {
  const [deployments, setDeployments] = useState([]);

  useEffect(() => {
    if (!apiBase) {
      setDeployments([]);
      return;
    }

    fetch(`${apiBase}/api/deployments`)
      .then((r) => r.json())
      .then(setDeployments)
      .catch(() => setDeployments([]));
  }, [apiBase]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">OTA Center</p>
          <h2>Deployment orchestration</h2>
        </div>
      </div>

      {deployments.length === 0 ? (
        <div className="panel">
          <p>No deployments configured yet. Start a firmware rollout from the firmware manager or backend configuration.</p>
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
