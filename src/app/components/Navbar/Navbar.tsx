"use client";

import { HouseSimple, Pause, ShareNetwork, SignOut } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import NavButton from "./NavButton";

type NavbarProps = {
  onOpenSwiper: () => void;
};

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
        <NavButton ariaLabel="Exit">
          <SignOut size={18} />
          <span>Exit</span>
        </NavButton>
        <NavButton ariaLabel="Change Room" onClick={() => alert("Change Room TBD")}>
          <HouseSimple size={18} />
          <span>Change Room</span>
        </NavButton>
        <NavButton ariaLabel="Rooms" onClick={onOpenSwiper}>
          <Pause size={18} />
          <span>Rooms</span>
        </NavButton>
        <NavButton ariaLabel="Share">
          <ShareNetwork size={18} />
          <span>Share</span>
        </NavButton>
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
