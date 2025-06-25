import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("travelBudgetDB"); 

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    return NextResponse.json({ message: "User created", userId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
