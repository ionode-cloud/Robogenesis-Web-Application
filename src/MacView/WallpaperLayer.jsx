export default function WallpaperLayer({ wallpaper }) {
  if (wallpaper?.type === 'video') {
    return (
      <div className="os-desktop-video-bg active" id="osBgVideoWrap">
        <video
          key={wallpaper.src}
          src={wallpaper.src}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(5, 11, 24, 0.45)',
          }}
        />
      </div>
    );
  }

  return <div className="os-desktop-bg" />;
}
