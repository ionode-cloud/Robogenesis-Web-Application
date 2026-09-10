import { useState, useEffect } from 'react';
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';
import image4 from '../assets/image4.jpg';
import image5 from '../assets/image5.jpg';

export const WALLPAPER_SLIDES = [
  { id: 'image1', src: image1, title: 'RoboLab Background 1' },
  { id: 'image2', src: image2, title: 'RoboLab Background 2' },
  { id: 'image3', src: image3, title: 'RoboLab Background 3' },
  { id: 'image4', src: image4, title: 'RoboLab Background 4' },
  { id: 'image5', src: image5, title: 'RoboLab Background 5' },
];

export default function WallpaperLayer({ wallpaper }) {
  const [activeIdx, setActiveIdx] = useState(0);

  // Dynamic slideshow automatically cycles across image1, image2, image3, image4, image5
  useEffect(() => {
    if (wallpaper?.type && wallpaper.type !== 'slideshow') return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % WALLPAPER_SLIDES.length);
    }, 4000); // Smooth transition every 4 seconds

    return () => clearInterval(timer);
  }, [wallpaper?.type]);

  // Video Wallpaper Mode
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

  // Static Single Image Wallpaper Mode
  if (wallpaper?.type === 'image') {
    return (
      <div className="os-desktop-slideshow-container" aria-label={wallpaper.name || 'RoboLab Background'}>
        <img
          src={wallpaper.src}
          alt={wallpaper.name || 'RoboLab Background'}
          className="os-desktop-slide active"
          loading="eager"
        />
        <div className="os-desktop-slideshow-overlay" />
      </div>
    );
  }

  // Default Dynamic Slideshow Mode (all 5 images: image1, image2, image3, image4, image5)
  return (
    <div className="os-desktop-slideshow-container" aria-label="RoboLab Dynamic Workspace Background">
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
