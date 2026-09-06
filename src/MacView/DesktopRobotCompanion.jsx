import React, { useState, useEffect, useRef, useCallback } from 'react';
import './DesktopRobotCompanion.css';

// Full-screen boundaries (covers entire macOS desktop below top menubar)
const SCREEN_MIN_X = 12;
const SCREEN_MIN_Y = 34; // Right below menubar (32px)
const ROBOT_WIDTH = 96;
const ROBOT_HEIGHT = 110;
const FOLLOW_IDLE_TIMEOUT_MS = 6000; // Follows for 6s after last mouse click/move

// Speed constants are expressed "per 60fps frame" — actual movement each
// tick is scaled by `dt` (see tick()) so motion stays consistent regardless
// of the display's actual refresh rate or frame hitches.
const FOLLOW_MIN_SPEED = 2.4;
const FOLLOW_MAX_SPEED = 4.8;
const WANDER_SPEED = 2.2;

// Hysteresis band so the robot doesn't flicker between "following" and
// "happy" when the cursor sits right at the edge of arrival distance.
const PROXIMITY_ENTER = 60;
const PROXIMITY_EXIT = 90;

const SPEECH_PHRASES = [
  'BEEP BOOP! 🤖',
  'FOLLOWING YOU! 🐾',
  'ON MY WAY! ⚡',
  'I LOVE MACOS! 🍎',
  'EXPLORING! 🚀',
  'WEEEEE! 🎉',
  '❤️ SYSTEM ONLINE',
];

const LANDING_SPEECH_PHRASES = [
  'HELLO EXPLORER! 🤖',
  'SCROLL TO EXPLORE! 📜',
  'I CLIMB TOP TO BOTTOM! ⬇️',
  'I GLIDE BOTTOM TO TOP! ⬆️',
  'SWITCH TABS ABOVE! ⚡',
  'ROBOGENESIS ONLINE! ❤️',
  'WELCOME ABOARD! 🎉',
];

const VALID_PAGES = ['home', 'about', 'domains', 'products', 'contact'];

function getInitialPos(mode) {
  if (mode === 'landing') {
    return {
      x: Math.max(SCREEN_MIN_X, typeof window !== 'undefined' ? window.innerWidth - ROBOT_WIDTH - 28 : 500),
      y: 80,
    };
  }
  return {
    x: Math.max(SCREEN_MIN_X, Math.min(window.innerWidth - ROBOT_WIDTH - 20, window.innerWidth * 0.45)),
    y: Math.max(SCREEN_MIN_Y + 40, Math.min(window.innerHeight - ROBOT_HEIGHT - 60, window.innerHeight * 0.55)),
  };
}

export default function DesktopRobotCompanion({ mode = 'desktop', currentPage = 'home' }) {
  const [facing, setFacing] = useState('right'); // 'left' | 'right'
  const [behavior, setBehavior] = useState('walking');
  const [bubbleText, setBubbleText] = useState('');
  const [showBubble, setShowBubble] = useState(false);

  // Position lives ONLY in a ref + the DOM (via robotAnchorRef). It is
  // intentionally NOT React state — updating it 60x/sec via setState was
  // forcing a full re-render every frame and fighting with the CSS
  // transition that used to live on .drc-robot. Direct style mutation on
  // the anchor node gives buttery, uncoupled-from-React motion.
  const posRef = useRef(getInitialPos(mode));
  const robotAnchorRef = useRef(null);

  const mousePosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const isFollowingModeRef = useRef(false);
  const lastFollowInteractionRef = useRef(0);
  const autonomousTargetRef = useRef(null);
  const stateTimerRef = useRef(Date.now());
  const nextBehaviorDelayRef = useRef(8000);
  const bubbleTimeoutRef = useRef(null);
  const audioCtxRef = useRef(null);
  const reachedCursorRef = useRef(false); // hysteresis flag for follow -> happy

  // Drag and drop state & refs
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const dragStartPointerRef = useRef({ x: 0, y: 0 });
  const dragStartRobotPosRef = useRef({ x: 0, y: 0 });
  const hasDraggedSignificantlyRef = useRef(false);

  // Landing page horizontal movement (left to right & right to left patrol)
  const patrolDirectionRef = useRef('left'); // 'right' | 'left'
  const patrolTargetXRef = useRef(null);
  const patrolPauseTimerRef = useRef(0);

  // Landing page scroll & tab-transition state refs
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollTargetYRef = useRef(80);
  const lastScrollTimeRef = useRef(0);
  const tabTransitionRef = useRef(null);
  const prevPageRef = useRef(currentPage);
  const landingIdleTimerRef = useRef(0);

  const applyTransform = useCallback((x, y) => {
    if (robotAnchorRef.current) {
      robotAnchorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
  }, []);

  const playCuteBeep = useCallback((type = 'happy') => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (type === 'happy') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
      }
    } catch {
      // Audio autoplay policy or not supported - silent fallback
    }
  }, []);

  const triggerBubble = useCallback((text, duration = 2500) => {
    setBubbleText(text);
    setShowBubble(true);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, duration);
  }, []);

  const pickRandomWaypoint = useCallback(() => {
    const maxX = Math.max(SCREEN_MIN_X + 60, window.innerWidth - ROBOT_WIDTH - 15);
    const maxY = Math.max(SCREEN_MIN_Y + 60, window.innerHeight - ROBOT_HEIGHT - 35);

    const rx = Math.floor(Math.random() * (maxX - SCREEN_MIN_X) + SCREEN_MIN_X);
    const ry = Math.floor(Math.random() * (maxY - SCREEN_MIN_Y) + SCREEN_MIN_Y);

    autonomousTargetRef.current = { x: rx, y: ry };
    return { x: rx, y: ry };
  }, []);

  // Landing Page Scroll Tracker: Top-to-Bottom on scroll down, Bottom-to-Top on scroll up
  useEffect(() => {
    if (mode !== 'landing') return;

    const updateScrollTarget = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const scrollFraction = Math.max(0, Math.min(1, scrollY / maxScroll));

      const minY = 80;
      const maxY = Math.max(minY + 50, winHeight - ROBOT_HEIGHT - 35);
      const targetY = minY + scrollFraction * (maxY - minY);
      scrollTargetYRef.current = targetY;

      const delta = scrollY - lastScrollYRef.current;
      lastScrollYRef.current = scrollY;

      if (Math.abs(delta) > 1.5) {
        // Yield tab transition to active user scroll immediately
        if (tabTransitionRef.current) {
          tabTransitionRef.current = null;
        }
        lastScrollTimeRef.current = performance.now();
        if (delta > 0) {
          setFacing('right'); // Scrolling down: facing right
        } else {
          setFacing('left');  // Scrolling up: facing left
        }
        setBehavior('walking');
      }
    };

    updateScrollTarget();
    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    window.addEventListener('resize', updateScrollTarget, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollTarget);
      window.removeEventListener('resize', updateScrollTarget);
    };
  }, [mode]);

  // Landing Page Tab-to-Tab Navigation Transitions: Smooth Top-to-Bottom / Bottom-to-Top
  useEffect(() => {
    if (mode !== 'landing') return;
    const prevPage = prevPageRef.current;
    if (prevPage && prevPage !== currentPage) {
      const prevIdx = VALID_PAGES.indexOf(prevPage);
      const nextIdx = VALID_PAGES.indexOf(currentPage);

      if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
        const isForward = nextIdx > prevIdx;
        const targetName = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
        const targetX = Math.max(SCREEN_MIN_X, window.innerWidth - ROBOT_WIDTH - 28);
        const minY = 80;
        const maxY = Math.max(minY + 50, window.innerHeight - ROBOT_HEIGHT - 35);

        if (isForward) {
          // Advancing tabs (e.g. Home -> About -> Products): smooth TOP to BOTTOM
          tabTransitionRef.current = {
            active: true,
            startY: minY,
            targetY: maxY,
            startX: targetX,
            targetX: targetX,
            startTime: performance.now(),
            duration: 1200,
            direction: 'down',
          };
          setFacing('right');
          setBehavior('walking');
          playCuteBeep('happy');
          triggerBubble(`To ${targetName}! 🚀`, 2400);
        } else {
          // Returning tabs (e.g. Contact -> Products -> Home): smooth BOTTOM to TOP
          tabTransitionRef.current = {
            active: true,
            startY: maxY,
            targetY: minY,
            startX: targetX,
            targetX: targetX,
            startTime: performance.now(),
            duration: 1200,
            direction: 'up',
          };
          setFacing('left');
          setBehavior('walking');
          playCuteBeep('happy');
          triggerBubble(`Back to ${targetName}! ⚡`, 2400);
        }
      }
    }
    prevPageRef.current = currentPage;
  }, [currentPage, mode, playCuteBeep, triggerBubble]);

  // Mouse & Touch interaction tracking (Desktop Mode)
  useEffect(() => {
    if (mode !== 'desktop') return;

    const handlePointerDown = (e) => {
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      if (typeof clientX === 'number' && typeof clientY === 'number') {
        mousePosRef.current = { x: clientX, y: clientY };
        isFollowingModeRef.current = true;
        lastFollowInteractionRef.current = Date.now();
        autonomousTargetRef.current = null;
        reachedCursorRef.current = false;

        playCuteBeep('happy');
        triggerBubble('Following you! 🐾', 2000);
      }
    };

    const handlePointerMove = (e) => {
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      if (typeof clientX === 'number' && typeof clientY === 'number') {
        mousePosRef.current = { x: clientX, y: clientY };
        if (isFollowingModeRef.current) {
          lastFollowInteractionRef.current = Date.now();
        }
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [mode, playCuteBeep, triggerBubble]);

  // Main Motion Engine (RAF, dt-normalized)
  useEffect(() => {
    let animationFrameId;
    let lastTime = performance.now();

    if (mode === 'desktop') {
      pickRandomWaypoint();
    }
    applyTransform(posRef.current.x, posRef.current.y);

    const tick = (now) => {
      // Clamp dt so a tab-switch or long GC pause doesn't cause a huge jump.
      const elapsedMs = Math.min(now - lastTime, 48);
      lastTime = now;
      const dt = elapsedMs / (1000 / 60); // 1.0 == a normal 60fps frame

      // ==========================================
      // A. LANDING PAGE MODE (SCROLL, HORIZONTAL PATROL & TAB TRACKING)
      // ==========================================
      if (mode === 'landing') {
        if (isDraggingRef.current) {
          // Position directly driven by pointermove for zero-latency dragging
          animationFrameId = requestAnimationFrame(tick);
          return;
        }

        if (tabTransitionRef.current && tabTransitionRef.current.active) {
          const { startY, targetY, startTime, duration, direction } = tabTransitionRef.current;
          const elapsed = now - startTime;
          const progress = Math.min(1, Math.max(0, elapsed / duration));

          // Smooth cubic in-out ease
          const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          const currentY = startY + (targetY - startY) * ease;
          const sway = Math.sin(progress * Math.PI * 6) * 12;
          const currentX = Math.max(SCREEN_MIN_X, Math.min(window.innerWidth - ROBOT_WIDTH - 20, posRef.current.x + sway));

          posRef.current = { x: currentX, y: currentY };
          applyTransform(currentX, currentY);

          if (progress >= 1) {
            tabTransitionRef.current = null;
            setBehavior('happy');
            playCuteBeep('happy');
          }
        } else {
          const currentPos = posRef.current;
          const targetY = scrollTargetYRef.current;
          const dy = targetY - currentPos.y;
          const distY = Math.abs(dy);
          const isRecentScroll = (now - lastScrollTimeRef.current) < 550;

          // Vertical scroll tracking
          if (distY > 1.5) {
            const stepY = dy * Math.min(1, 0.14 * dt);
            posRef.current.y = currentPos.y + stepY;
          }

          // Horizontal left-to-right / right-to-left patrol across the landing page
          const minPatrolX = SCREEN_MIN_X + 16;
          const maxPatrolX = Math.max(minPatrolX + 80, window.innerWidth - ROBOT_WIDTH - 24);

          if (patrolTargetXRef.current === null) {
            patrolTargetXRef.current = patrolDirectionRef.current === 'right' ? maxPatrolX : minPatrolX;
          }

          if (now < patrolPauseTimerRef.current) {
            // Resting/looking around
            if (isRecentScroll) {
              setBehavior('walking');
              if (dy > 1.5) setFacing('right');
              else if (dy < -1.5) setFacing('left');
            } else {
              if (behavior === 'walking') setBehavior('sitting');
            }
          } else {
            // Actively walking left to right or right to left
            const targetPatrolX = patrolDirectionRef.current === 'right' ? maxPatrolX : minPatrolX;
            const dx = targetPatrolX - currentPos.x;

            if (Math.abs(dx) > 12) {
              const stepX = Math.sign(dx) * Math.min(Math.abs(dx), 1.8 * dt);
              posRef.current.x = currentPos.x + stepX;
              setFacing(dx > 0 ? 'right' : 'left');
              setBehavior('walking');
            } else {
              // Reached edge! Pause for 2.6s - 4.5s, then flip direction
              patrolPauseTimerRef.current = now + 2600 + Math.random() * 2000;
              patrolDirectionRef.current = patrolDirectionRef.current === 'right' ? 'left' : 'right';
              patrolTargetXRef.current = patrolDirectionRef.current === 'right' ? maxPatrolX : minPatrolX;
              setBehavior(Math.random() < 0.55 ? 'happy' : 'sitting');
            }
          }

          applyTransform(posRef.current.x, posRef.current.y);
        }

        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // ==========================================
      // B. MACOS VIEW MODE (AUTONOMOUS WANDER & MOUSE FOLLOW)
      // ==========================================
      const currentPos = posRef.current;
      const isFollowing =
        isFollowingModeRef.current && now - lastFollowInteractionRef.current < FOLLOW_IDLE_TIMEOUT_MS;

      const screenMaxX = Math.max(SCREEN_MIN_X + 60, window.innerWidth - ROBOT_WIDTH - 15);
      const screenMaxY = Math.max(SCREEN_MIN_Y + 60, window.innerHeight - ROBOT_HEIGHT - 35);

      if (isFollowing) {
        // 1. CLICK-TO-FOLLOW MOUSE MODE
        const targetX = Math.max(SCREEN_MIN_X, Math.min(screenMaxX, mousePosRef.current.x - ROBOT_WIDTH / 2));
        const targetY = Math.max(SCREEN_MIN_Y, Math.min(screenMaxY, mousePosRef.current.y - ROBOT_HEIGHT / 2));

        const dx = targetX - currentPos.x;
        const dy = targetY - currentPos.y;
        const dist = Math.hypot(dx, dy);

        if (Math.abs(dx) > 6) {
          setFacing(dx > 0 ? 'right' : 'left');
        }

        // Hysteresis proximity check
        if (reachedCursorRef.current) {
          if (dist > PROXIMITY_EXIT) reachedCursorRef.current = false;
        } else if (dist < PROXIMITY_ENTER) {
          reachedCursorRef.current = true;
        }

        if (!reachedCursorRef.current && dist > 0.5) {
          const speed = Math.min(FOLLOW_MAX_SPEED, Math.max(FOLLOW_MIN_SPEED, dist * 0.06)) * dt;
          const step = Math.min(speed, dist);
          const nextX = currentPos.x + (dx / dist) * step;
          const nextY = currentPos.y + (dy / dist) * step;

          posRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
          setBehavior('following');
        } else {
          setBehavior('happy');
        }
      } else {
        if (isFollowingModeRef.current) {
          isFollowingModeRef.current = false;
          reachedCursorRef.current = false;
          pickRandomWaypoint();
          setBehavior('walking');
          stateTimerRef.current = now;
          nextBehaviorDelayRef.current = 9000;
        }

        // 2. AUTONOMOUS WALKING ON ENTIRE SCREEN & SLEEPING
        if (autonomousTargetRef.current) {
          const { x: tx, y: ty } = autonomousTargetRef.current;
          const dx = tx - currentPos.x;
          const dy = ty - currentPos.y;
          const dist = Math.hypot(dx, dy);

          if (Math.abs(dx) > 6) {
            setFacing(dx > 0 ? 'right' : 'left');
          }

          if (dist > 15) {
            const step = Math.min(WANDER_SPEED * dt, dist);
            const nextX = currentPos.x + (dx / dist) * step;
            const nextY = currentPos.y + (dy / dist) * step;
            posRef.current = { x: nextX, y: nextY };
            applyTransform(nextX, nextY);
            setBehavior('walking');
          } else {
            autonomousTargetRef.current = null;
            stateTimerRef.current = now;

            const rand = Math.random();
            if (rand < 0.45) {
              setBehavior('sleeping');
              nextBehaviorDelayRef.current = 7500 + Math.random() * 5500;
            } else if (rand < 0.75) {
              setBehavior('sitting');
              nextBehaviorDelayRef.current = 4500 + Math.random() * 3500;
            } else {
              setBehavior('dancing');
              nextBehaviorDelayRef.current = 3500 + Math.random() * 2500;
            }
          }
        } else {
          if (now - stateTimerRef.current > nextBehaviorDelayRef.current) {
            pickRandomWaypoint();
            setBehavior('walking');
            stateTimerRef.current = now;
            nextBehaviorDelayRef.current = 10000;
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mode, pickRandomWaypoint, applyTransform]);

  const handleClickRobot = (e) => {
    e.stopPropagation();
    playCuteBeep('happy');
    setBehavior('happy');

    if (mode === 'desktop') {
      isFollowingModeRef.current = true;
      lastFollowInteractionRef.current = Date.now();
      autonomousTargetRef.current = null;
      reachedCursorRef.current = true;
      const randomPhrase = SPEECH_PHRASES[Math.floor(Math.random() * SPEECH_PHRASES.length)];
      triggerBubble(randomPhrase, 2200);
    } else {
      const randomPhrase = LANDING_SPEECH_PHRASES[Math.floor(Math.random() * LANDING_SPEECH_PHRASES.length)];
      triggerBubble(randomPhrase, 2500);
    }
  };

  // Drag & Drop Pointer Events
  const handleAnchorPointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.stopPropagation();

    isDraggingRef.current = true;
    hasDraggedSignificantlyRef.current = false;
    dragStartPointerRef.current = { x: e.clientX, y: e.clientY };
    dragStartRobotPosRef.current = { x: posRef.current.x, y: posRef.current.y };

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  const handleAnchorPointerMove = (e) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    const dx = e.clientX - dragStartPointerRef.current.x;
    const dy = e.clientY - dragStartPointerRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 5) {
      if (!hasDraggedSignificantlyRef.current) {
        hasDraggedSignificantlyRef.current = true;
        setIsDragging(true);
        setBehavior('dancing');
        triggerBubble('WEEEEE! 🚀', 2200);
      }

      const maxX = Math.max(SCREEN_MIN_X, window.innerWidth - ROBOT_WIDTH - 15);
      const maxY = Math.max(50, window.innerHeight - ROBOT_HEIGHT - 20);

      const newX = Math.max(SCREEN_MIN_X, Math.min(maxX, dragStartRobotPosRef.current.x + dx));
      const newY = Math.max(50, Math.min(maxY, dragStartRobotPosRef.current.y + dy));

      posRef.current = { x: newX, y: newY };
      applyTransform(newX, newY);

      if (dx > 2) setFacing('right');
      else if (dx < -2) setFacing('left');
    }
  };

  const handleAnchorPointerUp = (e) => {
    if (!isDraggingRef.current) return;
    e.stopPropagation();

    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }

    if (!hasDraggedSignificantlyRef.current) {
      handleClickRobot(e);
    } else {
      // Dropped!
      const currentX = posRef.current.x;
      const midPoint = window.innerWidth / 2;
      if (currentX < midPoint) {
        patrolDirectionRef.current = 'right';
        patrolTargetXRef.current = Math.max(SCREEN_MIN_X + 60, window.innerWidth - ROBOT_WIDTH - 24);
      } else {
        patrolDirectionRef.current = 'left';
        patrolTargetXRef.current = SCREEN_MIN_X + 16;
      }
      patrolPauseTimerRef.current = performance.now() + 2000;

      setBehavior('happy');
      playCuteBeep('happy');
      triggerBubble('HERE I AM! 📍', 2200);
    }
  };

  const isSleeping = behavior === 'sleeping';
  const isHappy = behavior === 'happy';
  const isDancing = behavior === 'dancing';
  const isSitting = behavior === 'sitting';

  const isNearRight = posRef.current.x > (typeof window !== 'undefined' ? window.innerWidth - 180 : 800);
  const isNearLeft = posRef.current.x < 160;
  const bubbleAnchorClass = isNearRight ? 'anchor-right' : isNearLeft ? 'anchor-left' : '';

  return (
    <div className={`drc-container ${mode === 'landing' ? 'mode-landing' : ''}`}>
      {/* Position-only wrapper: transform is set imperatively in the RAF
          loop via robotAnchorRef, never via React state, so it can't be
          fought over by CSS transitions or keyframe animations. */}
      <div
        ref={robotAnchorRef}
        className={`drc-robot-anchor ${isDragging ? 'is-dragging' : ''}`}
        style={{ transform: `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)` }}
        onPointerDown={handleAnchorPointerDown}
        onPointerMove={handleAnchorPointerMove}
        onPointerUp={handleAnchorPointerUp}
        onPointerCancel={handleAnchorPointerUp}
        title={mode === 'landing' ? 'A.R.I.A Jr. Landing Guide (Drag & drop anywhere, or click to interact)' : 'A.R.I.A Jr. Desktop Companion (Touch to interact)'}
      >
        {/* Behavior + facing live here; this element's transform is fully
            owned by the CSS keyframe animations (waddle, dance, etc.). */}
        <div className={`drc-robot state-${behavior} facing-${facing}`}>
          <div className={`drc-bubble ${showBubble ? 'active' : ''} ${posRef.current.y < 70 ? 'bubble-bottom' : ''} ${bubbleAnchorClass}`}>
            {bubbleText}
          </div>

          <div className="drc-zzz">Zzz</div>

          <div className="drc-floor-shadow" />

          <svg className="drc-svg" viewBox="0 0 96 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="drc-chassis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#454b56" />
                <stop offset="35%" stopColor="#2e323b" />
                <stop offset="70%" stopColor="#22252c" />
                <stop offset="100%" stopColor="#16181d" />
              </linearGradient>

              <linearGradient id="drc-rim-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#686f7e" stopOpacity="0.8" />
                <stop offset="30%" stopColor="#454b56" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#16181d" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="drc-bezel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1c1e24" />
                <stop offset="100%" stopColor="#0f1013" />
              </linearGradient>

              <radialGradient id="drc-glass-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#1b1e28" />
                <stop offset="75%" stopColor="#101217" />
                <stop offset="100%" stopColor="#090a0d" />
              </radialGradient>

              <linearGradient id="drc-dial-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#505663" />
                <stop offset="50%" stopColor="#2c3038" />
                <stop offset="100%" stopColor="#191b20" />
              </linearGradient>

              <filter id="drc-led-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="blur1" />
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g className="drc-legs-group">
              {isSitting ? (
                <g className="drc-sitting-legs">
                  <ellipse cx="37" cy="88" rx="10" ry="7" fill="url(#drc-chassis-grad)" stroke="#1a1c22" strokeWidth="1" />
                  <ellipse cx="59" cy="88" rx="10" ry="7" fill="url(#drc-chassis-grad)" stroke="#1a1c22" strokeWidth="1" />
                  <ellipse cx="37" cy="86" rx="7" ry="3.5" fill="#4a505c" opacity="0.45" />
                  <ellipse cx="59" cy="86" rx="7" ry="3.5" fill="#4a505c" opacity="0.45" />
                </g>
              ) : (
                <>
                  <g className="drc-leg-l">
                    <rect x="30" y="78" width="14" height="18" rx="7" fill="url(#drc-chassis-grad)" stroke="#1a1c22" strokeWidth="1" />
                    <ellipse cx="37" cy="94" rx="7" ry="3.5" fill="#14151a" />
                    <path d="M 31 82 Q 37 80 43 82" stroke="#686f7e" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  </g>
                  <g className="drc-leg-r">
                    <rect x="52" y="78" width="14" height="18" rx="7" fill="url(#drc-chassis-grad)" stroke="#1a1c22" strokeWidth="1" />
                    <ellipse cx="59" cy="94" rx="7" ry="3.5" fill="#14151a" />
                    <path d="M 53 82 Q 59 80 65 82" stroke="#686f7e" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
                  </g>
                </>
              )}
            </g>

            <g className="drc-body-group">
              <g className="drc-arm-l">
                <rect x="18" y="55" width="12" height="24" rx="6" fill="url(#drc-chassis-grad)" stroke="#181a1f" strokeWidth="1" />
                <circle cx="24" cy="74" r="5" fill="#242730" />
              </g>

              <rect x="26" y="50" width="44" height="36" rx="18" fill="url(#drc-chassis-grad)" stroke="#1b1c22" strokeWidth="1.2" />
              <path d="M 32 54 Q 48 51 64 54" stroke="#686f7e" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
              <circle cx="48" cy="70" r="2.5" fill="#1b1d22" stroke="#323640" strokeWidth="0.8" />

              <g className="drc-arm-r">
                <rect x="66" y="55" width="12" height="24" rx="6" fill="url(#drc-chassis-grad)" stroke="#181a1f" strokeWidth="1" />
                <circle cx="72" cy="74" r="5" fill="#242730" />
              </g>
            </g>

            <g className="drc-head-group">
              <g className="drc-antennas">
                <rect x="29" y="3" width="6" height="7" rx="2.5" fill="url(#drc-dial-grad)" stroke="#16181d" strokeWidth="0.8" />
                <circle cx="32" cy="3.5" r="2" fill="#585f6e" />
                <rect x="61" y="3" width="6" height="7" rx="2.5" fill="url(#drc-dial-grad)" stroke="#16181d" strokeWidth="0.8" />
                <circle cx="64" cy="3.5" r="2" fill="#585f6e" />
              </g>

              <g className="drc-ear-l">
                <rect x="7" y="24" width="7" height="18" rx="3.5" fill="url(#drc-dial-grad)" stroke="#16181d" strokeWidth="1" />
                <line x1="8" y1="33" x2="13" y2="33" stroke="#484f5c" strokeWidth="1.2" />
              </g>
              <g className="drc-ear-r">
                <rect x="82" y="24" width="7" height="18" rx="3.5" fill="url(#drc-dial-grad)" stroke="#16181d" strokeWidth="1" />
                <line x1="83" y1="33" x2="88" y2="33" stroke="#484f5c" strokeWidth="1.2" />
              </g>

              <rect x="12" y="7" width="72" height="53" rx="20" ry="18" fill="url(#drc-chassis-grad)" stroke="#131418" strokeWidth="1.5" />
              <rect x="13.5" y="8.5" width="69" height="50" rx="18.5" ry="16.5" fill="url(#drc-rim-highlight)" pointerEvents="none" />

              <rect x="17" y="12" width="62" height="43" rx="15" ry="14" fill="url(#drc-bezel-grad)" stroke="#1a1c22" strokeWidth="1.2" />

              <rect x="20" y="15" width="56" height="37" rx="12" ry="11" fill="url(#drc-glass-grad)" />

              <path d="M 23 17 L 46 17 C 36 24 28 27 23 31 Z" fill="rgba(255, 255, 255, 0.09)" pointerEvents="none" />

              <line x1="22" y1="23" x2="74" y2="23" className="drc-screen-scanline" />
              <line x1="22" y1="29" x2="74" y2="29" className="drc-screen-scanline" />
              <line x1="22" y1="35" x2="74" y2="35" className="drc-screen-scanline" />
              <line x1="22" y1="41" x2="74" y2="41" className="drc-screen-scanline" />
              <line x1="22" y1="47" x2="74" y2="47" className="drc-screen-scanline" />

              <g filter="url(#drc-led-glow)">
                {isSleeping ? (
                  <g className="drc-battery-pulse">
                    <rect x="34" y="27" width="26" height="14" rx="3" fill="none" stroke="#ffd215" strokeWidth="2.2" />
                    <rect x="60.5" y="31" width="2.5" height="6" rx="1" fill="#ffd215" />
                    <rect x="37.5" y="30" width="4.5" height="8" rx="1" fill="#ffd215" />
                    <rect x="44" y="30" width="4.5" height="8" rx="1" fill="#ffd215" />
                    <rect x="50.5" y="30" width="4.5" height="8" rx="1" fill="#ffd215" />
                  </g>
                ) : isHappy ? (
                  <g>
                    <path d="M 31 34 Q 37 27 43 34" stroke="#ffd215" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                    <path d="M 53 34 Q 59 27 65 34" stroke="#ffd215" strokeWidth="3.4" strokeLinecap="round" fill="none" />
                    <path d="M 42 39 Q 48 48 54 39 Z" fill="#ffd215" />
                  </g>
                ) : isDancing ? (
                  <g>
                    <circle cx="37" cy="31" r="5.6" fill="#ffd215" />
                    <circle cx="59" cy="31" r="5.6" fill="#ffd215" />
                    <path d="M 43 38 Q 48 45 53 38 Z" fill="#ffd215" />
                  </g>
                ) : isSitting ? (
                  <g>
                    <circle cx="37" cy="32" r="5.2" fill="#ffd215" />
                    <circle cx="59" cy="32" r="5.2" fill="#ffd215" />
                    <path d="M 43 39 Q 48 43.5 53 39" stroke="#ffd215" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                  </g>
                ) : (
                  <g>
                    <circle cx="37" cy="31" r="5.2" fill="#ffd215" />
                    <circle cx="59" cy="31" r="5.2" fill="#ffd215" />
                    <path d="M 43 39 Q 48 44 53 39" stroke="#ffd215" strokeWidth="2.6" strokeLinecap="round" fill="none" />
                  </g>
                )}
              </g>
            </g>
          </svg>

          <div className="drc-status-pill">{behavior}</div>
        </div>
      </div>
    </div>
  );
}