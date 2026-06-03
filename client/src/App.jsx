import { useEffect, useMemo, useState } from 'react';
import Dashboard from './screens/Dashboard';
import Devices from './screens/Devices';
import Deployments from './screens/Deployments';
import Firmware from './screens/Firmware';
import Groups from './screens/Groups';
import Settings from './screens/Settings';

const apiBase = 'http://localhost:4000';
const navLinks = ['dashboard', 'devices', 'deployments', 'firmware', 'groups', 'settings'];

function App() {
  const [view, setView] = useState('dashboard');
  const [status, setStatus] = useState('Starting...');
  const [services, setServices] = useState({
    deviceCount: 0,
    firmwareCount: 0,
    groupCount: 0,
    deploymentCount: 0,
    updatedAt: ''
  });
  const [lastSync, setLastSync] = useState('Pending');

  const fetchServices = async () => {
    try {
      const response = await fetch(`${apiBase}/api/services`);
      if (!response.ok) {
        throw new Error('Service fetch failed');
      }
      const data = await response.json();
      setServices(data);
      setLastSync(new Date(data.updatedAt || Date.now()).toLocaleTimeString());
      setStatus('Live');
    } catch (error) {
      setStatus('Backend offline');
      setLastSync(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetch(`${apiBase}/api/health`)
      .then((res) => res.json())
      .then((json) => {
        if (json.status === 'ok') {
          setStatus('Backend ready');
        }
      })
      .catch(() => setStatus('Backend not ready'));

    fetchServices();
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentViewTitle = useMemo(
    () => view.charAt(0).toUpperCase() + view.slice(1),
    [view]
  );

  const renderView = () => {
    switch (view) {
      case 'devices':
        return <Devices />;
      case 'deployments':
        return <Deployments />;
      case 'firmware':
        return <Firmware />;
      case 'groups':
        return <Groups />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard services={services} />;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="brand-label">MeshIoT Manager</p>
          <h1>Device Control Center</h1>
          <p className="header-copy">
            Use the sidebar to jump between services, monitor live engine status, and manage devices with glassy controls.
          </p>
        </div>
        <div className="header-status-panel">
          <div className="status-card">
            <span>Service</span>
            <strong>{currentViewTitle}</strong>
          </div>
          <div className="status-card">
            <span>Engine</span>
            <strong>{status}</strong>
          </div>
          <div className="status-card">
            <span>Synced</span>
            <strong>{lastSync}</strong>
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="side-nav">
          <div className="nav-group">
            <h2>Services</h2>
            {navLinks.map((key) => (
              <button
                key={key}
                className={view === key ? 'nav-button active' : 'nav-button'}
                onClick={() => setView(key)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          <div className="service-summary">
            <h3>Live service data</h3>
            <div className="metric-row">
              <span>Devices</span>
              <strong>{services.deviceCount}</strong>
            </div>
            <div className="metric-row">
              <span>Firmware</span>
              <strong>{services.firmwareCount}</strong>
            </div>
            <div className="metric-row">
              <span>Groups</span>
              <strong>{services.groupCount}</strong>
            </div>
            <div className="metric-row">
              <span>Deployments</span>
              <strong>{services.deploymentCount}</strong>
            </div>
          </div>
        </aside>

        <main className="main-center">
          <section className="control-panel">
            <div className="panel-header">
              <div>
                <p className="panel-label">{currentViewTitle}</p>
                <h2>{currentViewTitle} control center</h2>
              </div>
              <div className="panel-chip">All services live</div>
            </div>
            {renderView()}
          </section>
        </main>

        <aside className="info-panel">
          <div className="info-box">
            <h3>Realtime values</h3>
            <p>Service engine metrics are fetched every 5 seconds from the backend.</p>
            <div className="metric-row">
              <span>Last health check</span>
              <strong>{lastSync}</strong>
            </div>
            <div className="metric-row">
              <span>Backend state</span>
              <strong>{status}</strong>
            </div>
            <div className="value-block">
              <p>Control tokens</p>
              <strong>{services.deviceCount + services.firmwareCount + services.groupCount}</strong>
            </div>
            <div className="value-block">
              <p>Active deployments</p>
              <strong>{services.deploymentCount}</strong>
            </div>
          </div>
        </aside>
      </div>

      <footer className="app-footer">
        <span>MeshIoT Manager • Glassy service dashboard</span>
        <span>2026 • Electron + React + Node</span>
      </footer>
    </div>
  );
}

export default App;
