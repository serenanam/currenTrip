"use client";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
    <div className="homepage-text-container">
      <p> Welcome to CurrenTrip — your all-in-one travel budget tracker.
        Budget smarter, spend better, and keep track of every expense across currencies while you explore the world.
      Stay on top of your budget with easy-to-use tools, clear visuals, and real-time currency conversions — so you can focus on the journey, not the math.
      </p>
    </div>
    </>
  );
}
