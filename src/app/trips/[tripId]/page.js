"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import CurrencyDropdown from "@/components/currency_select";
import SpendingPieChart from "@/components/spending_piechart";
import { formatCurrency } from "@/lib/format_currency";

export default function TripPage() {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [total, setTotal] = useState(0);
    const categories = ["Food", "Transport", "Shopping", "Accommodation", "Entertainment", "Other"];
    const [showForm, setShowForm] = useState(false);
    const [spendingForm, setSpendingForm] = useState({
        description: "",
        amount: "",
        category: "",
        date: "",
        currency: "",
    });

    const fetchTrip = useCallback(async () => {
        const email = localStorage.getItem("email");
        if (!email) return;
    
        const res = await fetch("/api/get_trips", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
    
        if (res.ok) {
          const data = await res.json();
          const foundTrip = data.trips.find((t) => t._id.toString() === tripId);
          setTrip(foundTrip);
        }
      }, [tripId]);

    useEffect(() => {
        fetchTrip();
      }, [fetchTrip]);

    const convertCurrency = useCallback(async (amount, fromCurrency, toCurrency) => {
        const res = await fetch("/api/convert_currency", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, fromCurrency, toCurrency }),
        });

        if (!res.ok) {
            const errorText = await res.text(); 
            console.error("Currency conversion failed:", res.status, errorText);
            return 0;
        }

        const data = await res.json();
        return data.converted;
    }, []);

    //calculate total spending
    useEffect(() => {
        const calculateTotal = async () => {
            let sum = 0;
            for (const s of trip.spendings) {
                const sCurrency = s.currency || trip.currency;
                if (sCurrency !== trip.currency) {
                    const converted = await convertCurrency(s.amount, sCurrency, trip.currency);
                    sum += converted;
                } else {
                    sum += s.amount;
                }
            }
            setTotal(sum);
        };

        if (trip?.spendings?.length > 0) {
            calculateTotal();
        } else {
            setTotal(0);
        }
    }, [trip, convertCurrency]);

    // add spending in a trip page
    const handleAddSpending = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem("email");

        const res = await fetch("/api/add_trip/add_spending", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                tripId,
                spending: {
                    ...spendingForm,
                    amount: Number(spendingForm.amount),
                    category: spendingForm.category || "Other",
                    currency: spendingForm.currency || trip.currency,
                },
            }),
        });

        if (res.ok) {
            setSpendingForm({ description: "", amount: "", date: "", currency: "" });
            setShowForm(false);
            fetchTrip();
        }
    };

    if (!trip) return <p>Loading trip...</p>;

    return (
        <div className="spending-container max-w-md mx-auto mt-10 p-4 border rounded shadow">
            <h1 className="text-2xl font-bold mb-2">{trip.title}</h1>
            <SpendingPieChart spendingList={trip.spendings} tripCurrency={trip.currency} />
            <p className="mb-4">Currency: {trip.currency}</p>
            <h3 className="text-lg font-semibold mb-4">
                Total Spending: {formatCurrency(total.toFixed(2), trip.currency)}
            </h3>

            <button
                onClick={() => setShowForm((prev) => !prev)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition w-fit mb-4"
            >
                {showForm ? "Cancel" : "+ Add Spending"}
            </button>

            {showForm && (
                <form onSubmit={handleAddSpending} className="flex flex-col gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Title"
                        value={spendingForm.description}
                        onChange={(e) => setSpendingForm({ ...spendingForm, description: e.target.value })}
                        required
                    />

                    <CurrencyDropdown
                        selectedCurrency={spendingForm.currency}
                        setSelectedCurrency={(value) =>
                            setSpendingForm({ ...spendingForm, currency: value })
                        }
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        value={spendingForm.amount}
                        onChange={(e) => setSpendingForm({ ...spendingForm, amount: e.target.value })}
                        required
                    />
                    <select id="category" name="category" value={spendingForm.category} onChange={(e) => setSpendingForm({ ...spendingForm, category: e.target.value })}>
                        <option value="">Select category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={spendingForm.date}
                        onChange={(e) => setSpendingForm({ ...spendingForm, date: e.target.value })}
                        required
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Save Spending
                    </button>
                </form>
            )}

            <div>
            <table className="min-w-full border border-gray-300 border-separate border-spacing-x-8">
  <thead>
    <tr className="spending-header-row">
      <th className="spending-header">Description</th>
      <th className="spending-header">Category</th>
      <th className="spending-header">Amount</th>
      <th className="spending-header">Date</th>
    </tr>
  </thead>
  <tbody>
    {trip.spendings?.map((s, i) => (
      <tr key={i} className="spending-item-row">
        <td className="spending-item">{s.description}</td>
        <td className="spending-item">{s.category}</td>
        <td className="spending-item">{formatCurrency(s.amount, s.currency || trip.currency)}</td>
        <td className="spending-item">{s.date}</td>
      </tr>
    ))}
  </tbody>
</table>

            </div>
        </div>
    );
}
