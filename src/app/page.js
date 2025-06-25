"use client";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
    </>
  );
}
