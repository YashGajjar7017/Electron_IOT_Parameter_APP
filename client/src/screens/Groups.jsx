import React, { useEffect, useState } from 'react';

export default function Groups() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/groups')
      .then((r) => r.json())
      .then(setGroups)
      .catch(() => setGroups([]));
  }, []);

  return (
    <div>
      <h2>Groups</h2>
      <p>Device groups and segmentation for fleet deployments.</p>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            {group.name} ({group.devices?.length || 0} devices)
          </li>
        ))}
      </ul>
    </div>
  );
}
