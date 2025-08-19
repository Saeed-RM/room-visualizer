"use client";

import { HouseSimple, Pause, ShareNetwork, SignOut } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import NavButton from "./NavButton";

type NavbarProps = {
  onOpenSwiper: () => void;
};

const changeRoom = () => {
  toast(`TODO (do not worry, it's in our long list of never to implement backlog :))`, { theme: "dark", position: "top-center", hideProgressBar: true });
}

const share = () => {
  toast(`Cannot be shared :D`, { theme: "dark", position: "top-center", hideProgressBar: true });
}

const exit = () => {
  toast(`Cannot exit as well :D`, { theme: "dark", position: "top-center", hideProgressBar: true });
}

const Navbar = ({ onOpenSwiper }: NavbarProps) => {
  return (
    <AnimatePresence>
      <motion.div
        className="navbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <NavButton ariaLabel="Exit" onClick={exit}>
          <SignOut size={18} />
          <span>Exit</span>
        </NavButton>
        <NavButton ariaLabel="Change Room" onClick={changeRoom}>
          <HouseSimple size={18} />
          <span>Change Room</span>
        </NavButton>
        <NavButton ariaLabel="Rooms" onClick={onOpenSwiper}>
          <Pause size={18} />
          <span>Rooms</span>
        </NavButton>
        <NavButton ariaLabel="Share" onClick={share}>
          <ShareNetwork size={18} />
          <span>Share</span>
        </NavButton>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
