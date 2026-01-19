import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
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

// Icons as SVG components
const Icons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  List: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Sun: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  ),
  Search: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  ),
  Plus: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  ),
  Pause: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="4" width="4" height="16"></rect>
      <rect x="14" y="4" width="4" height="16"></rect>
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  ),
  Copy: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  ),
  StatusPage: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  ),
  Maintenance: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
    </svg>
  ),
};

function App() {
  const [monitors, setMonitors] = useState([]);
  const [stats, setStats] = useState({ up: 0, down: 0, maintenance: 0, unknown: 0, pause: 0 });
  const [selectedMonitor, setSelectedMonitor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Listen to monitors collection in real-time
    const q = query(
      collection(db, 'monitors'),
      orderBy('timestamp', 'desc'),
      limit(200)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));

      setMonitors(data);
      calculateStats(data);

      // Auto-select first monitor
      if (data.length > 0 && !selectedMonitor) {
        const uniqueMonitors = getUniqueMonitorsFromData(data);
        setSelectedMonitor(uniqueMonitors[0]?.name);
      }
    });

    return () => unsubscribe();
  }, []);

  const calculateStats = (data) => {
    const latest = {};
    data.forEach(item => {
      if (!latest[item.name]) {
        latest[item.name] = item;
      }
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
      if (!unique[monitor.name]) {
        unique[monitor.name] = monitor;
      }
    });
    return Object.values(unique);
  };

  const getUniqueMonitors = () => {
    return getUniqueMonitorsFromData(monitors);
  };

  const getMonitorData = (name) => {
    return monitors.filter(m => m.name === name).slice(0, 100);
  };

  const calculateUptime = (data) => {
    if (data.length === 0) return 0;
    const upCount = data.filter(d => d.status === 'up').length;
    return ((upCount / data.length) * 100).toFixed(1);
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

  const uniqueMonitors = getUniqueMonitors();
  const filteredMonitors = uniqueMonitors.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo">
              <svg width="24" height="24" viewBox="0 0 512 512" fill="white">
                <circle cx="256" cy="256" r="220" fill="white"/>
                <circle cx="256" cy="256" r="180" fill="#5cdd8b"/>
                <circle cx="256" cy="256" r="80" fill="white"/>
              </svg>
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
          <button className="header-btn" onClick={toggleTheme} title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? <Icons.Sun /> : <Icons.Moon />}
          </button>
          <button className="header-btn" title="Settings">
            <Icons.Settings />
          </button>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="search-container">
              <Icons.Search />
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="add-monitor-btn">
              <Icons.Plus />
              Add New Monitor
            </button>
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
                  <div className="monitor-item-header">
                    <span className={`status-indicator ${monitor.status}`}></span>
                    <span className={`uptime-badge ${getUptimeBadgeClass(uptime)}`}>{uptime}%</span>
                  </div>
                  <div className="monitor-item-name">{monitor.name}</div>
                  <div className="heartbeat-mini">
                    {data.slice(0, 30).reverse().map((check, i) => (
                      <div
                        key={i}
                        className={`heartbeat-bar ${check.status}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            {filteredMonitors.length === 0 && (
              <div className="empty-state">
                <p>No monitors found</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
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

          {/* Recent Events Table */}
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
                    <td>
                      <span className={`status-badge ${monitor.status}`}>
                        {monitor.status === 'up' ? 'Up' : 'Down'}
                      </span>
                    </td>
                    <td>{monitor.timestamp?.toLocaleString()}</td>
                    <td className="message">{monitor.message || '200 - OK'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Monitor Detail */}
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
  if (data.length === 0) return null;

  const latest = data[0];
  const uptime24h = calculateUptime(data);
  const avgPing = calculateAvgPing(data);

  return (
    <div className="monitor-detail">
      <div className="monitor-detail-header">
        <div className="monitor-detail-info">
          <h3>
            <span className={`status-indicator ${latest.status}`}></span>
            {name}
          </h3>
          <div className="monitor-subtitle">{latest.target || 'HTTP Monitor'}</div>
        </div>
        <div className="monitor-actions">
          <button className="btn-action">
            <Icons.Pause />
            Pause
          </button>
          <button className="btn-action">
            <Icons.Edit />
            Edit
          </button>
          <button className="btn-action">
            <Icons.Copy />
            Clone
          </button>
          <button className="btn-action-danger">
            <Icons.Trash />
            Delete
          </button>
        </div>
      </div>

      {/* Heartbeat Bar */}
      <div className="heartbeat-container">
        <div className="heartbeat-bar-large">
          {data.slice(0, 60).reverse().map((check, i) => (
            <div
              key={i}
              className={`heartbeat ${check.status}`}
              title={`${check.status.toUpperCase()} - ${check.timestamp?.toLocaleString()}\n${check.ping || 0}ms`}
            />
          ))}
        </div>
        <div className="heartbeat-labels">
          <span>{data[data.length - 1]?.timestamp?.toLocaleTimeString() || '-'}</span>
          <span>Now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="monitor-stats">
        <div className="stat-box">
          <div className="stat-label">Ping (Current)</div>
          <div className="stat-value-large">{latest.ping || 0} ms</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Avg. Ping (24h)</div>
          <div className="stat-value-large">{avgPing} ms</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Uptime (24h)</div>
          <div className="stat-value-large">{uptime24h}%</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Uptime (30d)</div>
          <div className="stat-value-large">{uptime24h}%</div>
        </div>
      </div>

      {/* Response Time Chart */}
      <ResponseTimeChart data={data.slice(0, 60)} />

      {/* Status History */}
      <div className="status-history">
        <h4>Status History</h4>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Date Time</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 20).map((check, i) => (
              <tr key={i}>
                <td>
                  <span className={`status-badge ${check.status}`}>
                    {check.status === 'up' ? 'Up' : 'Down'}
                  </span>
                </td>
                <td>{check.timestamp?.toLocaleString()}</td>
                <td className="message">{check.message || '200 - OK'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ResponseTimeChart({ data }) {
  if (data.length === 0) return null;

  const maxPing = Math.max(...data.map(d => d.ping || 0), 50);
  const reversedData = [...data].reverse();
  const chartWidth = 1200;
  const chartHeight = 180;
  const padding = 20;

  return (
    <div className="chart-container">
      <h4>Response Time (ms)</h4>
      <svg width="100%" height="200" viewBox={`0 0 ${chartWidth} ${chartHeight + padding * 2}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#5cdd8b', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#5cdd8b', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + (chartHeight * ratio);
          return (
            <g key={i}>
              <line
                x1="0"
                y1={y}
                x2={chartWidth}
                y2={y}
                stroke="var(--border-color)"
                strokeWidth="1"
                strokeDasharray={ratio === 1 ? "0" : "4"}
              />
              <text
                x="5"
                y={y - 5}
                fill="var(--text-muted)"
                fontSize="10"
              >
                {Math.round(maxPing * (1 - ratio))}
              </text>
            </g>
          );
        })}

        {/* Down periods (red background) */}
        {reversedData.map((d, i) => {
          if (d.status === 'down') {
            const x = (i / reversedData.length) * chartWidth;
            const width = (chartWidth / reversedData.length) + 1;
            return (
              <rect
                key={`down-${i}`}
                x={x}
                y={padding}
                width={width}
                height={chartHeight}
                fill="rgba(220, 53, 69, 0.15)"
              />
            );
          }
          return null;
        })}

        {/* Area fill */}
        <path
          d={
            reversedData.map((d, i) => {
              const x = (i / (reversedData.length - 1 || 1)) * chartWidth;
              const y = padding + chartHeight - ((d.ping || 0) / maxPing) * chartHeight;
              return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ') + ` L ${chartWidth},${padding + chartHeight} L 0,${padding + chartHeight} Z`
          }
          fill="url(#chartGradient)"
        />

        {/* Line */}
        <path
          d={reversedData.map((d, i) => {
            const x = (i / (reversedData.length - 1 || 1)) * chartWidth;
            const y = padding + chartHeight - ((d.ping || 0) / maxPing) * chartHeight;
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#5cdd8b"
          strokeWidth="2"
        />

        {/* Data points */}
        {reversedData.map((d, i) => {
          const x = (i / (reversedData.length - 1 || 1)) * chartWidth;
          const y = padding + chartHeight - ((d.ping || 0) / maxPing) * chartHeight;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={d.status === 'up' ? '#5cdd8b' : '#dc3545'}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default App;
