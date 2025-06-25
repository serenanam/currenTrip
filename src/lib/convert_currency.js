import clientPromise from "@/lib/mongodb";

export async function convertCurrency(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  const client = await clientPromise;
  const db = client.db("travelBudgetDB");

  const data = await db.collection("exchangeRates").findOne({ base: "USD" });

  if (!data || !data.rates) throw new Error("Exchange rates not available");

  const { rates } = data;

  // Convert from -> USD -> to
  const amountInUSD = fromCurrency === "USD" ? amount : amount / rates[fromCurrency];
  const converted = toCurrency === "USD" ? amountInUSD : amountInUSD * rates[toCurrency];

  return converted;
}
