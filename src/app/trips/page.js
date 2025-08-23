"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/format_currency";

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrips = async () => {
      const email = localStorage.getItem("email");
      if (!email) {
        setError("You must be logged in to view trips.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/get_trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (res.ok) {
          setTrips(data.trips);
        } else {
          setError(data.error || "Failed to load trips");
        }
      } catch {
        setError("Failed to fetch trips");
      }

      setLoading(false);
    };

    fetchTrips();
  }, []);

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="error">{error}</p>;

  if (trips.length === 0) return <p>No trips found. Add a new trip!</p>;

  return (
    <div className="container">
        <div className="header">
            <h1>Your Trips</h1>
        </div>
      
        <div className="trips-container">
            <ul>
                {trips.map((trip, i) => (
                <li key={i} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
                    <div>
                    <Link href={`/trips/${trip._id}`}><h2>{trip.title}</h2></Link>
                    <p>
                    Total Spending: {formatCurrency((trip.totalSpending || 0).toFixed(2), trip.currency)}
                    </p>
                    </div>
                    
                </li>
                ))}
            </ul>
        </div>
      
    </div>
  );
}
