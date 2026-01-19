import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyAdBEEyApYCeazbF5xe0zv7ozOFsJ1p-rU",
  authDomain: "my-uptime-monitor.firebaseapp.com",
  projectId: "my-uptime-monitor",
  storageBucket: "my-uptime-monitor.firebasestorage.app",
  messagingSenderId: "647025345804",
  appId: "1:647025345804:web:bb477d61c12a432dd27529"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Icons
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="3" width="7" height="7" rx="1"></rect>
      <rect x="14" y="14" width="7" height="7" rx="1"></rect>
      <rect x="3" y="14" width="7" height="7" rx="1"></rect>
    </svg>
  ),
  StatusPage: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
    </svg>
  ),
  Maintenance: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  ),
  Menu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Refresh: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 4 23 10 17 10"></polyline>
      <polyline points="1 20 1 14 7 14"></polyline>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Server: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Activity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
};

function App() {
  const [monitors, setMonitors] = useState([]);
  const [stats, setStats] = useState({ up: 0, down: 0, maintenance: 0, unknown: 0, pause: 0 });
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const q = query(collection(db, 'monitors'), orderBy('timestamp', 'desc'), limit(500));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setMonitors(data);
      calculateStats(data);
      setLastUpdate(new Date());
      if (data.length > 0 && !selectedMonitor) {
        const unique = getUniqueMonitorsFromData(data);
        setSelectedMonitor(unique[0]?.name);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fetch data on initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 15 * 60 * 1000); // 15 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const formatLastUpdate = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  const calculateStats = (data) => {
    const latest = {};
    data.forEach(item => {
      if (!latest[item.name]) latest[item.name] = item;
    });
    const newStats = { up: 0, down: 0, maintenance: 0, unknown: 0, pause: 0 };
    Object.values(latest).forEach(monitor => {
      if (monitor.status === 'up') newStats.up++;
      else if (monitor.status === 'down') newStats.down++;
      else if (monitor.status === 'maintenance') newStats.maintenance++;
      else newStats.unknown++;
    });
    setStats(newStats);
  };

  const getUniqueMonitorsFromData = (data) => {
    const unique = {};
    data.forEach(monitor => {
      if (!unique[monitor.name]) unique[monitor.name] = monitor;
    });
    return Object.values(unique);
  };

  const getMonitorData = (name) => monitors.filter(m => m.name === name).slice(0, 100);

  const calculateUptime = (data) => {
    if (data.length === 0) return 0;
    const upCount = data.filter(d => d.status === 'up').length;
    return ((upCount / data.length) * 100).toFixed(2);
  };

  const calculateAvgPing = (data) => {
    const pings = data.map(d => d.ping || 0).filter(p => p > 0);
    if (pings.length === 0) return 0;
    return Math.round(pings.reduce((a, b) => a + b, 0) / pings.length);
  };

  const getUptimeBadgeClass = (uptime) => {
    const value = parseFloat(uptime);
    if (value >= 99) return '';
    if (value >= 95) return 'warning';
    return 'danger';
  };

  const uniqueMonitors = getUniqueMonitorsFromData(monitors);
  const filteredMonitors = uniqueMonitors.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon">
              <div className="logo-icon-inner"></div>
            </div>
            <h1>Uptime Kuma</h1>
          </div>
          <nav className="nav-links">
            <button className="nav-link active">
              <Icons.Dashboard />
              <span>Dashboard</span>
            </button>
            <button className="nav-link">
              <Icons.StatusPage />
              <span>Status Pages</span>
            </button>
            <button className="nav-link">
              <Icons.Maintenance />
              <span>Maintenance</span>
            </button>
          </nav>
        </div>
        <div className="header-right">
          {lastUpdate && (
            <span className="last-update">
              Last update: {formatLastUpdate(lastUpdate)}
            </span>
          )}
          <button
            className={`btn-refresh ${isRefreshing ? 'spinning' : ''}`}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <Icons.Refresh />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="header-btn" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button className="header-btn">
            <Icons.Settings />
          </button>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <button className="add-monitor-btn">
            <Icons.Plus />
            Add New Monitor
          </button>

          <div className="sidebar-controls">
            <div className="filter-row">
              <button className="select-btn">Select</button>
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-buttons">
              <button className="menu-btn"><Icons.Menu /></button>
              <button className="filter-btn">Status <Icons.ChevronDown /></button>
              <button className="filter-btn">Active <Icons.ChevronDown /></button>
              <button className="filter-btn">Tags <Icons.ChevronDown /></button>
            </div>
          </div>

          <div className="monitor-list">
            {filteredMonitors.map((monitor) => {
              const data = getMonitorData(monitor.name);
              const uptime = calculateUptime(data);
              return (
                <div
                  key={monitor.name}
                  className={`monitor-item ${selectedMonitor === monitor.name ? 'selected' : ''}`}
                  onClick={() => setSelectedMonitor(monitor.name)}
                >
                  <div className="monitor-item-row">
                    <span className={`uptime-badge ${getUptimeBadgeClass(uptime)}`}>{uptime}%</span>
                    <span className="monitor-item-name">{monitor.name}</span>
                  </div>
                  <div className="heartbeat-mini">
                    {data.slice(0, 20).reverse().map((check, i) => (
                      <div key={i} className={`heartbeat-bar ${check.status}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="content">
          <div className="quick-stats">
            <h2>Quick Stats</h2>
            <div className="stats">
              <div className="stat-item">
                <div className="stat-label">Up</div>
                <div className="stat-value green">{stats.up}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Down</div>
                <div className="stat-value red">{stats.down}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pending</div>
                <div className="stat-value yellow">{stats.unknown}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Maintenance</div>
                <div className="stat-value gray">{stats.maintenance}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Paused</div>
                <div className="stat-value gray">{stats.pause}</div>
              </div>
            </div>
          </div>

          <div className="recent-events">
            <div className="section-header">Recent Events</div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Date Time</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {monitors.slice(0, 10).map((monitor) => (
                  <tr key={monitor.id}>
                    <td>{monitor.name}</td>
                    <td><span className={`status-badge ${monitor.status}`}>{monitor.status === 'up' ? 'Up' : 'Down'}</span></td>
                    <td>{monitor.timestamp?.toLocaleString()}</td>
                    <td>{monitor.message || '200 - OK'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedMonitor && (
            <MonitorDetail
              name={selectedMonitor}
              data={getMonitorData(selectedMonitor)}
              calculateUptime={calculateUptime}
              calculateAvgPing={calculateAvgPing}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function MonitorDetail({ name, data, calculateUptime, calculateAvgPing }) {
  const [chartRange, setChartRange] = useState('recent');
  const [tooltip, setTooltip] = useState(null);

  if (data.length === 0) return null;

  const latest = data[0];
  const currentPing = latest.ping || 0;

  // Use stats from Firebase if available, otherwise calculate locally
  const stats24h = latest.stats_24h || {
    uptime_percentage: calculateUptime(data),
    avg_response_time: calculateAvgPing(data),
    total_checks: data.length,
    successful_checks: data.filter(d => d.status === 'up').length
  };

  const stats30d = latest.stats_30d || stats24h;

  // SSL Certificate info
  const sslCert = latest.ssl_certificate;

  // DNS info
  const dnsInfo = latest.dns_info;

  // HTTP Headers
  const headers = latest.headers;

  return (
    <div className="monitor-detail">
      <div className="monitor-detail-header">
        <div>
          <div className="monitor-detail-title">
            <span className={`status-dot ${latest.status}`}></span>
            <h3>{name}</h3>
          </div>
          <div className="monitor-subtitle">
            {latest.monitor_type === 'http' ? latest.target : `Ping: ${latest.target}`}
          </div>
        </div>
        <div className="monitor-actions">
          <button className="btn-action"><Icons.Pause /> Pause</button>
          <button className="btn-action"><Icons.Edit /> Edit</button>
          <button className="btn-action"><Icons.Copy /> Clone</button>
          <button className="btn-action danger"><Icons.Trash /> Delete</button>
        </div>
      </div>

      <div className="heartbeat-section">
        <div className="heartbeat-row">
          <div className="heartbeat-bar-large">
            {data.slice(0, 30).reverse().map((check, i) => (
              <div
                key={i}
                className={`heartbeat-large ${check.status}`}
                onMouseEnter={(e) => {
                  const rect = e.target.getBoundingClientRect();
                  setTooltip({
                    x: rect.left,
                    y: rect.top - 60,
                    time: check.timestamp?.toLocaleString(),
                    ping: check.ping || 0,
                    status: check.status
                  });
                }}
                onMouseLeave={() => setTooltip(null)}
              />
            ))}
          </div>
          <span className={`status-badge-large ${latest.status}`}>
            {latest.status === 'up' ? 'Up' : 'Down'}
          </span>
        </div>
        <div className="heartbeat-labels">
          <span>{data[Math.min(29, data.length - 1)]?.timestamp?.toLocaleTimeString() || ''}</span>
          <span>now</span>
        </div>
        <div className="check-interval">Check every 20 seconds</div>
      </div>

      <div className="monitor-stats">
        <div className="stat-box">
          <div className="stat-label">Ping (Current)</div>
          <div className="stat-value-large underline">{currentPing.toFixed(1)} ms</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Avg. Ping (24h)</div>
          <div className="stat-value-large">{stats24h.avg_response_time || 0} ms</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Uptime (24h)</div>
          <div className="stat-value-large">{stats24h.uptime_percentage || 0}%</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Uptime (30d)</div>
          <div className="stat-value-large">{stats30d.uptime_percentage || 0}%</div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="info-cards-grid">
        {/* SSL Certificate Info */}
        {sslCert && (
          <div className="info-card">
            <div className="info-card-header">
              <Icons.Lock />
              <h4>SSL Certificate</h4>
              <span className={`info-badge ${sslCert.valid ? 'success' : 'danger'}`}>
                {sslCert.valid ? 'Valid' : 'Invalid'}
              </span>
            </div>
            <div className="info-card-body">
              {sslCert.valid ? (
                <>
                  <div className="info-row">
                    <span className="info-label">Subject</span>
                    <span className="info-value">{sslCert.subject}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Issuer</span>
                    <span className="info-value">{sslCert.issuer}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Valid From</span>
                    <span className="info-value">{new Date(sslCert.valid_from).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Valid To</span>
                    <span className="info-value">{new Date(sslCert.valid_to).toLocaleDateString()}</span>
                  </div>
                  <div className="info-row highlight">
                    <span className="info-label">Days Remaining</span>
                    <span className={`info-value ${sslCert.days_remaining < 30 ? 'warning' : sslCert.days_remaining < 7 ? 'danger' : 'success'}`}>
                      {sslCert.days_remaining} days
                    </span>
                  </div>
                </>
              ) : (
                <div className="info-row">
                  <span className="info-label">Error</span>
                  <span className="info-value danger">{sslCert.error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DNS Info */}
        {dnsInfo && !dnsInfo.error && (
          <div className="info-card">
            <div className="info-card-header">
              <Icons.Globe />
              <h4>DNS Information</h4>
            </div>
            <div className="info-card-body">
              <div className="info-row">
                <span className="info-label">Hostname</span>
                <span className="info-value">{dnsInfo.hostname}</span>
              </div>
              {dnsInfo.ip_addresses && dnsInfo.ip_addresses.length > 0 && (
                <div className="info-row">
                  <span className="info-label">IP Addresses</span>
                  <span className="info-value">
                    {dnsInfo.ip_addresses.map((ip, i) => (
                      <span key={i} className="ip-badge">{ip}</span>
                    ))}
                  </span>
                </div>
              )}
              {dnsInfo.aliases && dnsInfo.aliases.length > 0 && (
                <div className="info-row">
                  <span className="info-label">Aliases</span>
                  <span className="info-value">{dnsInfo.aliases.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* HTTP Headers */}
        {headers && (
          <div className="info-card">
            <div className="info-card-header">
              <Icons.Server />
              <h4>HTTP Headers</h4>
            </div>
            <div className="info-card-body">
              <div className="info-row">
                <span className="info-label">Server</span>
                <span className="info-value">{headers.server || 'Unknown'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Content-Type</span>
                <span className="info-value">{headers.content_type || 'Unknown'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Content-Length</span>
                <span className="info-value">{headers.content_length || '0'} bytes</span>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Card */}
        <div className="info-card">
          <div className="info-card-header">
            <Icons.Activity />
            <h4>Statistics (24h)</h4>
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-label">Total Checks</span>
              <span className="info-value">{stats24h.total_checks || 0}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Successful</span>
              <span className="info-value success">{stats24h.successful_checks || 0}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Failed</span>
              <span className="info-value danger">{stats24h.failed_checks || 0}</span>
            </div>
            {stats24h.min_response_time !== undefined && (
              <div className="info-row">
                <span className="info-label">Min Response</span>
                <span className="info-value">{stats24h.min_response_time} ms</span>
              </div>
            )}
            {stats24h.max_response_time !== undefined && (
              <div className="info-row">
                <span className="info-label">Max Response</span>
                <span className="info-value">{stats24h.max_response_time} ms</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <InteractiveChart data={data.slice(0, 60)} range={chartRange} setRange={setChartRange} />

      <div className="status-history">
        <h4>Status History</h4>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Date Time</th>
              <th>Message</th>
              {data.some(d => d.packet_loss !== undefined) && <th>Packet Loss</th>}
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 20).map((check, i) => (
              <tr key={i}>
                <td><span className={`status-badge ${check.status}`}>{check.status === 'up' ? 'Up' : 'Down'}</span></td>
                <td>{check.timestamp?.toLocaleString()}</td>
                <td>{check.message || '200 - OK'}</td>
                {data.some(d => d.packet_loss !== undefined) && (
                  <td>{check.packet_loss !== undefined ? `${check.packet_loss}%` : '-'}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="tooltip-time">{tooltip.time}</div>
          <div className="tooltip-value">{tooltip.ping} ms - {tooltip.status.toUpperCase()}</div>
        </div>
      )}
    </div>
  );
}

function InteractiveChart({ data, range, setRange }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 180 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width - 50, height: 180 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = dimensions;
    const padding = { top: 10, right: 10, bottom: 30, left: 0 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Set canvas size
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Clear
    ctx.clearRect(0, 0, width, height);

    const reversedData = [...data].reverse();
    const maxPing = Math.max(...reversedData.map(d => d.ping || 0), 50);

    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#dee2e6';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight * i / 4);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw down periods (red background)
    reversedData.forEach((d, i) => {
      if (d.status === 'down') {
        const x = padding.left + (i / (reversedData.length - 1 || 1)) * chartWidth;
        const barWidth = chartWidth / reversedData.length + 2;
        ctx.fillStyle = 'rgba(220, 53, 69, 0.2)';
        ctx.fillRect(x - barWidth / 2, padding.top, barWidth, chartHeight);
      }
    });

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, 'rgba(92, 221, 139, 0.4)');
    gradient.addColorStop(1, 'rgba(92, 221, 139, 0.05)');

    ctx.beginPath();
    reversedData.forEach((d, i) => {
      const x = padding.left + (i / (reversedData.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.ping || 0) / maxPing) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    reversedData.forEach((d, i) => {
      const x = padding.left + (i / (reversedData.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.ping || 0) / maxPing) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#5cdd8b';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw points
    reversedData.forEach((d, i) => {
      const x = padding.left + (i / (reversedData.length - 1 || 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.ping || 0) / maxPing) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = d.status === 'up' ? '#5cdd8b' : '#dc3545';
      ctx.fill();
    });

  }, [data, dimensions]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const { width, height } = dimensions;
    const padding = { left: 0, right: 10 };
    const chartWidth = width - padding.left - padding.right;

    const reversedData = [...data].reverse();
    const index = Math.round((x / chartWidth) * (reversedData.length - 1));

    if (index >= 0 && index < reversedData.length) {
      const d = reversedData[index];
      setTooltip({
        x: e.clientX,
        y: e.clientY - 70,
        time: d.timestamp?.toLocaleString(),
        ping: d.ping || 0,
        status: d.status
      });
    }
  };

  if (data.length === 0) return null;
  const maxPing = Math.max(...data.map(d => d.ping || 0), 50);

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h4>Response Time (ms)</h4>
        <div className="chart-controls">
          <button className={`chart-btn ${range === 'recent' ? 'active' : ''}`} onClick={() => setRange('recent')}>Recent</button>
        </div>
      </div>
      <div className="chart-container" ref={containerRef}>
        <div className="chart-y-axis">
          <span>{Math.round(maxPing)}</span>
          <span>{Math.round(maxPing * 0.75)}</span>
          <span>{Math.round(maxPing * 0.5)}</span>
          <span>{Math.round(maxPing * 0.25)}</span>
          <span>0</span>
        </div>
        <div className="chart-area">
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '180px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
          />
        </div>
      </div>
      {tooltip && (
        <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y, position: 'fixed' }}>
          <div className="tooltip-time">{tooltip.time}</div>
          <div className="tooltip-value">{tooltip.ping} ms - {tooltip.status.toUpperCase()}</div>
        </div>
      )}
    </div>
  );
}

export default App;
