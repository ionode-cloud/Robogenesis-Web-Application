import React, { useState, useEffect } from 'react';
import './DesktopWidgets.css';

const STATUS_ITEMS = [
  {
    id: 'kinetic-hand',
    badge: 'ACTIVE',
    badgeColor: 'green',
    title: '42-DOF Kinetic Hand',
    subtitle: 'Servo loop online • 0.02ms latency',
    detail: 'Fingertip torque & tactile telemetry streaming at 1kHz',
    targetWin: 'win-section-home',
    cpu: 38,
    ram: '4.2 GB',
    statLabel: 'TORQUE',
    statVal: '1.42 Nm',
  },
  {
    id: 'aria-head',
    badge: 'TRACKING',
    badgeColor: 'cyan',
    title: 'A.R.I.A Vision Core',
    subtitle: 'Spatial neural mapping at 99.4%',
    detail: 'Stereo vision depth mesh & gaze vector locked',
    targetWin: 'win-section-about',
    cpu: 56,
    ram: '6.1 GB',
    statLabel: 'CONFIDENCE',
    statVal: '99.4%',
  },
  {
    id: 'ros-nav',
    badge: 'AUTONOMOUS',
    badgeColor: 'green',
    title: 'ROS-Nav Fleet Autopilot',
    subtitle: 'LiDAR SLAM waypoint traversal nominal',
    detail: 'Obstacle avoidance active • 12 waypoints mapped',
    targetWin: 'win-section-domains',
    cpu: 47,
    ram: '5.0 GB',
    statLabel: 'VELOCITY',
    statVal: '1.8 m/s',
  },
  {
    id: 'solar-clinic',
    badge: 'OPTIMAL',
    badgeColor: 'amber',
    title: 'Solar Clinic Diagnostic',
    subtitle: 'PV panel telemetry & MPPT aligned',
    detail: 'Solar tracking servos calibrated • 98.6% efficiency',
    targetWin: 'win-section-products',
    cpu: 29,
    ram: '3.1 GB',
    statLabel: 'EFFICIENCY',
    statVal: '98.6%',
  },
  {
    id: 'vault-shield',
    badge: 'SECURED',
    badgeColor: 'green',
    title: 'VaultShield Cryptographic Core',
    subtitle: 'Hardware security module locked',
    detail: 'Quantum-safe handshake active • Zero tamper events',
    targetWin: 'win-section-products',
    cpu: 31,
    ram: '2.8 GB',
    statLabel: 'INTEGRITY',
    statVal: '100%',
  },
  {
    id: 'underwater-rov',
    badge: 'TELEMETRY',
    badgeColor: 'cyan',
    title: 'Underwater Drone Sonar',
    subtitle: 'Acoustic transceiver synced (0.0m depth)',
    detail: 'Hydro-thruster telemetry steady • Pressure sensor 1.01 bar',
    targetWin: 'win-section-domains',
    cpu: 44,
    ram: '4.8 GB',
    statLabel: 'PRESSURE',
    statVal: '1.01 bar',
  },
  {
    id: 'ev-adas',
    badge: 'COMPUTING',
    badgeColor: 'cyan',
    title: 'EV ADAS Edge Perception',
    subtitle: 'Dual CAN-FD busload 24% • Zero dropped packets',
    detail: 'Sensor fusion radar & camera object detection running',
    targetWin: 'win-section-domains',
    cpu: 62,
    ram: '7.4 GB',
    statLabel: 'BUSLOAD',
    statVal: '24%',
  },
  {
    id: 'cloud-gateway',
    badge: 'SYNCED',
    badgeColor: 'green',
    title: 'Full-Stack Cloud Gateway',
    subtitle: 'WebSocket real-time telemetry bridge',
    detail: 'Robogenesis cluster connected • Latency 14ms',
    targetWin: 'win-section-web-development',
    cpu: 26,
    ram: '3.6 GB',
    statLabel: 'LATENCY',
    statVal: '14 ms',
  },
];

export default function WorkingStatusWidget({ onOpenWin }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [jitter, setJitter] = useState(0);

  // Automatically cycle to a random status every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      rollNextStatus();
    }, 4500);
    return () => clearInterval(timer);
  }, [currentIdx]);

  // Micro jitter for live telemetry animation
  useEffect(() => {
    const jitterTimer = setInterval(() => {
      setJitter(Math.floor((Math.random() - 0.5) * 6));
    }, 1500);
    return () => clearInterval(jitterTimer);
  }, []);

  const rollNextStatus = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIdx((prev) => {
        let next;
        do {
          next = Math.floor(Math.random() * STATUS_ITEMS.length);
        } while (next === prev && STATUS_ITEMS.length > 1);
        return next;
      });
      setIsFading(false);
    }, 200);
  };

  const item = STATUS_ITEMS[currentIdx];
  const dynamicCpu = Math.max(15, Math.min(95, item.cpu + jitter));

  const handleWidgetClick = () => {
    if (onOpenWin && item.targetWin) {
      onOpenWin(item.targetWin);
    }
  };

  return (
    <div
      className="os-desktop-widget os-status-widget"
      title="Click to view section • Tap dice to roll random status"
    >
      <div className="os-widget-glass-shine" />

      {/* Header: Pulsing Live Indicator + Category + Roll Button */}
      <div className="os-widget-header">
        <div className="os-ws-live-tag">
          <span className={`os-ws-dot ${item.badgeColor}`} />
          <span className="os-ws-badge-text">{item.badge}</span>
        </div>
        <span className="os-ws-category">ROBOLAB FLEET</span>
        <button
          className="os-ws-roll-btn"
          onClick={(e) => {
            e.stopPropagation();
            rollNextStatus();
          }}
          title="Roll random working status"
          aria-label="Roll random status"
        >
          🎲
        </button>
      </div>

      {/* Body: Status Title & Animated Transition */}
      <div
        className={`os-ws-body ${isFading ? 'fade-out' : 'fade-in'}`}
        onClick={handleWidgetClick}
        style={{ cursor: 'pointer' }}
      >
        <div className="os-ws-title-row">
          <h4 className="os-ws-title">{item.title}</h4>
        </div>
        <p className="os-ws-subtitle">{item.subtitle}</p>
        <p className="os-ws-detail">{item.detail}</p>
      </div>

      {/* Footer: Live Telemetry Gauges */}
      <div className="os-ws-footer">
        <div className="os-ws-telemetry-grid">
          <div className="os-ws-stat-col">
            <span className="os-ws-stat-label">CPU LOAD</span>
            <div className="os-ws-stat-bar-wrap">
              <div
                className="os-ws-stat-bar-fill"
                style={{ width: `${dynamicCpu}%` }}
              />
            </div>
            <span className="os-ws-stat-value">{dynamicCpu}%</span>
          </div>

          <div className="os-ws-stat-col">
            <span className="os-ws-stat-label">MEMORY</span>
            <span className="os-ws-stat-value">{item.ram}</span>
          </div>

          <div className="os-ws-stat-col">
            <span className="os-ws-stat-label">{item.statLabel}</span>
            <span className="os-ws-stat-value highlight">{item.statVal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
