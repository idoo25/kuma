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

function App() {
  const [monitors, setMonitors] = useState([]);
  const [stats, setStats] = useState({ up: 0, down: 0, maintenance: 0, unknown: 0, pause: 0 });
  const [selectedMonitor, setSelectedMonitor] = useState(null);

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
        const uniqueMonitors = getUniqueMonitors(data);
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
    });

    setStats(newStats);
  };

  const getUniqueMonitors = () => {
    const unique = {};
    monitors.forEach(monitor => {
      if (!unique[monitor.name]) {
        unique[monitor.name] = monitor;
      }
    });
    return Object.values(unique);
  };

  const getMonitorData = (name) => {
    return monitors.filter(m => m.name === name).slice(0, 100);
  };

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

  const uniqueMonitors = getUniqueMonitors();

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <div className="logo">🟢</div>
          <h1>Uptime Kuma</h1>
        </div>
        <div className="header-right">
          <button className="btn-primary">Dashboard</button>
        </div>
      </header>

      <div className="main-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <button className="add-monitor-btn">+ Add New Monitor</button>

          <div className="monitor-list">
            {uniqueMonitors.map((monitor) => {
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
                    <span className="uptime-badge">{uptime}%</span>
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
                <div className="stat-label">Maintenance</div>
                <div className="stat-value blue">{stats.maintenance}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Unknown</div>
                <div className="stat-value gray">{stats.unknown}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Pause</div>
                <div className="stat-value gray">{stats.pause}</div>
              </div>
            </div>
          </div>

          {/* Recent Events Table */}
          <div className="recent-events">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>DateTime</th>
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
      <h3>{name}</h3>
      <div className="monitor-subtitle">Ping: {latest.target}</div>

      <div className="monitor-actions">
        <button className="btn-action">⏸️ Pause</button>
        <button className="btn-action">✏️ Edit</button>
        <button className="btn-action">📋 Clone</button>
        <button className="btn-action-danger">🗑️ Delete</button>
      </div>

      {/* Heartbeat Bar */}
      <div className="heartbeat-container">
        <div className="heartbeat-bar-large">
          {data.slice(0, 60).reverse().map((check, i) => (
            <div
              key={i}
              className={`heartbeat ${check.status}`}
              title={`${check.status} - ${check.timestamp?.toLocaleString()}\n${check.ping}ms`}
            />
          ))}
        </div>
        <div className="heartbeat-labels">
          <span>{data[data.length - 1]?.timestamp?.toLocaleTimeString()}</span>
          <span>now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="monitor-stats">
        <div className="stat-box">
          <div className="stat-label">Ping (Current)</div>
          <div className="stat-value-large">{latest.ping || 0} ms</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Avg. Ping (24-hour)</div>
          <div className="stat-value-large">{avgPing} ms</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Uptime (24-hour)</div>
          <div className="stat-value-large">{uptime24h}%</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Uptime (30-day)</div>
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
              <th>DateTime</th>
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

  return (
    <div className="chart-container">
      <h4>Response Time</h4>
      <svg width="100%" height="200" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#4ade80', stopOpacity: 0.05 }} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 50, 100, 150, 200].map(y => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="1200"
            y2={y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}

        {/* Down periods (red background) */}
        {reversedData.map((d, i) => {
          if (d.status === 'down') {
            const x = (i / reversedData.length) * 1200;
            const width = (1200 / reversedData.length);
            return (
              <rect
                key={`down-${i}`}
                x={x}
                y="0"
                width={width}
                height="200"
                fill="rgba(239, 68, 68, 0.15)"
              />
            );
          }
          return null;
        })}

        {/* Line chart with area fill */}
        <path
          d={reversedData.map((d, i) => {
            const x = (i / reversedData.length) * 1200;
            const y = 180 - ((d.ping || 0) / maxPing) * 160;
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
        />

        <path
          d={
            reversedData.map((d, i) => {
              const x = (i / reversedData.length) * 1200;
              const y = 180 - ((d.ping || 0) / maxPing) * 160;
              return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ') + ` L 1200,200 L 0,200 Z`
          }
          fill="url(#gradient)"
        />
      </svg>
    </div>
  );
}

export default App;
