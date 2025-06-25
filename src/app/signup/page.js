"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("Signup successful!");
      setForm({ name: "", email: "", password: "" });
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="border p-2 rounded"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          type="password"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>
    </div>
  );
}
