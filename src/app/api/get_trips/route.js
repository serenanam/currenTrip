import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email } = await req.json();

  const client = await clientPromise;
  const db = client.db("travelBudgetDB");

  const user = await db.collection("users").findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ trips: user.trips || [] });
}
