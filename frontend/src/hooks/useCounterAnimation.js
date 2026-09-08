import { useEffect, useRef } from 'react';

/**
 * Animates a number from 0 to `target` when the element enters the viewport.
 * @param {number} target
 * @param {number} duration ms
 * @returns ref to attach to a DOM element
 */
export function useCounterAnimation(target, duration = 1500) {
  const elRef = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
          };
          requestAnimationFrame(update);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return elRef;
}
