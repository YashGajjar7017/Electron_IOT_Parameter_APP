import React, { useEffect, useState } from 'react';

export default function Groups({ apiBase }) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    if (!apiBase) {
      setGroups([]);
      return;
    }

    fetch(`${apiBase}/api/groups`)
      .then((r) => r.json())
      .then(setGroups)
      .catch(() => setGroups([]));
  }, [apiBase]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Mesh Network</p>
          <h2>Device segmentation</h2>
        </div>
      </div>

      <div className="group-list">
        {groups.length === 0 ? (
          <div className="panel">
            <p>No groups configured yet. Use the backend to define network segments and target devices.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group._id} className="service-card">
              <div className="device-header">
                <strong>{group.name}</strong>
                <span>{group.devices?.length || 0} devices</span>
              </div>
              <p className="device-line">{group.description || 'No description provided.'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
