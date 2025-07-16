"use client";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-blue-100 flex flex-col relative overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 relative overflow-hidden">
        {/* Optional: animated particles/stars background could go here */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-white mb-6">
          <span className="block">Flip Smarter With</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-200 via-blue-300 to-purple-300">FlipDar</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl text-center mb-8">
          Instantly analyze second-hand market trends, track your profits, and discover what’s hot right now. The ultimate analytics platform for resellers.
        </p>
        <Link href="/product/flipdar" className="px-8 py-4 bg-white text-lg font-bold rounded-xl shadow hover:bg-gray-100 transition">
          Explore FlipDar
        </Link>
      </section>

      {/* Product Intro Section */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-12 pb-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">What is FlipDar?</h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-2 font-medium">
          FlipDar is your all-in-one analytics platform for resellers. Instantly analyze second-hand market trends, track your profits, and discover what’s hot right now—across eBay, Facebook Marketplace, and more.
        </p>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-24 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="glass-card bg-white/70 rounded-2xl shadow-xl p-10 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <span className="text-5xl mb-4">📈</span>
          <h2 className="font-bold text-2xl mb-3 text-gray-800">Real eBay Stats</h2>
          <p className="text-gray-500 text-lg">Get average sold prices, listing durations, and more for any item. Make informed buying and selling decisions.</p>
        </div>
        <div className="glass-card bg-white/70 rounded-2xl shadow-xl p-10 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <span className="text-5xl mb-4">💸</span>
          <h2 className="font-bold text-2xl mb-3 text-gray-800">Profit Tracking</h2>
          <p className="text-gray-500 text-lg">Track your purchases, sales, and profits. Visualize your flipping journey with beautiful analytics dashboards.</p>
        </div>
        <div className="glass-card bg-white/70 rounded-2xl shadow-xl p-10 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <span className="text-5xl mb-4">🔥</span>
          <h2 className="font-bold text-2xl mb-3 text-gray-800">Trending Items</h2>
          <p className="text-gray-500 text-lg">See what’s hot and selling fast in the second-hand market. Stay ahead of the curve and maximize your returns.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how" className="max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 text-center">How Does FlipDar Work?</h2>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-10 font-medium text-center">
          FlipDar makes it easy to research, track, and optimize your reselling business in just a few steps.
        </p>
        <ol className="space-y-10 text-xl text-gray-700 list-decimal list-inside">
          <li className="flex items-center gap-4"><span className="text-green-600 text-3xl">1</span> <b>Sign up</b> for a free account and connect your favorite platforms.</li>
          <li className="flex items-center gap-4"><span className="text-green-600 text-3xl">2</span> <b>Search</b> for items to see real-time market data and trends.</li>
          <li className="flex items-center gap-4"><span className="text-green-600 text-3xl">3</span> <b>Track</b> your purchases and sales to monitor your profits.</li>
          <li className="flex items-center gap-4"><span className="text-green-600 text-3xl">4</span> <b>Analyze</b> your performance with beautiful dashboards and insights.</li>
        </ol>
      </section>


      {/* Animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fade-in {
          animation: fade-in 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        .animate-fade-in.delay-100 { animation-delay: 0.1s; }
        .animate-fade-in.delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}
