"use client";

import { HouseSimple, Pause, ShareNetwork, SignOut } from "@phosphor-icons/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AnimatePresence, motion } from "framer-motion";
import { DoorOpen, Grid2X2, Share2, X } from "lucide-react";
import { useState } from "react";

export function generateSlides(
  length = 10,
  sig = 0
): Array<{ src: string; alt: string }> {
  return Array.from({ length }).map((value, index) => {
    index = sig || index;

    return {
      src: `https://dummyimage.com/1000x600/000/fff/${index}`,
      alt: `Image ${index + 1}`,
    };
  });
}

const App = () => {
  const [showSwiper, setShowSwiper] = useState(false);

  // ---- Demo data ----
  const ROOMS: { id: string; name: string; src: string; meta?: string }[] = [
    { id: "living", name: "Living Room", src: "./image_1.jpg", meta: "Floor: Dark forest hardwood · Wall: Pearl white" },
    { id: "kitchen", name: "Kitchen", src: "./image_2.jpg", meta: "Counter: Quartz · Cabinets: Matte white" },
    { id: "bedroom", name: "Bedroom", src: "./image_3.jpg", meta: "Bedding: Linen · Accent: Warm oak" },
  ];

  const [index, setIndex] = useState(0);
  const active = ROOMS[index];

  

  const handleClose = () => setShowSwiper(false);

  return (
    <div className="wrapper" style={{ backgroundImage: `url(${active.src})` }}>
      {/* Top Nav */}
      {!showSwiper &&
        (<div className="navbar">
        <NavButton ariaLabel="Exit">
          <SignOut size={20} />
          <span className="hidden sm:block">Exit</span>
        </NavButton>
        <NavButton ariaLabel="Change Room" onClick={() => alert("Change Room TBD")}>
          <HouseSimple size={20} />
          <span className="hidden sm:block">Change Room</span>
        </NavButton>
        <NavButton ariaLabel="Rooms" onClick={() => setShowSwiper(true)}>
          <Pause size={20} />
          <span className="hidden sm:block">Rooms</span>
        </NavButton>
        <NavButton ariaLabel="Share" onClick={() => {}}>
          <ShareNetwork size={20} />
          <span className="hidden sm:block">Share</span>
        </NavButton>
      </div>)
      }

      {/* Modal Overlay with Animation */}
      <AnimatePresence>
        {showSwiper && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            {/* Swiper container */}
            <motion.div
              className="relative z-50 w-full h-[80%] bg-white rounded-2xl shadow-lg p-4 flex flex-col"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 rounded-full bg-black/60 text-white p-2 hover:bg-black"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex-1 overflow-hidden">
                <Splide
                  options={{
                    padding: "15rem",
                    rewind: false,
                    width: "100%",
                    height: "100%",
                  }}
                  aria-labelledby="basic-example-heading"
                  onMoved={(splide, newIndex) => {
                    console.log("moved", newIndex);
                    console.log("length", splide.length);
                  }}
                >
                  {generateSlides().map((slide) => (
                    <SplideSlide key={slide.src}>
                      <img
                        src={slide.src}
                        alt={slide.alt}
                        className="rounded-lg mx-auto h-full object-contain"
                      />
                    </SplideSlide>
                  ))}
                </Splide>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

function NavBar() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
      <NavButton ariaLabel="Exit">
        <X className="h-4 w-4" />
        <span className="hidden sm:block">Exit</span>
      </NavButton>
      <NavButton ariaLabel="Change Room" onClick={() => alert("Change Room TBD")}>
        <DoorOpen className="h-4 w-4" />
        <span className="hidden sm:block">Change Room</span>
      </NavButton>
      <NavButton ariaLabel="Rooms" onClick={() => setShowSwiper(true)}>
        <Grid2X2 className="h-4 w-4" />
        <span className="hidden sm:block">Rooms</span>
      </NavButton>
      <NavButton ariaLabel="Share" onClick={() => {}}>
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:block">Share</span>
      </NavButton>
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
      className={`nav-bar-btn ${
        active
          ? "bg-white text-black shadow"
          : "bg-black/60 text-white backdrop-blur hover:bg-black/80"
      }`}
    >
      {children}
    </button>
  );
}
