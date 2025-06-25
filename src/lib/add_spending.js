export async function handleAddSpending() {
    const res = await fetch("/api/add_trip/add_spending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tripId, spending }),
      });
    
      return res.ok;
}