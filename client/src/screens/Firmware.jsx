import React, { useEffect, useState } from 'react';

export default function Firmware({ apiBase }) {
  const [firmware, setFirmware] = useState([]);

  useEffect(() => {
    if (!apiBase) {
      setFirmware([]);
      return;
    }

    fetch(`${apiBase}/api/firmware`)
      .then((r) => r.json())
      .then(setFirmware)
      .catch(() => setFirmware([]));
  }, [apiBase]);

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Firmware Manager</p>
          <h2>Asset library</h2>
        </div>
      </div>

      <div className="firmware-list">
        {firmware.length === 0 ? (
          <div className="panel">
            <p>No firmware revisions available. Upload firmware through the backend or sync your repository.</p>
          </div>
        ) : (
          firmware.map((fw) => (
            <div key={fw._id} className="service-card">
              <div className="device-header">
                <strong>{fw.name}</strong>
                <span>v{fw.version}</span>
              </div>
              <div className="device-line">Size: {fw.size || 0} bytes</div>
              <div className="device-line">Checksum: {fw.checksum || 'n/a'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
