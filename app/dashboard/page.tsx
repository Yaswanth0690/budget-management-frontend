"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { apiFetch } from "@/lib/api"; // 🔥 Added apiFetch import

interface CategorySummary {
  categoryName: string;
  totalAmount: number;
}

interface SavingsGoal {
  id: number;
  goalName: string;
  targetAmount: number;
  savedAmount: number;
}

interface DashboardData {
  totalExpenses: number;
  totalBudgets: number;
  remainingBudget: number;
  totalRemainingLoans: number;
  totalGoals: number; 
  totalCategories: number;
  totalGoalTargetAmount: number;
  totalGoalSavedAmount: number;
  categorySummary: CategorySummary[];
  goals: SavingsGoal[];
}

interface Loan {
  id: number;
  loanName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DEFAULT_CATEGORIES = ["Food", "Bills", "Travel", "Others"];

const PIE_COLORS = [
  '#8B5CF6', '#0084FF', '#F59E0B', '#14B8A6', 
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 🔥 Using apiFetch to automatically handle tokens and the Base URL
        const [dashData, loanData] = await Promise.all([
          apiFetch(`/api/dashboard/summary?month=${selectedMonth}&year=${selectedYear}`),
          apiFetch(`/api/loans`)
        ]);
        
        setData(dashData);
        setLoans(loanData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [selectedMonth, selectedYear]);

  if (loading || !data) return <div className="text-xl font-medium p-8 text-black">Loading...</div>;

  // --- Calculations ---
  const isOverBudget = data.remainingBudget < 0;
  const budgetProgress = data.totalBudgets > 0 
    ? Math.min((data.totalExpenses / data.totalBudgets) * 100, 100) 
    : 0;

  const activeGoals = data.goals?.filter(goal => goal.savedAmount < goal.targetAmount) || [];
  const activeLoans = loans?.filter(loan => loan.paidAmount < loan.totalAmount) || [];

  const displayCategories = DEFAULT_CATEGORIES.map(name => {
    const existing = data.categorySummary?.find(
      cat => cat.categoryName.toLowerCase() === name.toLowerCase()
    );
    return { categoryName: name, totalAmount: existing ? existing.totalAmount : 0 };
  });

  const categoryPieData = displayCategories
    .filter(cat => cat.totalAmount > 0)
    .map((item, index) => ({
      name: item.categoryName,
      value: item.totalAmount,
      color: PIE_COLORS[index % PIE_COLORS.length]
    }));

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-black">Dashboard Overview 📊</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* --- LEFT COLUMN: Expenses Overview --- */}
        <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col h-full border border-gray-50">
          <h3 className="text-lg font-semibold text-black mb-4">Expenses Overview</h3>
          <p className="text-3xl font-bold text-black mb-6">₹ {data.totalExpenses.toLocaleString()}</p>

          <p className="text-sm text-black mb-2">Expenses by Category</p>
          <div className="space-y-2 mb-6">
            {displayCategories.map((item, index) => (
              <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-1 text-sm text-black">
                <span>{item.categoryName}</span>
                <span className="font-semibold">₹ {item.totalAmount.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-black mb-2 mt-auto">Category Distribution</p>
          <div className="w-full h-[220px]">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Pie
                    data={categoryPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={80}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend iconType="square" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-sm italic h-full flex items-center justify-center">No data</p>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN WRAPPER --- */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            
            {/* --- Budget Overview --- */}
            <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col h-full border border-gray-50">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-black">Budget Overview</h3>
                <div className="flex gap-1">
                  <select 
                    className="bg-gray-50 border-none text-black px-2 py-1 rounded-lg text-xs outline-none cursor-pointer"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <input 
                    type="number" 
                    className="w-16 bg-gray-50 border-none text-black px-2 py-1 rounded-lg text-xs outline-none"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center space-y-4">
                <div className="flex justify-between text-base text-black">
                  <span className="text-gray-500">Budget:</span>
                  <span className="font-bold">₹ {data.totalBudgets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base text-black">
                  <span className="text-gray-500">Spent:</span>
                  <span className="font-bold text-blue-600">₹ {data.totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-gray-500 font-medium">
                    {isOverBudget ? "Budget Exceeded by:" : "Remaining:"}
                  </span>
                  <span className={`font-bold text-lg ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
                    ₹ {Math.abs(data.remainingBudget).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm text-black">{budgetProgress.toFixed(1)}% Used</p>
                  {isOverBudget && (
                    <span className="text-[10px] font-bold text-red-500 uppercase animate-pulse">
                      Limit Exceeded
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : 'bg-[#14B8A6]'}`} 
                    style={{ width: `${budgetProgress}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* --- Savings Goal (Active Only) --- */}
            <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col h-full border border-gray-50 text-black">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold">Savings Goal</h3>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-600 px-2 py-1 rounded-lg uppercase">
                  {data.totalGoals} Completed
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
                {activeGoals.length > 0 ? (
                  activeGoals.map((goal) => {
                    const progress = goal.targetAmount > 0 
                      ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) 
                      : 0;
                      
                    return (
                      <div key={goal.id} className="space-y-1.5">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-600 truncate mr-2">{goal.goalName}</span>
                          <span className="whitespace-nowrap">₹ {goal.savedAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#14B8A6] transition-all duration-500" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-3">
                    <p className="text-sm text-gray-500">All caught up on goals! 🎉</p>
                    <Link href="/dashboard/goals" className="bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition">
                      Add a New Goal
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Remaining Loans (Active Only) --- */}
          <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col flex-1 border border-gray-50 text-black min-h-[220px]">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold">Remaining Loans</h3>
              <div className="text-right">
                <span className="text-2xl font-bold block">₹ {data.totalRemainingLoans.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Remaining</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
              {activeLoans.length > 0 ? (
                activeLoans.map((loan) => {
                  const progress = loan.totalAmount > 0 
                    ? Math.min((loan.paidAmount / loan.totalAmount) * 100, 100) 
                    : 0;
                    
                  return (
                    <div key={loan.id} className="space-y-1.5">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-600 truncate mr-2">{loan.loanName}</span>
                        <span className="whitespace-nowrap">₹ {loan.paidAmount.toLocaleString()} / {loan.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 transition-all duration-500" 
                          style={{ width: `${progress}%` }} 
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-full space-y-3 pt-2">
                  <p className="text-sm text-gray-500">No active loans! 🎉</p>
                  <Link href="/dashboard/loans" className="bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-gray-800 transition">
                    Add a New Loan
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}