import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("travelBudgetDB");

  const exchangeRateDoc = await db
    .collection("exchangeRates")
    .findOne({ base: "USD" });

  if (!exchangeRateDoc || !exchangeRateDoc.rates) {
    return NextResponse.json({ error: "No exchange rates found" }, { status: 404 });
  }

  const currencies = Object.keys(exchangeRateDoc.rates); // ["USD", "EUR", "JPY", ...]

  return NextResponse.json({ currencies });
}
