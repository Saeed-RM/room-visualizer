"use client";

import { Copy, Heart, HeartStraight, HouseSimple, Pause, Plus, ShareNetwork, SignOut } from "@phosphor-icons/react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Room {
  id: string;
  name: string;
  src: string;
  floor?: string;
  wall?: string;
  isFavorite?: boolean;
}

const LOCAL_STORAGE_KEY = "cachedRooms";

const App = () => {
  const [showSwiper, setShowSwiper] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const active = rooms[index];

  // Load rooms from localStorage or default
  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) {
      setRooms(JSON.parse(cached));
    } else {
      const initialRooms: Room[] = [
        { id: "living", name: "Living Room", src: "./image_1.jpg", floor: "Dark forest hardwood", wall:"Pearl white", isFavorite: false },
        { id: "kitchen", name: "Kitchen", src: "./image_2.jpg", floor: "Counter - Quartz", wall:" Cabinets - Matte white", isFavorite: false },
        { id: "bedroom", name: "Bedroom", src: "./image_3.jpg", floor: "Bedding - Linen", wall:" Accent - Warm oak", isFavorite: false },
      ];
      setRooms(initialRooms);
    }
  }, []);

  // Persist rooms whenever they change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms));
  }, [rooms]);

  const handleClose = () => setShowSwiper(false);

  const handleAddRoom = () => {
    const newRoom: Room = { ...rooms[0], id: `room-${rooms.length + 1}`, name: `New Room ${rooms.length + 1}`, isFavorite: false };
    setRooms(prev => [newRoom, ...prev]);
    setIndex(0);
    setCurrentSlide(0);
  };

  const toggleFavorite = (roomId: string) => {
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const duplicateRoom = (roomId: string) => {
    const roomToDuplicate = rooms.find(r => r.id === roomId);
    if (!roomToDuplicate) return;
    const newRoom: Room = { ...roomToDuplicate, id: `room-${rooms.length + 1}`, name: `${roomToDuplicate.name} Copy` };
    setRooms(prev => [newRoom, ...prev]);
    setIndex(0);
    setCurrentSlide(0);

    toast(`"${newRoom.name}" duplicated!`);
  };

  useEffect(() => {
    if (showSwiper) setCurrentSlide(index);
  }, [showSwiper, index]);

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
              <SignOut size={18} />
              <span>Exit</span>
            </NavButton>
            <NavButton ariaLabel="Change Room" onClick={() => alert("Change Room TBD")}>
              <HouseSimple size={18} />
              <span>Change Room</span>
            </NavButton>
            <NavButton ariaLabel="Rooms" onClick={() => setShowSwiper(true)}>
              <Pause size={18} />
              <span>Rooms</span>
            </NavButton>
            <NavButton ariaLabel="Share">
              <ShareNetwork size={18} />
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
              className="bg-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <button className="close-btn" onClick={handleClose}>✕</button>
            </motion.div>

            <motion.div
              className="swiper-container"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="swiper-content">
                <Splide
                  options={{
                    padding: "15rem",
                    gap: "30px",
                    rewind: false,
                    arrows: false,
                    pagination: false,
                    start: currentSlide,
                  }}
                  onDrag={() => setIsSwiping(true)}
                  onMove={() => setIsSwiping(true)}
                  onMoved={(_, newIndex) => {
                    setCurrentSlide(newIndex);
                    setIndex(newIndex);
                    setIsSwiping(false);
                  }}
                  onDragged={() => setIsSwiping(false)}
                >
                  {rooms.map((room, i) => (
                    <SplideSlide key={room.id}>
                      <div
                        className={`slide-frame ${isSwiping ? "blurring" : ""}`}
                        onClick={() => {
                          if (i !== index) {
                            const splide = document.querySelector(".splide")?.splide;
                            splide?.go(i);
                          }
                        }}
                      >
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
              {active && (
                <motion.div
                  className="room-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, filter: isSwiping ? "blur(5px)" : "blur(0px)" }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="room-info-wrapper">
                    <div>
                      <h3>{active.name.toUpperCase()}</h3>
                      <p>
                        Floor - {active.floor} <span style={{ marginLeft: '20px' }}>Wall - {active.wall}</span>
                      </p>
                    </div>
                    <div className="actions">
                      <button><ShareNetwork size={18} /> Share</button>
                      <button
                        style={{ backgroundColor: active.isFavorite ? '#ff000087' : 'revert-layer' }}
                        onClick={() => toggleFavorite(active.id)}
                      >
                        {active.isFavorite ? <Heart size={18} weight="fill" style={{ color: 'red' }} /> : <HeartStraight size={18} />} Favorite
                      </button>
                      <button onClick={() => duplicateRoom(active.id)}>
                        <Copy size={18} /> Duplicate
                      </button>
                    </div>
                  </div>
                </motion.div>
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
