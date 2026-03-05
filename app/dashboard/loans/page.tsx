"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface Loan {
  id: number;
  loanName: string;
  principalAmount: number;
  interestRate: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const [loanName, setLoanName] = useState("");
  const [principalAmount, setPrincipalAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");

  const [repayAmounts, setRepayAmounts] = useState<{
    [key: number]: string;
  }>({});

  // 🔥 Modal States
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ================================
  // Load Loans
  // ================================
  async function loadLoans() {
    try {
      const data = await apiFetch("/api/loans");
      setLoans(data);
    } catch (error) {
      console.error("Failed to load loans:", error);
    }
  }

  useEffect(() => {
    async function init() {
      await loadLoans();
      setLoading(false);
    }
    init();
  }, []);

  // ================================
  // Create Loan
  // ================================
  async function handleCreateLoan(e: React.FormEvent) {
    e.preventDefault();

    try {
      await apiFetch("/api/loans", {
        method: "POST",
        body: JSON.stringify({
          loanName,
          principalAmount: Number(principalAmount),
          interestRate: Number(interestRate),
        }),
      });

      setLoanName("");
      setPrincipalAmount("");
      setInterestRate("");

      await loadLoans();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create loan");
    }
  }

  // ================================
  // Repay Loan
  // ================================
  async function handleRepay(id: number) {
    const amount = repayAmounts[id];

    if (!amount) {
      setErrorMessage("Please enter a repayment amount");
      return;
    }

    try {
      await apiFetch(`/api/loans/${id}/repay`, {
        method: "PUT",
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      setRepayAmounts((prev) => ({ ...prev, [id]: "" }));
      await loadLoans();
    } catch (error: any) {
      setErrorMessage(error.message || "Repayment failed");
    }
  }

  // ================================
  // Confirm Delete
  // ================================
  async function confirmDelete() {
    if (deleteId === null) return;

    try {
      await apiFetch(`/api/loans/${deleteId}`, {
        method: "DELETE",
      });

      setDeleteId(null);
      await loadLoans();
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
        Loans 💳
      </h1>

      {/* ================================
          Create Loan Form 
      ================================= */}
      <form
        onSubmit={handleCreateLoan}
        className="bg-white p-6 rounded-[24px] shadow-sm mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <input
          type="text"
          placeholder="Loan Name"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={loanName}
          onChange={(e) => setLoanName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Principal Amount"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={principalAmount}
          onChange={(e) => setPrincipalAmount(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Interest Rate (%)"
          className="border p-2 rounded text-black placeholder-gray-400 w-full"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-black text-white rounded-full hover:bg-gray-800 transition w-full py-2"
        >
          Create
        </button>
      </form>

      {/* ================================
          Loans Table 
      ================================= */}
      <div className="bg-white rounded-[24px] shadow-sm p-6 overflow-hidden">
        {loans.length === 0 ? (
          <p className="text-black">No loans found.</p>
        ) : (
          <div className="overflow-x-auto w-full custom-scrollbar pb-2">
            <table className="w-full text-black min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2">Loan</th>
                  <th className="text-left py-3 px-2">Interest</th>
                  <th className="text-right py-3 px-2">Total</th>
                  <th className="text-right py-3 px-2">Paid</th>
                  <th className="text-right py-3 px-2">Remaining</th>
                  <th className="text-right py-3 px-2 min-w-[150px]">Repay</th>
                  <th className="text-right py-3 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="py-3 px-2">{loan.loanName}</td>
                    <td className="py-3 px-2">{loan.interestRate}%</td>
                    <td className="py-3 px-2 text-right">₹ {loan.totalAmount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right">₹ {loan.paidAmount.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right font-semibold">
                      ₹ {loan.remainingAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-right">
                      {loan.remainingAmount <= 0 ? (
                        <span className="text-[#14B8A6] font-semibold mr-2">Loan Completed</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <input
                            type="number"
                            className="border border-gray-200 p-1.5 rounded w-24 text-black text-sm"
                            value={repayAmounts[loan.id] || ""}
                            onChange={(e) =>
                              setRepayAmounts((prev) => ({
                                ...prev,
                                [loan.id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            onClick={() => handleRepay(loan.id)}
                            className="text-[#0084FF] hover:underline font-medium text-sm"
                          >
                            Pay
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => setDeleteId(loan.id)}
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
                className="px-6 py-2 rounded-full bg-black text-white hover:bg-gray-800 transition font-medium shadow-sm w-full sm:w-auto"
              >
                Okay
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
              Delete Loan
            </h2>
            <p className="text-gray-600 mb-8">
              Are you sure you want to delete this loan? This action cannot be undone.
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