"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  categoryName: string;
}

interface Category {
  id: number;
  name: string;
}

// The only 4 categories we want to show in the dropdown
const ALLOWED_CATEGORIES = ["food", "bills", "travel", "others"];

export default function ExpensesPage() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);

  // 🔥 Modal State
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ================================
  // Load Expenses
  // ================================
  async function loadExpenses() {
    try {
      const data = await apiFetch("/expenses?page=0&size=20");
      setExpenses(data.content || data);
    } catch (error) {
      console.error(error);
    }
  }

  // ================================
  // Load Categories & Filter Them
  // ================================
  async function loadCategories() {
    try {
      const data = await apiFetch("/categories");
      
      // We filter the backend data to ONLY keep the 4 allowed options
      const filteredCategories = data.filter((cat: Category) => 
        ALLOWED_CATEGORIES.includes(cat.name.toLowerCase())
      );
      
      setCategories(filteredCategories);

      if (filteredCategories.length > 0) {
        setCategoryId(filteredCategories[0].id);
      } else {
        setCategoryId(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function init() {
      await Promise.all([loadExpenses(), loadCategories()]);
      setLoading(false);
    }
    init();
  }, []);

  // ================================
  // Add Expense
  // ================================
  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();

    if (categories.length === 0) {
      alert("Please ensure Food, Bills, Travel, or Others are created in Categories.");
      return;
    }

    if (categoryId === null) {
      alert("Please select category");
      return;
    }

    try {
      // Sending categoryId exactly like your original backend expects!
      await apiFetch("/expenses", {
        method: "POST",
        body: JSON.stringify({
          description,
          amount: Number(amount),
          date,
          categoryId,
        }),
      });

      setDescription("");
      setAmount("");
      setDate("");
      setCategoryId(categories[0]?.id ?? null);

      await loadExpenses();
    } catch (error: any) {
      alert(error.message);
    }
  }

  // ================================
  // Confirm Delete
  // ================================
  async function confirmDelete() {
    if (deleteId === null) return;

    try {
      await apiFetch(`/expenses/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteId(null);
      await loadExpenses();
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
        Expenses 💸
      </h1>

      {/* Add Expense Form */}
      <form
        onSubmit={handleAddExpense}
        className="bg-white p-6 rounded-[24px] shadow-sm mb-8 grid grid-cols-1 md:grid-cols-5 gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={categories.length === 0}
        />

        <input
          type="number"
          placeholder="Amount"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          disabled={categories.length === 0}
        />

        <input
          type="date"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          disabled={categories.length === 0}
        />

        <select
          className="border p-2 rounded text-black placeholder-gray-400 w-full bg-white"
          value={categoryId ?? ""}
          onChange={(e) => setCategoryId(Number(e.target.value))}
          disabled={categories.length === 0}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition disabled:opacity-50 font-medium w-full"
          disabled={categories.length === 0}
        >
          Add Expense
        </button>
      </form>

      {/* Expense Table */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 overflow-hidden">
        {expenses.length === 0 ? (
          <p className="text-black">No expenses found.</p>
        ) : (
          <div className="overflow-x-auto w-full custom-scrollbar pb-2">
            <table className="w-full text-black min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-semibold whitespace-nowrap">Description</th>
                  <th className="text-left py-3 px-2 font-semibold whitespace-nowrap">Category</th>
                  <th className="text-left py-3 px-2 font-semibold whitespace-nowrap">Date</th>
                  <th className="text-right py-3 px-2 font-semibold whitespace-nowrap">Amount</th>
                  <th className="text-right py-3 px-2 font-semibold whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 px-2 whitespace-nowrap">{expense.description}</td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                        {expense.categoryName}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{expense.date}</td>
                    <td className="py-3 px-2 text-right font-medium whitespace-nowrap">₹ {expense.amount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDeleteId(expense.id)}
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

      {/* Custom Delete Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-4 text-black">
              Delete Expense
            </h2>

            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this expense? This action cannot be undone.
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