import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-black selection:bg-black selection:text-white">
      
      {/* ================= NAVBAR ================= */}
      <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tight">
            Budget App
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Log in
            </Link>
            <Link 
              href="/register" 
              className="bg-black text-white px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO SECTION ================= */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl space-y-6 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Take control of your <br className="hidden sm:block" />
            <span className="text-[#0084FF]">financial future.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            The all-in-one minimalist dashboard to track your expenses, manage strict budgets, crush your savings goals, and pay off loans faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/register" 
              className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-800 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Start for free
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto bg-white border border-gray-200 text-black px-8 py-3.5 rounded-full text-base font-medium hover:bg-gray-50 transition"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </main>

      {/* ================= SNEAK PEEK / FEATURES ================= */}
      <section className="max-w-[1400px] mx-auto px-6 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need, nothing you don't.</h2>
          <p className="text-gray-500">A clean interface designed to give you absolute clarity over your money.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💸</div>
            <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Log your daily spending across categories like Food, Bills, and Travel. See exactly where your money goes.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Smart Budgets</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Set monthly limits. Our dashboard automatically calculates what you've spent and alerts you if you exceed your budget.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Savings Goals</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Planning for a car or a vacation? Create dedicated savings goals and track your visual progress to 100%.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-50 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-2">Manage Loans</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Keep an eye on your debt. Log principal amounts, calculate remaining balances, and make payments seamlessly.
            </p>
          </div>

        </div>
      </section>

      {/* ================= AUTHOR'S NOTE & FEEDBACK ================= */}
      <section className="max-w-[1000px] mx-auto px-6 py-12">
        <div className="bg-white p-8 sm:p-12 rounded-[32px] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
          
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>

          <div className="flex-1 relative z-10">
            <h3 className="text-2xl font-bold mb-4 text-black">👋 A Note from the Developer</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Hey there! I'm Yaswanth. This Budget App is a personal portfolio project I built to showcase modern, full-stack development using Next.js, Spring Boot, and Tailwind CSS.
            </p>
            <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 p-4 rounded-2xl mb-6">
              <p className="text-sm font-medium">
                <strong>Privacy First:</strong> You are more than welcome to test out the dashboard! However, please use <span className="underline decoration-yellow-400 decoration-2 underline-offset-2">random, dummy data</span> when registering. Do not enter your real email or actual financial information.
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Got feedback, found a bug, or just want to connect? I'd love to hear from you.
            </p>
          </div>

          <div className="w-full md:w-auto relative z-10">
            <a 
              href="mailto:yashrockstar892@gmail.com?subject=Feedback%20on%20Budget%20App"
              className="flex items-center justify-center gap-2 bg-[#0084FF] text-white px-8 py-4 rounded-full font-medium hover:bg-blue-600 transition shadow-md hover:shadow-lg w-full md:w-auto whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              Send Feedback
            </a>
          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="w-full border-t border-gray-200 bg-white py-8 mt-4">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Yaswanth's Budget App Portfolio. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/register" className="hover:text-black transition">Sign Up</Link>
            <Link href="/login" className="hover:text-black transition">Log In</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}