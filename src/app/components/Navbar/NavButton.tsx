"use client";
import React from "react";

type NavButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  ariaLabel: string;
};

const NavButton = ({ children, onClick, ariaLabel }: NavButtonProps) => (
  <button aria-label={ariaLabel} onClick={onClick} className="nav-bar-btn">
    {children}
  </button>
);

export default NavButton;
