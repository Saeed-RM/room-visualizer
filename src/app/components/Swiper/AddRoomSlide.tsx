"use client";

import { Plus } from "@phosphor-icons/react";
import { SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

type AddRoomSlideProps = {
  onAdd: () => void;
};

const AddRoomSlide = ({ onAdd }: AddRoomSlideProps) => (
  <SplideSlide key="add-room">
    <div className="add-room" onClick={onAdd}>
      <Plus size={40} />
      <p>Add Room</p>
    </div>
  </SplideSlide>
);

export default AddRoomSlide;
