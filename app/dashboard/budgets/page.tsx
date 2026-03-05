"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Budget {
  id: number;
  amount: number;
  month: number; // 🔥 Changed to number to match backend
  year: number;  // 🔥 Added year field
}

// Helper to convert month number to Name for the table display
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [monthInput, setMonthInput] = useState(""); // Holds "YYYY-MM" string from input
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  async function loadBudgets() {
    try {
      const data = await apiFetch("/api/budgets");
      setBudgets(data);
    } catch (error) {
      console.error("Failed to load budgets:", error);
    }
  }

  useEffect(() => {
    async function init() {
      await loadBudgets();
      setLoading(false);
    }
    init();
  }, []);

  async function handleCreateBudget(e: React.FormEvent) {
    e.preventDefault();

    // 🔥 Parse "YYYY-MM" into separate Integers
    const [yearPart, monthPart] = monthInput.split("-");

    try {
      await apiFetch("/api/budgets", {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
          month: parseInt(monthPart, 10), // 🔥 Sends Integer (1-12)
          year: parseInt(yearPart, 10),   // 🔥 Sends Integer (e.g. 2026)
        }),
      });

      setMonthInput("");
      setAmount("");
      await loadBudgets();
    } catch (error: any) {
      alert(error.message || "Failed to create budget");
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    try {
      await apiFetch(`/api/budgets/${deleteId}`, {
        method: "DELETE",
      });
      setDeleteId(null);
      await loadBudgets();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  if (loading) {
    return <p className="text-black p-8 text-xl font-medium">Loading...</p>;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-6 text-black">
        Budgets 📅
      </h1>

      {/* ================================
          Create Budget Form 
      ================================= */}
      <form
        onSubmit={handleCreateBudget}
        className="bg-white p-6 rounded-[24px] shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="month"
          className="border p-2 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 w-full"
          value={monthInput}
          onChange={(e) => setMonthInput(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-medium w-full"
        >
          Set Budget
        </button>
      </form>

      {/* ================================
          Budgets Table 
      ================================= */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 overflow-hidden">
        {budgets.length === 0 ? (
          <p className="text-black">No budgets set.</p>
        ) : (
          <div className="overflow-x-auto w-full custom-scrollbar pb-2">
            <table className="w-full text-black min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-semibold whitespace-nowrap">Month</th>
                  <th className="text-right py-3 px-2 font-semibold whitespace-nowrap">Amount</th>
                  <th className="text-right py-3 px-2 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 px-2 font-medium whitespace-nowrap">
                      {/* 🔥 Turns (3, 2026) into "March 2026" */}
                      {MONTH_NAMES[budget.month - 1]} {budget.year}
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      ₹ {budget.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeleteId(budget.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================
          Custom Delete Modal
      ================================= */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-4 text-black">
              Delete Budget
            </h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this budget? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 flex-col sm:flex-row">
              <button
                onClick={() => setDeleteId(null)}
                className="w-full sm:w-auto px-6 py-2 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}