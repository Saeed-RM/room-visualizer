"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  DoorOpen,
  Grid2X2,
  Share2,
  X,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

/**
 * Next.js Room Canvas – single-file component
 * -------------------------------------------------
 * What you get:
 * - Fullscreen hero that shows the current room.
 * - Top nav with Exit / Change Room / Rooms / Share.
 * - Clicking "Rooms" enters Rooms Mode:
 *    - Background zooms out + greyscale + blur vignette.
 *    - A centered rounded "room card" appears with smooth animation.
 *    - Swipe (touch/mouse) or use arrows to navigate rooms with slide transitions.
 *    - Keyboard: ←/→ to navigate, ESC to exit rooms mode.
 * - Dots indicator, counter, and accessible buttons.
 *
 * How to use in Next.js (App Router):
 * 1) npm i framer-motion react-swipeable lucide-react
 * 2) Put your room images in /public/rooms (update below paths as needed).
 * 3) Create a file, e.g., app/page.tsx, and export this component as default.
 * 4) Ensure Tailwind is set up (or replace classes with your CSS).
 */

// ---- Demo data ----
const ROOMS: { id: string; name: string; src: string; meta?: string }[] = [
  { id: "living", name: "Living Room", src: "./image_1.jpg", meta: "Floor: Dark forest hardwood · Wall: Pearl white" },
  { id: "kitchen", name: "Kitchen", src: "./image_2.jpg", meta: "Counter: Quartz · Cabinets: Matte white" },
  { id: "bedroom", name: "Bedroom", src: "./image_3.jpg", meta: "Bedding: Linen · Accent: Warm oak" },
];

// Utility to clamp circularly
const mod = (n: number, m: number) => ((n % m) + m) % m;

export default function RoomCanvas() {
  const [mode, setMode] = useState<"view" | "rooms">("view");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const active = ROOMS[index];

  const goTo = useCallback(
    (nextIdx: number, dir: 1 | -1) => {
      if (isAnimating) return;
      setDirection(dir);
      setIndex(mod(nextIdx, ROOMS.length));
    },
    [isAnimating]
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => prev(),
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Keyboard access
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "rooms") return;
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setMode("view");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, next, prev]);

  // Variants
  const bgVariants = {
    view: { filter: "grayscale(0%)", scale: 1, opacity: 1, transition: { duration: 0.5 } },
    rooms: { filter: "grayscale(100%)", scale: 0.92, opacity: 1, transition: { duration: 0.5 } },
  } as const;

  const cardVariants = {
    initial: (dir: 1 | -1) => ({ opacity: 0, x: 60 * dir, scale: 0.985 }),
    enter: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir: 1 | -1) => ({ opacity: 0, x: -60 * dir, scale: 0.985, transition: { duration: 0.35 } }),
  } as const;

  const appearVariants = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    shown: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
  } as const;

  return (
    <div className="relative h-svh w-svw overflow-hidden bg-black text-white">
      {/* Background image */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${active.src})` }}
        animate={mode}
        variants={bgVariants}
      />

      {/* Vignette + blur when in rooms mode */}
      <AnimatePresence>
        {mode === "rooms" && (
          <motion.div
            key="veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 backdrop-blur-[2px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(transparent,rgba(0,0,0,0.35))]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Nav */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        <NavButton ariaLabel="Exit" onClick={() => setMode("view")}>
          <X className="h-4 w-4" />
          <span className="hidden sm:block">Exit</span>
        </NavButton>
        <NavButton ariaLabel="Change Room" onClick={() => alert("Change Room TBD")}> 
          <DoorOpen className="h-4 w-4" />
          <span className="hidden sm:block">Change Room</span>
        </NavButton>
        <NavButton
          ariaLabel="Rooms"
          active={mode === "rooms"}
          onClick={() => setMode("rooms")}
        >
          <Grid2X2 className="h-4 w-4" />
          <span className="hidden sm:block">Rooms</span>
        </NavButton>
        <NavButton ariaLabel="Share" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:block">Share</span>
        </NavButton>
      </div>

      {/* Centered slider card when in rooms mode */}
      <AnimatePresence>
        {mode === "rooms" && (
          <motion.div
            key="roomsCard"
            className="absolute inset-0 z-20 flex items-center justify-center p-4"
            initial="hidden"
            animate="shown"
            exit="hidden"
            variants={appearVariants}
          >
            <div className="relative w-[92vw] max-w-5xl aspect-[16/10]">
              {/* Card frame */}
              <div className="absolute -inset-2 rounded-[28px] bg-black/10 blur-md" />
              <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-neutral-900 shadow-2xl ring-1 ring-white/10">
                {/* Slide area */}
                <div className="absolute inset-0" {...swipeHandlers}>
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                      key={active.id}
                      src={active.src}
                      alt={active.name}
                      className="absolute h-full w-full object-cover"
                      variants={cardVariants}
                      custom={direction}
                      initial="initial"
                      animate="enter"
                      exit="exit"
                      onAnimationStart={() => setIsAnimating(true)}
                      onAnimationComplete={() => setIsAnimating(false)}
                      draggable={false}
                    />
                  </AnimatePresence>

                  {/* Content overlay */}
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <div className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium backdrop-blur ">
                      {active.name}
                    </div>
                    <div className="rounded-full bg-black/40 px-3 py-1 text-xs backdrop-blur">{index + 1} / {ROOMS.length}</div>
                  </div>

                  {/* Bottom meta bar */}
                  {active.meta && (
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <div className="mx-auto max-w-lg rounded-lg bg-black/40 px-3 py-2 text-center text-xs leading-5 backdrop-blur">
                        {active.meta}
                      </div>
                    </div>
                  )}

                  {/* Arrows */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-2">
                    <div className="pointer-events-auto">
                      <IconButton ariaLabel="Previous room" onClick={prev} disabled={isAnimating}>
                        <ChevronLeft className="h-6 w-6" />
                      </IconButton>
                    </div>
                    <div className="pointer-events-auto">
                      <IconButton ariaLabel="Next room" onClick={next} disabled={isAnimating}>
                        <ChevronRight className="h-6 w-6" />
                      </IconButton>
                    </div>
                  </div>
                </div>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                  {ROOMS.map((r, i) => (
                    <button
                      key={r.id}
                      aria-label={`Go to ${r.name}`}
                      onClick={() => goTo(i, i > index ? 1 : -1)}
                      className={`h-2.5 w-2.5 rounded-full transition-opacity ${
                        i === index ? "bg-white" : "bg-white/50 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen reader friendly heading */}
      <h1 className="sr-only">Room Viewer</h1>
    </div>
  );
}

// ---------------- UI helpers ----------------
function NavButton({
  children,
  onClick,
  ariaLabel,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  active?: boolean;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-white text-black shadow"
          : "bg-black/60 text-white backdrop-blur hover:bg-black/80"
      }`}
    >
      {children}
    </button>
  );
}

function IconButton({
  children,
  onClick,
  ariaLabel,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  disabled?: boolean;
}) {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-black/50 p-2 text-white backdrop-blur transition hover:bg-black/70 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
