import React, { useEffect, useState } from 'react';

export default function DeviceTerminal({ apiBase }) {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!apiBase) {
      setDevices([]);
      return;
    }

    fetch(`${apiBase}/api/devices`)
      .then((r) => r.json())
      .then(setDevices)
      .catch(() => setDevices([]));
  }, [apiBase]);

  const handleSend = () => {
    if (!command.trim()) {
      return;
    }

    setHistory((current) => [
      ...current,
      { type: 'command', value: command, timestamp: Date.now() }
    ]);
    setCommand('');
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <p className="panel-label">Device Terminal</p>
          <h2>Remote command console</h2>
        </div>
      </div>

      <div className="panel-note">
        <p>Select a device and execute remote commands. This terminal integrates with backend telemetry and device connection state.</p>
      </div>

      <div className="service-summary">
        <div className="metric-row">
          <span>Selected device</span>
          <strong>{selectedDevice ? selectedDevice.name : 'None'}</strong>
        </div>
      </div>

      <div className="panel">
        <label htmlFor="device-select">Device</label>
        <select
          id="device-select"
          value={selectedDevice?._id || ''}
          onChange={(event) => {
            const found = devices.find((device) => device._id === event.target.value);
            setSelectedDevice(found || null);
          }}
        >
          <option value="">Choose a device</option>
          {devices.map((device) => (
            <option key={device._id} value={device._id}>{device.name}</option>
          ))}
        </select>

        <textarea
          rows={4}
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="Enter a command for the device"
        />

        <button type="button" onClick={handleSend} disabled={!selectedDevice || !command.trim()}>
          Send command
        </button>
      </div>

      <div className="panel">
        <h3>Terminal history</h3>
        {history.length === 0 ? (
          <p>Command history will appear here.</p>
        ) : (
          history.map((entry) => (
            <div key={entry.timestamp} className="service-card">
              <div className="device-header">
                <strong>{entry.type}</strong>
                <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="device-line">{entry.value}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
