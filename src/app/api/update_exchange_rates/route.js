import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.EXCHANGERATE_API_TOKEN;
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch exchange rates" }, { status: 500 });
  }

  const data = await res.json();

  const client = await clientPromise;
  const db = client.db("travelBudgetDB");

  await db.collection("exchangeRates").updateOne(
    { base: "USD" },
    {
      $set: {
        rates: data.conversion_rates,
        lastUpdated: new Date(),
      },
    },
    { upsert: true }
  );

  return NextResponse.json({ message: "Exchange rates updated" });
}
