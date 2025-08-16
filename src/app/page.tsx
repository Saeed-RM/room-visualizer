"use client";

import { HouseSimple, Pause, Plus, ShareNetwork, SignOut } from "@phosphor-icons/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Heart } from "lucide-react"; // Favorite + Duplicate icons
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
  const active = rooms[index];
  const handleClose = () => setShowSwiper(false);

  // Mock add new room (just duplicates first room)
  const handleAddRoom = () => {
    const firstRoom = rooms[0];
    const newRoom = {
      ...firstRoom,
      id: `new-${Date.now()}`, // unique id
      name: `New Room ${rooms.length + 1}`,
    };
    setRooms([...rooms, newRoom]);
  };

  return (
    <div className="app-wrapper" style={{ backgroundImage: `url(${active.src})` }}>
      {/* NAVBAR with transition */}
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
            <NavButton ariaLabel="Share" onClick={() => {}}>
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
            <motion.div
              className="swiper-container"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
                  onMoved={(_, newIndex) => setIndex(newIndex)} // update active room
                >
                  {rooms.map((room, i) => (
                    <SplideSlide key={room.id}>
                      <div style={{ width: "100%" }}>
                        <img src={room.src} alt={room.name} className="swiper-image" />
                      </div>
                    </SplideSlide>
                  ))}

                  {/* Last Slide = Add Room */}
                  <SplideSlide key="add-room">
                    <div className="add-room-slide" onClick={handleAddRoom}>
                      <Plus size={48} />
                      <p>Add Room</p>
                    </div>
                  </SplideSlide>
                </Splide>
              </div>

              {/* ROOM INFO SECTION */}
              {index < rooms.length && (
                <div className="room-info">
                  <h3>{active.name.toUpperCase()}</h3>
                  <p>{active.meta}</p>

                  {/* ACTION BUTTONS */}
                  <div className="room-actions">
                    <button className="action-btn">
                      <ShareNetwork size={18} />
                      Share
                    </button>
                    <button className="action-btn">
                      <Heart size={18} />
                      Favorite
                    </button>
                    <button className="action-btn">
                      <Copy size={18} />
                      Duplicate
                    </button>
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
