import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const client = await clientPromise;
    const db = client.db("travelBudgetDB");
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", user: { name: user.name, email: user.email } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
