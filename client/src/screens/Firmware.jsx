import React, { useEffect, useState } from 'react';

export default function Firmware() {
  const [firmware, setFirmware] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/firmware')
      .then((r) => r.json())
      .then(setFirmware)
      .catch(() => setFirmware([]));
  }, []);

  return (
    <div>
      <h2>Firmware Library</h2>
      <p>Store and manage firmware release assets.</p>
      <ul>
        {firmware.map((fw) => (
          <li key={fw._id}>
            {fw.name} v{fw.version} ({fw.size || 0} bytes)
          </li>
        ))}
      </ul>
    </div>
  );
}
