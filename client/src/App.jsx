import { useEffect, useState } from 'react';
import Dashboard from './screens/Dashboard';
import Devices from './screens/Devices';
import Deployments from './screens/Deployments';
import Firmware from './screens/Firmware';
import Groups from './screens/Groups';
import Settings from './screens/Settings';

const apiBase = 'http://localhost:4000';

function App() {
  const [view, setView] = useState('dashboard');
  const [status, setStatus] = useState('Ready');

  useEffect(() => {
    fetch(`${apiBase}/api/health`) // warm backend
      .catch(() => setStatus('Backend not ready.'));
  }, []);

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
        return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>MeshIoT Manager</h1>
          <p>Glassy desktop dashboard for devices, firmware, and deployments.</p>
        </div>
        <div className="status-box">{status}</div>
      </header>

      <nav className="nav-bar">
        {['dashboard', 'devices', 'deployments', 'firmware', 'groups', 'settings'].map((key) => (
          <button
            key={key}
            className={view === key ? 'nav-button active' : 'nav-button'}
            onClick={() => setView(key)}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </button>
        ))}
      </nav>

      <main className="content-panel">{renderView()}</main>
    </div>
  );
}

export default App;
