"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CurrencyDropdown from "@/components/currency_select";

export default function NewTripPage() {
  const [trip, setTrip] = useState({ title: "", currency: "USD" });
  const router = useRouter();

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("email");

    const res = await fetch("/api/add_trip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...trip, email }),
    });

    const data = await res.json();
    if (res.ok) {
      router.push("/trips");
    } else {
      alert(data.error || "Failed to add trip");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="title"
          placeholder="Trip Title"
          value={trip.title}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />

        <label className="flex flex-col">
          Currency:
          <CurrencyDropdown
            selectedCurrency={trip.currency}
            setSelectedCurrency={(value) =>
              setTrip({ ...trip, currency: value })
            }
          />
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Trip
        </button>
      </form>
    </div>
  );
}
