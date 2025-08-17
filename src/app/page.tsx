"use client";

import { HouseSimple, Pause, Plus, ShareNetwork, SignOut } from "@phosphor-icons/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const App = () => {
  const [showSwiper, setShowSwiper] = useState(false);

  // ---- Demo data ----
  const [rooms, setRooms] = useState<
    { id: string; name: string; src: string; meta?: string }[]
  >([
    { id: "living", name: "Living Room", src: "./image_1.jpg", meta: "Floor - Dark forest hardwood · Wall - Pearl white" },
    { id: "kitchen", name: "Kitchen", src: "./image_2.jpg", meta: "Counter - Quartz · Cabinets - Matte white" },
    { id: "bedroom", name: "Bedroom", src: "./image_3.jpg", meta: "Bedding - Linen · Accent - Warm oak" },
  ]);

  const [index, setIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const isAddRoomSlide = index === rooms.length;
  const active = !isAddRoomSlide ? rooms[index] : null;

  const handleClose = () => setShowSwiper(false);

  const handleAddRoom = () => {
    setRooms((prev) => [
      ...prev,
      { ...prev[0], id: `room-${prev.length + 1}`, name: `New Room ${prev.length + 1}` },
    ]);
  };

  return (
    <div
      className="app-wrapper"
      style={{ backgroundImage: !showSwiper && active ? `url(${active.src})` : "none" }}
    >
      {/* NAVBAR */}
      <AnimatePresence>
        {!showSwiper && (
          <motion.div
            className="navbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <NavButton ariaLabel="Exit">
              <SignOut size={20} />
              <span>Exit</span>
            </NavButton>
            <NavButton ariaLabel="Change Room" onClick={() => alert("Change Room TBD")}>
              <HouseSimple size={20} />
              <span>Change Room</span>
            </NavButton>
            <NavButton ariaLabel="Rooms" onClick={() => setShowSwiper(true)}>
              <Pause size={20} />
              <span>Rooms</span>
            </NavButton>
            <NavButton ariaLabel="Share">
              <ShareNetwork size={20} />
              <span>Share</span>
            </NavButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SWIPER MODAL */}
      <AnimatePresence>
        {showSwiper && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            {/* Dark Background */}
            <motion.div
              className="bg-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            <motion.div
              className="swiper-container"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* SWIPER */}
              <div className="swiper-content">
                <Splide
                  options={{
                    padding: "15rem",
                    rewind: false,
                    arrows: false,
                    pagination: false,
                  }}
                  onDrag={() => setIsSwiping(true)}
                  onMove={() => setIsSwiping(true)}
                  onMoved={(_, newIndex) => {
                    setIndex(newIndex);
                    setIsSwiping(false);
                  }}
                  onDragged={() => setIsSwiping(false)}
                >
                  {rooms.map((room) => (
                    <SplideSlide key={room.id}>
                      <div className={`slide-frame ${isSwiping ? "blurring" : ""}`}>
                        <img src={room.src} alt={room.name} className="slide-img" />
                      </div>
                    </SplideSlide>
                  ))}

                  {/* Add Room Slide */}
                  <SplideSlide key="add-room">
                    <div className="add-room" onClick={handleAddRoom}>
                      <Plus size={40} />
                      <p>Add Room</p>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>

              {/* ROOM INFO + ACTIONS */}
              {!isAddRoomSlide && active && (
                <div className="room-info">
                  <h3>{active.name.toUpperCase()}</h3>
                  <p>{active.meta}</p>
                  <div className="actions">
                    <button><ShareNetwork size={20} /></button>
                    <button>★</button>
                    <button>⧉</button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;

function NavButton({
  children,
  onClick,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
}) {
  return (
    <button aria-label={ariaLabel} onClick={onClick} className="nav-bar-btn">
      {children}
    </button>
  );
}
