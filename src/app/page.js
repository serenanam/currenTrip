"use client";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
    <div className="homepage-text-container">
      <p> Welcome to CurrenTrip — your all-in-one travel budget tracker that helps you effortlessly track and manage your travel expenses across multiple currencies.
        Budget smarter, spend better, and keep track of every expense across currencies while you explore the world.
      Stay on top of your budget with easy-to-use tools, clear visuals, and real-time currency conversions — so you can focus on your <b>current trip</b>, not the math.
      </p>
    </div>
    </>
  );
}
