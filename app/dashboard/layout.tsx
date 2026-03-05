"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  
  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Expenses", href: "/dashboard/expenses" },
    { name: "Budgets", href: "/dashboard/budgets" },
    { name: "Goals", href: "/dashboard/goals" },
    { name: "Loans", href: "/dashboard/loans" },
  ];

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      
      {/* ================= NAVBAR ================= */}
      <div className="w-full bg-white border-b border-gray-200 shadow-sm relative z-50">
        <div className="w-full px-8 py-4 flex items-center justify-between">

          {/* Logo */}
          <h1
            onClick={() => {
              router.push("/dashboard");
              setIsMenuOpen(false); // Close mobile menu if logo is clicked
            }}
            className="text-lg font-semibold text-black cursor-pointer hover:opacity-80 transition z-10"
          >
            Budget App
          </h1>

          {/* --- DESKTOP: Center Pill Navigation (Hidden < 850px) --- */}
          <div className="hidden min-[850px]:flex items-center gap-2 bg-gray-100 border border-gray-300 rounded-full px-2 py-2 shadow-inner">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`
                      px-6 py-2 rounded-full text-sm font-medium
                      transition-all duration-300
                      ${
                        isActive
                          ? "bg-black text-white shadow-md scale-105"
                          : "text-gray-700 hover:bg-white hover:shadow-sm"
                      }
                    `}
                  >
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* --- DESKTOP: Logout Button (Hidden < 850px) --- */}
          <button
            onClick={handleLogout}
            className="hidden min-[850px]:block px-6 py-2 rounded-full text-sm font-semibold text-white bg-red-500 shadow-md hover:bg-red-600 transition z-10"
          >
            Logout
          </button>

          {/* --- MOBILE: Hamburger Toggle (Hidden >= 850px) --- */}
          <button
            className="min-[850px]:hidden p-2 text-black focus:outline-none z-10 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* --- MOBILE: Dropdown Menu (< 850px) --- */}
        {isMenuOpen && (
          <div className="min-[850px]:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-xl py-4 px-8 flex flex-col gap-3 animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)} // Close menu on click
                  className={`
                    px-6 py-3 rounded-2xl text-sm font-semibold transition-all
                    ${isActive 
                      ? "bg-black text-white shadow-md" 
                      : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }
                  `}
                >
                  {item.name}
                </Link>
              );
            })}
            
            <div className="h-px w-full bg-gray-200 my-1"></div>
            
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="w-full text-left px-6 py-3 rounded-2xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* ================= PAGE CONTENT ================= */}
      {/* relative z-0 ensures the absolute dropdown overlaps this content */}
      <main className="w-full flex justify-center relative z-0">
        <div className="w-full max-w-[1400px] px-10 py-12">
          {children}
        </div>
      </main>

    </div>
  );
}