import React, { useEffect, useState } from 'react';

export default function Devices() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/devices')
      .then((r) => r.json())
      .then(setDevices)
      .catch(() => setDevices([]));
  }, []);

  return (
    <div>
      <h2>Devices</h2>
      <p>Saved devices:</p>
      <ul>
        {devices.map((d) => (
          <li key={d._id}>{d.name} — {d.ipAddress}:{d.port}</li>
        ))}
      </ul>
    </div>
  );
}
