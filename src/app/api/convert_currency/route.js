import { NextResponse } from "next/server";
import { convertCurrency } from "@/lib/convert_currency";

export async function POST(req) {
  try {
    const { amount, fromCurrency, toCurrency } = await req.json();

    if (!amount || !fromCurrency || !toCurrency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const converted = await convertCurrency(amount, fromCurrency, toCurrency);

    return NextResponse.json({ converted });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
