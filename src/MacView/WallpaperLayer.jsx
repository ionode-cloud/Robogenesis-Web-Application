import { useState, useEffect } from 'react';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const WALLPAPER_SLIDES = [
  { id: 'image1', src: image1, title: 'macOS Wallpaper 1' },
  { id: 'image2', src: image2, title: 'macOS Wallpaper 2' },
  { id: 'image3', src: image3, title: 'macOS Wallpaper 3' },
];

export default function WallpaperLayer({ wallpaper }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Change image every 3 seconds (3000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % WALLPAPER_SLIDES.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="os-desktop-slideshow-container" aria-label="macOS Dynamic Wallpaper Slideshow">
      {WALLPAPER_SLIDES.map((slide, idx) => (
        <img
          key={slide.id}
          src={slide.src}
          alt={slide.title}
          className={`os-desktop-slide ${idx === activeIdx ? 'active' : ''}`}
          loading="eager"
        />
      ))}
      <div className="os-desktop-slideshow-overlay" />
    </div>
  );
}
