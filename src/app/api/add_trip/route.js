import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  const { email, title, currency } = await req.json();

  const client = await clientPromise;
  const db = client.db("travelBudgetDB");

  const result = await db.collection("users").updateOne(
    { email },
    {
      $push: {
        trips: {
          _id: uuidv4(),
          title,
          currency,
          spendings: [],
          totalSpending: 0,
        },
      },
      
    }
  );
  return NextResponse.json({ message: "Trip added", result });
}
