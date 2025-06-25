"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/format_currency";
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#aa46be", "#ff6666"];

export default function SpendingPieChart({ spendingList, tripCurrency }) {
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    async function prepareChartData() {
      const categoryTotals = {};

      for (const spending of spendingList) {
        const { amount, currency, category } = spending;

        try {
          const converted = await convertCurrencyClient(amount, currency, tripCurrency);

          if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
          }
          categoryTotals[category] += converted;
        } catch (error) {
          console.error("Currency conversion error:", error.message);
        }
      }

      const data = Object.entries(categoryTotals).map(([category, amount]) => ({
        name: category,
        value: Number(amount.toFixed(2)),
      }));

      setPieData(data);
    }

    if (spendingList.length) {
      prepareChartData();
    }
  }, [spendingList, tripCurrency]);

  
  return (
    <div>
      {pieData.length > 0 ? (
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatCurrency(value, tripCurrency)} />
          <Legend />
        </PieChart>
      ) : (
        <p>Loading spending data...</p>
      )}
    </div>
  );
}

async function convertCurrencyClient(amount, fromCurrency, toCurrency) {
  const res = await fetch("/api/convert_currency", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, fromCurrency, toCurrency }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Currency conversion failed");
  return data.converted;
}
