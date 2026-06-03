import React, { useEffect, useState } from 'react';

const apiBase = 'http://localhost:4000';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [connectResult, setConnectResult] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${apiBase}/api/devices`)
      .then((r) => r.json())
      .then(setDevices)
      .catch(() => setDevices([]));
  }, []);

  const handleConnect = async (device) => {
    if (!window.api?.connectToDevice) {
      setConnectResult('Device service only available inside Electron.');
      return;
    }

    setLoading(true);
    try {
      const result = await window.api.connectToDevice({
        ipAddress: device.ipAddress,
        port: device.port
      });
      if (result.connected) {
        setConnectResult(`Connected to ${result.remoteAddress}`);
      } else {
        setConnectResult(`Connection failed: ${result.error}`);
      }
    } catch (error) {
      setConnectResult(`Connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Devices</p>
          <h2>Register and test your device connections</h2>
        </div>
      </div>

      <div className="device-list">
        {devices.length === 0 ? (
          <div className="panel">
            <p>No configured devices found. Add a device in the backend or create one here.</p>
          </div>
        ) : (
          devices.map((device) => (
            <div key={device._id} className="device-card">
              <div className="device-header">
                <div>
                  <strong>{device.name}</strong>
                  <p className="device-line">{device.ipAddress}:{device.port}</p>
                </div>
                <button onClick={() => handleConnect(device)} disabled={loading}>
                  {loading ? 'Checking…' : 'Test connection'}
                </button>
              </div>
              <p className="device-notes">MAC: {device.macAddress}</p>
              <p className="device-notes">Status: {device.status || 'disconnected'}</p>
            </div>
          ))
        )}
      </div>

      {connectResult && (
        <div className="panel" style={{ marginTop: '18px' }}>
          <p>{connectResult}</p>
        </div>
      )}
    </div>
  );
}
