"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <span className="text-3xl">🏥</span>
          <div>
            <h1 className="text-xl font-bold">Smart Disease Prediction</h1>
            <p className="text-xs text-blue-100">Prevention System</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="hover:text-blue-100 transition font-medium"
          >
            Home
          </Link>
          <Link 
            href="/#features" 
            className="hover:text-blue-100 transition font-medium"
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
