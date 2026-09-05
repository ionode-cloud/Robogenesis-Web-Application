import { useRef, useEffect } from 'react';
import OsWindow from '../OsWindow.jsx';

export default function WinHeadAria({
  isOpen = true,
  isFocused = true,
  zIndex,
  onClose = () => {},
  onMin = () => {},
  onFocus = () => {},
  isInline = false,
  hideHeader,
  hideFooter,
  onOpenOs,
}) {
  const shouldHideHeader = hideHeader !== undefined ? hideHeader : isInline;
  const shouldHideFooter = hideFooter !== undefined ? hideFooter : isInline;
  const videoRef = useRef(null);

  // Mouse-scrub head rotation effect
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let prevX = null;
    let targetTime = 0;
    let isSeeking = false;

    const applySeek = () => {
      if (!video.duration || isNaN(video.duration) || isSeeking) return;
      if (Math.abs(targetTime - video.currentTime) < 0.01) return;
      isSeeking = true;
      video.currentTime = targetTime;
    };

    const onSeeked = () => {
      isSeeking = false;
      if (Math.abs(targetTime - video.currentTime) > 0.01) applySeek();
    };

    const onMouseMove = (e) => {
      if (!video.duration || isNaN(video.duration)) return;
      const rect = video.getBoundingClientRect();
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      targetTime += (delta / rect.width) * 0.8 * video.duration;
      targetTime = Math.max(0, Math.min(video.duration, targetTime));
      video.pause();
      applySeek();
    };

    const onMouseLeave = () => {
      prevX = null;
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    const container = video.parentElement;
    video.addEventListener('seeked', onSeeked);
    container?.addEventListener('mousemove', onMouseMove);
    container?.addEventListener('mouseleave', onMouseLeave);

    return () => {
      video.removeEventListener('seeked', onSeeked);
      container?.removeEventListener('mousemove', onMouseMove);
      container?.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <OsWindow
      id="win-head-aria"
      title="🤖 A.R.I.A Neuromorphic Head — head.html"
      isOpen={isOpen}
      isFocused={isFocused}
      zIndex={zIndex}
      initialWidth={720}
      initialHeight={500}
      initialTop={70}
      initialLeft={180}
      onClose={onClose}
      onMin={onMin}
      onFocus={onFocus}
      isInline={isInline}
      hideTitleBar={shouldHideHeader}
      bodyStyle={{
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        background: '#000000',
        height: '100%',
        position: 'relative',
        borderRadius: shouldHideHeader ? '20px' : undefined,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'ew-resize',
          minHeight: '260px',
        }}
      >
        <video
          ref={videoRef}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '70% center' }}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '14px',
            background: 'rgba(0,0,0,0.72)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '5px 12px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.2)',
            fontSize: '11.5px',
            color: '#38bdf8',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#38bdf8' }} />
          A.R.I.A Vision Core · Online
        </div>

        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '14px',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.7)',
            pointerEvents: 'none',
          }}
        >
          ← Drag to rotate head →
        </div>
      </div>

      {!shouldHideFooter && (
        <div
          style={{
            padding: '10px 16px',
            background: 'rgba(255,255,255,0.06)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ffffff',
            fontSize: '12.5px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ color: '#e2e8f0' }}>
            <strong>A.R.I.A Neuromorphic Head</strong> · v4.2
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {onSetWallpaper && (
              <button
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: '#00f2fe',
                  color: '#000',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
                onClick={() => onSetWallpaper(1)}
              >
                Set Wallpaper
              </button>
            )}

            {onOpenOs && (
              <button
                style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: 'rgba(10, 132, 255, 0.25)',
                  border: '1px solid rgba(10, 132, 255, 0.5)',
                  color: '#60a5fa',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={onOpenOs}
              >
                🖥 macOS View
              </button>
            )}

            <a
              href="/head.html"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#ffffff',
                fontSize: '11.5px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              head.html ↗
            </a>
          </div>
        </div>
      )}
    </OsWindow>
  );
}
