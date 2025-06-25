import { useEffect, useState } from "react";

function CurrencyDropdown({ selectedCurrency, setSelectedCurrency }) {
  const [currencyOptions, setCurrencyOptions] = useState([]);

  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const res = await fetch("/api/get_currencies");
        const data = await res.json();
        if (data.currencies) {
          setCurrencyOptions(data.currencies);
        }
      } catch (err) {
        console.error("Failed to fetch currencies:", err);
      }
    }

    fetchCurrencies();
  }, []);

  return (
    <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
      {currencyOptions.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </select>
  );
}

export default CurrencyDropdown;
