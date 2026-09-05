import { useState, useCallback, useRef } from 'react';

const WALLPAPERS = [
  { type: 'gradient' },
  { type: 'video', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4' },
  { type: 'video', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4' },
  { type: 'video', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260603_132049_036591b8-6e92-4760-b94c-a7ea6eef315c.mp4' },
  { type: 'video', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260518_003132_8b7edcb6-c64d-4a52-a9ca-879942e122ad.mp4' },
  { type: 'video', src: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260613_180732_a54afbf6-b30d-470e-861f-669871f09f67.mp4' },
];

export function useOsWindowManager() {
  const [openWindows, setOpenWindows] = useState(new Set());
  const [minimizedWindows, setMinimizedWindows] = useState(new Set());
  const [zIndexMap, setZIndexMap] = useState({});
  const [focusedWindow, setFocusedWindow] = useState(null);
  const [wallpaperIdx, setWallpaperIdx] = useState(0);
  const [openMenu, setOpenMenu] = useState(null);
  const zCounter = useRef(300);

  const openWin = useCallback((id) => {
    setOpenWindows((prev) => new Set(prev).add(id));
    setMinimizedWindows((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    zCounter.current += 1;
    setZIndexMap((prev) => ({ ...prev, [id]: zCounter.current }));
    setFocusedWindow(id);
  }, []);

  const minimizeWin = useCallback((id) => {
    setMinimizedWindows((prev) => new Set(prev).add(id));
    setFocusedWindow((prev) => (prev === id ? null : prev));
  }, []);

  const restoreWin = useCallback((id) => {
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    zCounter.current += 1;
    setZIndexMap((prev) => ({ ...prev, [id]: zCounter.current }));
    setFocusedWindow(id);
  }, []);

  const toggleMinWin = useCallback((id) => {
    let willMinimize = false;
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        willMinimize = true;
      }
      return next;
    });
    if (!willMinimize) {
      zCounter.current += 1;
      setZIndexMap((prev) => ({ ...prev, [id]: zCounter.current }));
      setFocusedWindow(id);
    } else {
      setFocusedWindow((prev) => (prev === id ? null : prev));
    }
  }, []);

  const showOnlyWin = useCallback((id) => {
    setOpenWindows(new Set([id]));
    setMinimizedWindows(new Set());
    zCounter.current += 1;
    setZIndexMap({ [id]: zCounter.current });
    setFocusedWindow(id);
  }, []);

  const closeWin = useCallback((id) => {
    setOpenWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setMinimizedWindows((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setFocusedWindow((prev) => (prev === id ? null : prev));
  }, []);

  const focusWin = useCallback((id) => {
    setMinimizedWindows((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    zCounter.current += 1;
    setZIndexMap((prev) => ({ ...prev, [id]: zCounter.current }));
    setFocusedWindow(id);
  }, []);

  const cycleWallpaper = useCallback(() => {
    setWallpaperIdx((prev) => (prev + 1) % WALLPAPERS.length);
  }, []);

  const setWallpaper = useCallback((idx) => {
    setWallpaperIdx(idx);
  }, []);

  const toggleMenu = useCallback((menuId) => {
    setOpenMenu((prev) => (prev === menuId ? null : menuId));
  }, []);

  const closeAllMenus = useCallback(() => {
    setOpenMenu(null);
  }, []);

  return {
    openWindows,
    minimizedWindows,
    zIndexMap,
    focusedWindow,
    wallpaper: WALLPAPERS[wallpaperIdx],
    wallpaperIdx,
    openMenu,
    openWin,
    minimizeWin,
    restoreWin,
    toggleMinWin,
    showOnlyWin,
    closeWin,
    focusWin,
    cycleWallpaper,
    setWallpaper,
    toggleMenu,
    closeAllMenus,
  };
}
