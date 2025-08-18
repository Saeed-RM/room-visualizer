"use client";

import { SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

type RoomSlideProps = {
  id: string;
  src: string;
  name: string;
  isSwiping: boolean;
  isActive: boolean;
  onSelect: () => void;
};

const RoomSlide = ({ id, src, name, isSwiping, isActive, onSelect }: RoomSlideProps) => (
  <SplideSlide key={id}>
    <div
      className={`slide-frame ${isSwiping ? "blurring" : ""}`}
      onClick={() => {
        if (!isActive) onSelect();
      }}
    >
      <img src={src} alt={name} className="slide-img" />
    </div>
  </SplideSlide>
);

export default RoomSlide;
