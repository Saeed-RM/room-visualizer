"use client";

import "@splidejs/react-splide/css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "./components/Navbar/Navbar";
import SwiperModal from "./components/Swiper/SwiperModal";
import ToastProvider from "./components/ToastProvider";
import { Room } from "./types/room";

const LOCAL_STORAGE_KEY = "cachedRooms";
const ACTIVE_INDEX_KEY = "cachedActiveIndex";

const App = () => {
  const [showSwiper, setShowSwiper] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [lastRoomIndex, setLastRoomIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const active = rooms[index];

  // Dummy room used to be test the add room functionality
  const roomToAdd: Room =  { id: "roomToAdd", name: "Bathroom", src: "./image_5.jpg", floor: "Super Dark floor", wall:"Pearl black", isFavorite: false };

  useEffect(() => {
    const cachedRooms = localStorage.getItem(LOCAL_STORAGE_KEY);
    const cachedIndex = localStorage.getItem(ACTIVE_INDEX_KEY);

    if (cachedRooms) {
      setRooms(JSON.parse(cachedRooms));
    } else {
      setRooms([
        { id: "room-001", name: "Fire Place Room", src: "./image_1.jpg", floor: "Dark forest hardwood", wall:"Pearl white", isFavorite: false },
        { id: "room-002", name: "Living Room", src: "./image_2.jpg", floor: "Counter - Quartz", wall:"Cabinets - Matte white", isFavorite: false },
        { id: "room-003", name: "Bright Living Room", src: "./image_3.jpg", floor: "Bedding - Linen", wall:"Accent - Warm oak", isFavorite: false },
        { id: "room-004", name: "Bedroom", src: "./image_4.jpg", floor: "Hardwood - Linen", wall:"White - Warm oak", isFavorite: false },
      ]);
    }

    if (cachedIndex) {
      const idx = parseInt(cachedIndex, 10);
      if (!isNaN(idx)) {
        setIndex(idx);
        setLastRoomIndex(idx);
        setCurrentSlide(idx);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rooms));
    localStorage.setItem(ACTIVE_INDEX_KEY, index.toString());
  }, [rooms, index]);

  const handleClose = () => {
    setShowSwiper(false);
    setIndex(lastRoomIndex);
    setCurrentSlide(lastRoomIndex);
  };

  const handleAddRoom = () => {
    const newRoom: Room = {
      ...roomToAdd,
      id: `room-${Date.now()}`,
      name: `New Room (${roomToAdd.name}) ${rooms.length + 1}`,
      isFavorite: false,
    };

    toast(`Successfully added "${newRoom.name}"!`, { theme: "dark", position: "bottom-center",hideProgressBar: true });

    setRooms((prev) => [...prev,newRoom]);
  };

  const toggleFavorite = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (room && !room.isFavorite) {
      toast(`Added to favorites!!!`, { theme: "colored", position: "bottom-center", hideProgressBar: true,style:{
        backgroundColor: "#d90000ff",
        color: "#fff",
      } });
    }
    setRooms((prev) => prev.map((r) => r.id === roomId ? { ...r, isFavorite: !r.isFavorite } : r));
  };

  const duplicateRoom = (roomId: string) => {
    const roomToDuplicate = rooms.find((r) => r.id === roomId);
    if (!roomToDuplicate) return;

    const newRoom: Room = { ...roomToDuplicate,isFavorite: false, id: `room-${Date.now()}`, name: `${roomToDuplicate.name} Copy` };
    toast(`Successfully duplicated "${newRoom.name}"! (you can find it at the end of the rooms list)`, { theme: "dark", position: "bottom-center" });

    setRooms((prev) => {
      const updatedRooms = [...prev,newRoom];
      return updatedRooms;
    });
  };

  return (
    <div className="app-wrapper" style={{ backgroundImage: !showSwiper && active ? `url(${active.src})` : "none" }}>
      <ToastProvider />
      {!showSwiper && <Navbar onOpenSwiper={() => setShowSwiper(true)} />}
      <SwiperModal
        show={showSwiper}
        rooms={rooms}
        index={index}
        currentSlide={currentSlide}
        active={active}
        isSwiping={isSwiping}
        onClose={handleClose}
        onAddRoom={handleAddRoom}
        onFavorite={toggleFavorite}
        onDuplicate={duplicateRoom}
        setIndex={setIndex}
        setCurrentSlide={setCurrentSlide}
        setIsSwiping={setIsSwiping}
        setLastRoomIndex={setLastRoomIndex}
      />
    </div>
  );
};

export default App;
