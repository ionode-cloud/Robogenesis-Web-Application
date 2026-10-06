import { useState, useCallback, useRef } from 'react';

export function useOsWindowManager() {
  const [openWindows, setOpenWindows] = useState(new Set());
  const [minimizedWindows, setMinimizedWindows] = useState(new Set());
  const [zIndexMap, setZIndexMap] = useState({});
  const [focusedWindow, setFocusedWindow] = useState(null);
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
    openMenu,
    openWin,
    minimizeWin,
    restoreWin,
    toggleMinWin,
    showOnlyWin,
    closeWin,
    focusWin,
    toggleMenu,
    closeAllMenus,
  };
}
