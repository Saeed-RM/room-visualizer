"use client";

import { Splide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { AnimatePresence, motion } from "framer-motion";
import { Room } from '../../types/room';
import AddRoomSlide from "./AddRoomSlide";
import RoomInfo from "./RoomInfo";
import RoomSlide from "./RoomSlide";

type SwiperModalProps = {
  show: boolean;
  rooms: Room[];
  index: number;
  currentSlide: number;
  active?: Room;
  isSwiping: boolean;
  onClose: () => void;
  onAddRoom: () => void;
  onFavorite: (roomId: string) => void;
  onDuplicate: (roomId: string) => void;
  setIndex: (idx: number) => void;
  setCurrentSlide: (idx: number) => void;
  setIsSwiping: (v: boolean) => void;
  setLastRoomIndex: (idx: number) => void;
};

const SwiperModal = ({
  show,
  rooms,
  index,
  currentSlide,
  active,
  isSwiping,
  onClose,
  onAddRoom,
  onFavorite,
  onDuplicate,
  setIndex,
  setCurrentSlide,
  setIsSwiping,
  setLastRoomIndex
}: SwiperModalProps) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div className="bg-dark" />
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

                if (newIndex < rooms.length) setLastRoomIndex(newIndex);
              }}
              onDragged={() => setIsSwiping(false)}
            >
              {rooms.map((room, i) => (
                <RoomSlide
                  key={room.id}
                  id={room.id}
                  src={room.src}
                  name={room.name}
                  isSwiping={isSwiping}
                  isActive={i === index}
                />
              ))}
              <AddRoomSlide onAdd={onAddRoom} />
            </Splide>
          </div>

          {active && (
            <RoomInfo
              active={active}
              isSwiping={isSwiping}
              onFavorite={onFavorite}
              onDuplicate={onDuplicate}
            />
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SwiperModal;
