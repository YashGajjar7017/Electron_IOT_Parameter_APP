import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Airplay,
  BarChart3,
  Cloud,
  Layers,
  Monitor,
  Server,
  Settings2,
  ShieldCheck,
  Terminal,
  BookOpen,
  Pulse
} from 'lucide-react';
import Dashboard from './screens/Dashboard';
import Devices from './screens/Devices';
import Deployments from './screens/Deployments';
import Firmware from './screens/Firmware';
import Groups from './screens/Groups';
import Settings from './screens/Settings';
import Diagnostics from './screens/Diagnostics';
import LiveMonitor from './screens/LiveMonitor';
import Logs from './screens/Logs';
import Analytics from './screens/Analytics';
import DeviceTerminal from './screens/DeviceTerminal';

const navLinks = [
  { key: 'dashboard', label: 'Dashboard', icon: Monitor },
  { key: 'devices', label: 'Devices', icon: Server },
  { key: 'live-monitor', label: 'Live Monitor', icon: Pulse },
  { key: 'deployments', label: 'OTA Center', icon: Cloud },
  { key: 'firmware', label: 'Firmware Manager', icon: Airplay },
  { key: 'groups', label: 'Mesh Network', icon: Layers },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'logs', label: 'Logs', icon: BookOpen },
  { key: 'device-terminal', label: 'Device Terminal', icon: Terminal },
  { key: 'diagnostics', label: 'Diagnostics', icon: ShieldCheck },
  { key: 'settings', label: 'Settings', icon: Settings2 }
];

const initialServices = {
  deviceCount: 0,
  firmwareCount: 0,
  groupCount: 0,
  deploymentCount: 0,
  updatedAt: ''
};

function App() {
  const [view, setView] = useState('dashboard');
  const [status, setStatus] = useState('Initializing');
  const [apiBase, setApiBase] = useState('http://127.0.0.1:4000');
  const [services, setServices] = useState(initialServices);
  const [lastSync, setLastSync] = useState('Pending');
  const [startupStatus, setStartupStatus] = useState({
    renderer: 'pending',
    backend: 'pending',
    websocket: 'pending',
    mqtt: 'pending'
  });

  useEffect(() => {
    if (window.api?.getBackendUrl) {
      window.api
        .getBackendUrl()
        .then((url) => setApiBase(url))
        .catch(() => {
          setApiBase('http://127.0.0.1:4000');
        });
    }

    if (window.api?.getMetadata) {
      window.api.getMetadata().then((metadata) => {
        setStartupStatus((current) => ({
          ...current,
          renderer: metadata.rendererUrl ? 'ready' : 'pending'
        }));
      });
    }
  }, []);

  useEffect(() => {
    async function refreshHealth() {
      try {
        const response = await fetch(`${apiBase}/api/health`);
        const json = await response.json();
        if (response.ok && json.status === 'ok') {
          setStatus('Backend ready');
          setStartupStatus((current) => ({ ...current, backend: 'online', websocket: 'waiting', mqtt: 'disabled' }));
        } else {
          throw new Error('Unhealthy backend');
        }
      } catch (error) {
        setStatus('Backend offline');
        setStartupStatus((current) => ({ ...current, backend: 'offline' }));
      }
      setLastSync(new Date().toLocaleTimeString());
    }

    refreshHealth();
    const interval = setInterval(refreshHealth, 5000);
    return () => clearInterval(interval);
  }, [apiBase]);

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(`${apiBase}/api/services`);
        if (!response.ok) {
          throw new Error('Service load failed');
        }
        const data = await response.json();
        setServices(data);
        setLastSync(new Date(data.updatedAt || Date.now()).toLocaleTimeString());
        setStatus('Live');
      } catch (_) {
        setStatus('Backend offline');
      }
    }

    fetchServices();
    const interval = setInterval(fetchServices, 5000);
    return () => clearInterval(interval);
  }, [apiBase]);

  const currentViewTitle = useMemo(
    () => navLinks.find((item) => item.key === view)?.label || 'Dashboard',
    [view]
  );

  const renderView = () => {
    switch (view) {
      case 'devices':
        return <Devices apiBase={apiBase} />;
      case 'live-monitor':
        return <LiveMonitor apiBase={apiBase} />;
      case 'deployments':
        return <Deployments apiBase={apiBase} />;
      case 'firmware':
        return <Firmware apiBase={apiBase} />;
      case 'groups':
        return <Groups apiBase={apiBase} />;
      case 'analytics':
        return <Analytics apiBase={apiBase} />;
      case 'logs':
        return <Logs apiBase={apiBase} />;
      case 'device-terminal':
        return <DeviceTerminal apiBase={apiBase} />;
      case 'diagnostics':
        return <Diagnostics apiBase={apiBase} />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard services={services} />;
    }
  };

  return (
    <div className="app-shell">
      <header className="app-header glass-panel">
        <div className="brand-block">
          <div className="brand-icon">⚡</div>
          <div>
            <p className="brand-label">MeshIoT Prism</p>
            <h1>Command & health dashboard</h1>
            <p className="header-copy">
              Unified monitoring, device orchestration, and gateway diagnostics for enterprise ESP32 fleets.
            </p>
          </div>
        </div>

        <div className="header-status-panel">
          <div className="status-card status-card--accent">
            <span>Current view</span>
            <strong>{currentViewTitle}</strong>
          </div>
          <div className="status-card">
            <span>Backend</span>
            <strong>{startupStatus.backend}</strong>
          </div>
          <div className="status-card">
            <span>Renderer</span>
            <strong>{startupStatus.renderer}</strong>
          </div>
        </div>
      </header>

      <div className="shell-body">
        <aside className="side-nav glass-panel">
          <div className="nav-group">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.key}
                  className={view === link.key ? 'nav-button active' : 'nav-button'}
                  onClick={() => setView(link.key)}
                >
                  <Icon className="nav-icon" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="service-summary">
            <h3>Fleet overview</h3>
            <div className="metric-row">
              <span>Devices</span>
              <strong>{services.deviceCount}</strong>
            </div>
            <div className="metric-row">
              <span>Firmware versions</span>
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
          <motion.section
            key={view}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.26, ease: 'easeOut' }}
            className="control-panel glass-panel"
          >
            <div className="panel-header">
              <div>
                <p className="panel-label">{currentViewTitle}</p>
                <h2>{currentViewTitle} Overview</h2>
              </div>
              <div className="panel-chip">Live system status</div>
            </div>
            {renderView()}
          </motion.section>
        </main>

        <aside className="info-panel glass-panel">
          <div className="info-box">
            <div className="info-tiles">
              <div className="info-tile">
                <span>Engine status</span>
                <strong>{status}</strong>
              </div>
              <div className="info-tile">
                <span>WebSocket</span>
                <strong>{startupStatus.websocket}</strong>
              </div>
              <div className="info-tile">
                <span>MQTT</span>
                <strong>{startupStatus.mqtt}</strong>
              </div>
            </div>

            <div className="panel-note">
              <p>
                Live telemetry begins once the backend is ready. Use this panel to verify connectivity and engine health before launching deployments.
              </p>
            </div>
          </div>
        </aside>
      </div>

      <footer className="app-footer glass-panel">
        <span>MeshIoT Manager • Premium glass command UI</span>
        <span>Built for 500+ ESP32 edge units</span>
      </footer>
    </div>
  );
}

export default App;
