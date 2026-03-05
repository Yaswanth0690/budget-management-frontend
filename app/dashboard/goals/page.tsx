"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Goal {
  id: number;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  userId: number;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const [contributeAmount, setContributeAmount] = useState<{
    [key: number]: string;
  }>({});

  // 🔥 Modal States
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Extend Modal States
  const [extendId, setExtendId] = useState<number | null>(null);
  const [newTargetAmount, setNewTargetAmount] = useState("");

  // ================================
  // Load Goals
  // ================================
  async function loadGoals() {
    try {
      const data = await apiFetch("/savings-goals");
      setGoals(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    async function init() {
      await loadGoals();
      setLoading(false);
    }
    init();
  }, []);

  // ================================
  // Add Goal
  // ================================
  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();

    try {
      await apiFetch("/savings-goals", {
        method: "POST",
        body: JSON.stringify({
          goalName: name,
          targetAmount: Number(targetAmount),
        }),
      });

      setName("");
      setTargetAmount("");
      await loadGoals();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create goal");
    }
  }

  // ================================
  // Contribute
  // ================================
  async function handleContribute(id: number) {
    const amount = contributeAmount[id];
    if (!amount) {
      setErrorMessage("Please enter a contribution amount");
      return;
    }

    try {
      await apiFetch(`/savings-goals/${id}/contribute`, {
        method: "POST",
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      setContributeAmount((prev) => ({ ...prev, [id]: "" }));
      await loadGoals();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to contribute to goal");
    }
  }

  // ================================
  // Extend Goal Target
  // ================================
  async function handleExtendGoal() {
    if (extendId === null || !newTargetAmount) return;

    try {
      await apiFetch(`/savings-goals/${extendId}`, {
        method: "PUT",
        body: JSON.stringify({
          targetAmount: Number(newTargetAmount),
        }),
      });

      setExtendId(null);
      setNewTargetAmount("");
      await loadGoals();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to extend goal amount");
    }
  }

  // ================================
  // Confirm Delete
  // ================================
  async function confirmDelete() {
    if (deleteId === null) return;

    try {
      await apiFetch(`/savings-goals/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteId(null);
      await loadGoals();
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
        Goals 🎯
      </h1>

      {/* ================================
          Add Goal Form
      ================================= */}
      <form
        onSubmit={handleAddGoal}
        className="bg-white p-6 rounded-[24px] shadow-sm mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Goal Name"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Target Amount"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition font-medium w-full"
        >
          Create Goal
        </button>
      </form>

      {/* ================================
          Goals Table (Responsive Scroll)
      ================================= */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 overflow-hidden">
        {goals.length === 0 ? (
          <p className="text-black">No goals found.</p>
        ) : (
          <div className="overflow-x-auto w-full custom-scrollbar pb-2">
            <table className="w-full text-black min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-semibold">Name</th>
                  <th className="text-center py-3 px-2 font-semibold whitespace-nowrap">Saved</th>
                  <th className="text-right py-3 px-2 font-semibold min-w-[150px]">Contribute</th>
                  <th className="text-right py-3 px-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {goals.map((goal) => (
                  <tr key={goal.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 px-2 whitespace-nowrap">{goal.goalName}</td>

                    <td className="py-3 px-2 text-center font-semibold whitespace-nowrap">
                      ₹ {goal.savedAmount.toLocaleString()} / ₹ {goal.targetAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-2 text-right">
                      {/* CONDITION TO CHECK IF GOAL IS REACHED */}
                      {goal.savedAmount >= goal.targetAmount ? (
                        <span className="text-[#14B8A6] font-semibold mr-2 whitespace-nowrap">Goal Reached</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            placeholder="Amount"
                            className="border border-gray-200 p-1.5 rounded w-24 text-black text-sm"
                            value={contributeAmount[goal.id] || ""}
                            onChange={(e) =>
                              setContributeAmount((prev) => ({
                                ...prev,
                                [goal.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleContribute(goal.id)}
                            className="text-[#0084FF] hover:underline font-medium text-sm px-2"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-2 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setExtendId(goal.id);
                            setNewTargetAmount(goal.targetAmount.toString());
                          }}
                          className="text-[#F59E0B] hover:text-yellow-600 font-medium text-sm transition"
                        >
                          Extend
                        </button>
                        <button
                          onClick={() => setDeleteId(goal.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================================
          Custom Error Modal
      ================================= */}
      {errorMessage !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-8">
            <h2 className="text-xl font-bold mb-4 text-black">
              Action Failed
            </h2>

            <p className="text-gray-600 mb-8">
              {errorMessage}
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => setErrorMessage(null)}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition font-medium shadow-sm"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================
          Extend Goal Modal
      ================================= */}
      {extendId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-4 text-black">
              Extend Goal Target
            </h2>

            <p className="text-gray-600 mb-4">
              Enter the new total target amount for this goal.
            </p>

            <input
              type="number"
              className="border border-gray-200 p-2.5 rounded text-black focus:outline-none focus:border-gray-400 transition w-full mb-8"
              value={newTargetAmount}
              onChange={(e) => setNewTargetAmount(e.target.value)}
              placeholder="New Target Amount"
            />

            <div className="flex justify-end gap-3 flex-col sm:flex-row">
              <button
                onClick={() => {
                  setExtendId(null);
                  setNewTargetAmount("");
                }}
                className="w-full sm:w-auto px-6 py-2 rounded-full border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleExtendGoal}
                className="w-full sm:w-auto px-6 py-2 rounded-full bg-[#0084FF] text-white hover:bg-blue-600 transition font-medium shadow-sm"
              >
                Update Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================
          Custom Delete Modal
      ================================= */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-8">
            <h2 className="text-xl font-bold mb-4 text-black">
              Delete Goal
            </h2>

            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this goal? This action cannot be undone.
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