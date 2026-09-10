import { useState, useEffect } from 'react';

const DEFAULT_MESSAGES = [
  'Initializing Robogenesis System...',
  'Calibrating Autonomous Kinematics...',
  'Syncing Telemetry & Neural Nodes...',
  'System Ready...',
];

export default function RobotLoader({
  text,
  subtext,
  fullScreen = true,
  isExiting = false,
  duration = 850, // Duration in ms for 0 to 100 walk
}) {
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);
  const [msgOpacity, setMsgOpacity] = useState(1);

  // Smooth 0 to 100 progress interpolation
  useEffect(() => {
    let startTimestamp = null;
    let animId;

    const tickProgress = (now) => {
      if (!startTimestamp) startTimestamp = now;
      const elapsed = now - startTimestamp;
      const currentPct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(currentPct);

      if (currentPct < 100 && !isExiting) {
        animId = requestAnimationFrame(tickProgress);
      }
    };

    animId = requestAnimationFrame(tickProgress);
    return () => cancelAnimationFrame(animId);
  }, [duration, isExiting]);

  // If exit is triggered early, smoothly snap to 100%
  useEffect(() => {
    if (isExiting) {
      setProgress(100);
    }
  }, [isExiting]);

  // Message cycling if no custom text provided
  useEffect(() => {
    if (text) return;

    const interval = setInterval(() => {
      setMsgOpacity(0);
      setTimeout(() => {
        setMsgIndex((prev) => (prev + 1) % DEFAULT_MESSAGES.length);
        setMsgOpacity(1);
      }, 200);
    }, 2000);

    return () => clearInterval(interval);
  }, [text]);

  const currentMessage = text || DEFAULT_MESSAGES[msgIndex];
  const isComplete = progress >= 100;

  return (
    <div
      className={`rl-overlay${fullScreen ? '' : ' rl-inline'}${isExiting ? ' exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading application ${progress}%`}
    >
      <div className="rl-stage">
        {/* Walking Track Container (Robot walks 0 to 100 across track) */}
        <div className="rl-track-container">
          {/* Moving Walker Anchor (Moves from 0% to 100% across the track) */}
          <div
            className="rl-walker-anchor"
            style={{
              left: `${progress}%`,
              transform: `translateX(-${progress}%)`,
            }}
          >
            {/* Contact Ground Shadow */}
            <div className="rl-shadow" />

            {/* Mac View Robot (Walking Stride or Happy 100% Celebration) */}
            <div className={`rl-mac-bot ${isComplete ? 'rl-completed' : ''}`}>
              <svg
                className="rl-svg"
                viewBox="0 0 96 110"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Dark Graphite Metallic Chassis Gradient */}
                  <linearGradient id="rl-chassis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#454b56" />
                    <stop offset="35%" stopColor="#2e323b" />
                    <stop offset="70%" stopColor="#22252c" />
                    <stop offset="100%" stopColor="#16181d" />
                  </linearGradient>

                  {/* Subtle Top Metallic Highlight */}
                  <linearGradient id="rl-rim-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#686f7e" stopOpacity="0.8" />
                    <stop offset="30%" stopColor="#454b56" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#16181d" stopOpacity="0" />
                  </linearGradient>

                  {/* Recessed Screen Bezel Gradient */}
                  <linearGradient id="rl-bezel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1c1e24" />
                    <stop offset="100%" stopColor="#0f1013" />
                  </linearGradient>

                  {/* Deep Glass CRT Display Interior */}
                  <radialGradient id="rl-glass-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1b1e28" />
                    <stop offset="75%" stopColor="#101217" />
                    <stop offset="100%" stopColor="#090a0d" />
                  </radialGradient>

                  {/* Side Ear Dial Metallic Gradient */}
                  <linearGradient id="rl-dial-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#505663" />
                    <stop offset="50%" stopColor="#2c3038" />
                    <stop offset="100%" stopColor="#191b20" />
                  </linearGradient>

                  {/* Golden LED Glow Filter */}
                  <filter id="rl-led-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur2" />
                      <feMergeNode in="blur1" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* 1. LEGS & FEET */}
                <g className="rl-legs-group">
                  <g className="rl-leg-l">
                    <rect x="30" y="78" width="14" height="18" rx="7" fill="url(#rl-chassis-grad)" stroke="#1a1c22" strokeWidth="1" />
                    <ellipse cx="37" cy="94" rx="7" ry="3.5" fill="#14151a" />
                    <path d="M 31 82 Q 37 80 43 82" stroke="#686f7e" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  </g>
                  <g className="rl-leg-r">
                    <rect x="52" y="78" width="14" height="18" rx="7" fill="url(#rl-chassis-grad)" stroke="#1a1c22" strokeWidth="1" />
                    <ellipse cx="59" cy="94" rx="7" ry="3.5" fill="#14151a" />
                    <path d="M 53 82 Q 59 80 65 82" stroke="#686f7e" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  </g>
                </g>

                {/* 2. TORSO & ARMS */}
                <g className="rl-body-group">
                  <g className="rl-arm-l">
                    <rect x="18" y="55" width="12" height="24" rx="6" fill="url(#rl-chassis-grad)" stroke="#181a1f" strokeWidth="1" />
                    <circle cx="24" cy="74" r="5" fill="#242730" />
                  </g>

                  <rect x="26" y="50" width="44" height="36" rx="18" fill="url(#rl-chassis-grad)" stroke="#1b1c22" strokeWidth="1.2" />
                  <path d="M 32 54 Q 48 51 64 54" stroke="#686f7e" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
                  <circle cx="48" cy="70" r="2.5" fill="#1b1d22" stroke="#323640" strokeWidth="0.8" />

                  <g className="rl-arm-r">
                    <rect x="66" y="55" width="12" height="24" rx="6" fill="url(#rl-chassis-grad)" stroke="#181a1f" strokeWidth="1" />
                    <circle cx="72" cy="74" r="5" fill="#242730" />
                  </g>
                </g>

                {/* 3. CRT MONITOR HEAD GROUP */}
                <g className="rl-head-group">
                  {/* Antennas */}
                  <g className="rl-antennas">
                    <rect x="29" y="3" width="6" height="7" rx="2.5" fill="url(#rl-dial-grad)" stroke="#16181d" strokeWidth="0.8" />
                    <circle cx="32" cy="3.5" r="2" fill="#585f6e" />
                    <rect x="61" y="3" width="6" height="7" rx="2.5" fill="url(#rl-dial-grad)" stroke="#16181d" strokeWidth="0.8" />
                    <circle cx="64" cy="3.5" r="2" fill="#585f6e" />
                  </g>

                  {/* Ear Dials */}
                  <g className="rl-ear-l">
                    <rect x="7" y="24" width="7" height="18" rx="3.5" fill="url(#rl-dial-grad)" stroke="#16181d" strokeWidth="1" />
                    <line x1="8" y1="33" x2="13" y2="33" stroke="#484f5c" strokeWidth="1.2" />
                  </g>
                  <g className="rl-ear-r">
                    <rect x="82" y="24" width="7" height="18" rx="3.5" fill="url(#rl-dial-grad)" stroke="#16181d" strokeWidth="1" />
                    <line x1="83" y1="33" x2="88" y2="33" stroke="#484f5c" strokeWidth="1.2" />
                  </g>

                  {/* Outer Head Chassis */}
                  <rect x="12" y="7" width="72" height="53" rx="20" ry="18" fill="url(#rl-chassis-grad)" stroke="#131418" strokeWidth="1.5" />
                  <rect x="13.5" y="8.5" width="69" height="50" rx="18.5" ry="16.5" fill="url(#rl-rim-highlight)" pointerEvents="none" />
                  <rect x="17" y="12" width="62" height="43" rx="15" ry="14" fill="url(#rl-bezel-grad)" stroke="#1a1c22" strokeWidth="1.2" />
                  <rect x="20" y="15" width="56" height="37" rx="12" ry="11" fill="url(#rl-glass-grad)" />
                  <path d="M 23 17 L 46 17 C 36 24 28 27 23 31 Z" fill="rgba(255, 255, 255, 0.09)" pointerEvents="none" />

                  {/* Scanlines */}
                  <line x1="22" y1="23" x2="74" y2="23" className="rl-screen-scanline" />
                  <line x1="22" y1="29" x2="74" y2="29" className="rl-screen-scanline" />
                  <line x1="22" y1="35" x2="74" y2="35" className="rl-screen-scanline" />
                  <line x1="22" y1="41" x2="74" y2="41" className="rl-screen-scanline" />
                  <line x1="22" y1="47" x2="74" y2="47" className="rl-screen-scanline" />

                  {/* Golden Yellow LED Facial Expression */}
                  <g filter="url(#rl-led-glow)">
                    {isComplete ? (
                      // 100% Completed: Cheerful happy eyes & wide smile!
                      <g>
                        <path d="M 31 34 Q 37 27 43 34" stroke="#ffd215" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                        <path d="M 53 34 Q 59 27 65 34" stroke="#ffd215" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                        <path d="M 42 39 Q 48 48 54 39 Z" fill="#ffd215" />
                      </g>
                    ) : (
                      // Walking 0 to 99%: Focused round eyes & stepping smile
                      <g>
                        <circle cx="37" cy="31" r="5.2" fill="#ffd215" />
                        <circle cx="59" cy="31" r="5.2" fill="#ffd215" />
                        <path d="M 43 39 Q 48 44 53 39" stroke="#ffd215" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                      </g>
                    )}
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Glowing Track & Filled Bar (fills 0 to 100) */}
          <div className="rl-progress-track">
            <div
              className="rl-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Status Label + Live 0% to 100% Numeric Progress Badge */}
        <div className="rl-info-bar">
          <div className="rl-label">
            <span
              className="rl-status-text"
              style={{
                opacity: msgOpacity,
                transform: msgOpacity === 1 ? 'translateY(0)' : 'translateY(-2px)',
              }}
            >
              {currentMessage}
            </span>
            <span className="rl-dot">.</span>
            <span className="rl-dot">.</span>
            <span className="rl-dot">.</span>
          </div>

          {/* 0 to 100 Live Percentage Counter */}
          <div className={`rl-percent-badge ${isComplete ? 'complete' : ''}`}>
            {progress}%
          </div>
        </div>

        {/* Subtext (optional) */}
        {subtext && (
          <div className="rl-subtext">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
}
