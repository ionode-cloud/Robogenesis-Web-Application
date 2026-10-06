import React, { useState, useEffect } from 'react';
import './DesktopWidgets.css';

export default function DateTimeWidget() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours24 = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  const hours12 = hours24 % 12 || 12;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const displayHours = is24Hour ? hours24.toString().padStart(2, '0') : hours12.toString().padStart(2, '0');

  const dayName = time.toLocaleDateString('en-US', { weekday: 'long' });
  const monthShort = time.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const monthFull = time.toLocaleDateString('en-US', { month: 'long' });
  const dayNumber = time.getDate();
  const yearNumber = time.getFullYear();

  // Progress of current day (0 to 100%)
  const daySeconds = hours24 * 3600 + time.getMinutes() * 60 + time.getSeconds();
  const dayPercent = Math.round((daySeconds / 86400) * 100);

  // Timezone string
  let timeZoneStr = 'Local';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timeZoneStr = tz ? tz.replace(/_/g, ' ') : 'Local';
  } catch {
    timeZoneStr = 'Local';
  }

  return (
    <div
      className="os-desktop-widget os-datetime-widget"
      title="Click to toggle 12h / 24h format"
      onClick={() => setIs24Hour((prev) => !prev)}
    >
      <div className="os-widget-glass-shine" />

      {/* Header: Mini Calendar Pill + Day of Week */}
      <div className="os-widget-header">
        <div className="os-dt-cal-badge">
          <span className="os-dt-cal-month">{monthShort}</span>
          <span className="os-dt-cal-day">{dayNumber}</span>
        </div>
        <div className="os-dt-day-info">
          <span className="os-dt-day-name">{dayName}</span>
          <span className="os-dt-full-date">{monthFull} {dayNumber}, {yearNumber}</span>
        </div>
        <div className="os-dt-format-pill" title="Format: Click to toggle">
          {is24Hour ? '24H' : '12H'}
        </div>
      </div>

      {/* Main Clock */}
      <div className="os-dt-clock-body">
        <div className="os-dt-digits">
          <span className="os-dt-main-time">
            {displayHours}<span className="os-dt-colon">:</span>{minutes}
          </span>
          <div className="os-dt-sec-wrap">
            <span className="os-dt-sec">:{seconds}</span>
            {!is24Hour && <span className="os-dt-ampm">{ampm}</span>}
          </div>
        </div>
      </div>

      {/* Footer: Day progress + Timezone */}
      <div className="os-dt-footer">
        <div className="os-dt-meta-row">
          <span className="os-dt-tz-tag">
            <span className="os-dt-tz-icon">🌐</span> {timeZoneStr}
          </span>
          <span className="os-dt-progress-num">{dayPercent}% day</span>
        </div>
        <div className="os-dt-progress-track">
          <div
            className="os-dt-progress-fill"
            style={{ width: `${dayPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
