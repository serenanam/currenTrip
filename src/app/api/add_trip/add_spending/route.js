import clientPromise from "@/lib/mongodb";
import { convertCurrency } from "@/lib/convert_currency";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, tripId, spending } = await req.json(); 

  const client = await clientPromise;
  const db = client.db("travelBudgetDB");

  console.log("Adding spending to tripId:", tripId);

  const result = await db.collection("users").updateOne(
    { email, "trips._id": tripId },
    {
      $push: {
        "trips.$.spendings": spending,
      },
    }
  );

  const user = await db.collection("users").findOne(
    { email, "trips._id": tripId },
    { projection: { "trips.$": 1 } }
  );
  const trip = user.trips[0];

  let total = 0;
  for (const s of trip.spendings) {
    total += await convertCurrency(s.amount, s.currency, trip.currency);
  }
  await db.collection("users").updateOne(
    { email, "trips._id": tripId },
    { $set: { "trips.$.totalSpending": total } }
  );

  console.log("Mongo update result:", result);

  return NextResponse.json({ message: "Spending added", result });
}
