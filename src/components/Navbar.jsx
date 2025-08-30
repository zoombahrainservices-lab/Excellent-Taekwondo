"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-background via-surface/15 to-accent/10 backdrop-blur supports-[backdrop-filter]:bg-white/90 border-b border-accent/30 shadow-lg">
      <div className="container-max flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3" aria-label="Go to homepage">
          <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            <img 
              src="/favicon.ico" 
              alt="Excellent Taekwondo Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-wide text-dark">Excellent <span className="text-primary">TAEKWONDO</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Primary">
          <Link className="relative hover:text-primary transition-colors duration-200 py-2 px-1 group" href="/">
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link className="relative hover:text-primary transition-colors duration-200 py-2 px-1 group" href="/about">
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link className="relative hover:text-primary transition-colors duration-200 py-2 px-1 group" href="/programs">
            Programs
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link className="relative hover:text-primary transition-colors duration-200 py-2 px-1 group" href="/contact">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </Link>
          <Link href="/contact" className="btn btn-primary hover:scale-105 hover:shadow-lg transition-all duration-200">
            ✨ Book a Free Trial
          </Link>
          <Link className="hover:text-primary text-sm opacity-60 hover:opacity-100 transition-all duration-200" href="/admin">Admin</Link>
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-dark hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <div id="mobile-menu" className={`${
        open ? "block animate-slide-down" : "hidden"
      } md:hidden border-t border-accent/30 bg-gradient-to-br from-background via-surface/20 to-accent/15 backdrop-blur-sm`}>
        <div className="container-max py-4 flex flex-col gap-3">
          <Link className="py-2 px-3 rounded-md hover:text-primary hover:bg-primary/5 transition-all duration-200 transform hover:translate-x-1" href="/" onClick={() => setOpen(false)}>
            <span className="flex items-center gap-2">
              <span>🏠</span> Home
            </span>
          </Link>
          <Link className="py-2 px-3 rounded-md hover:text-primary hover:bg-primary/5 transition-all duration-200 transform hover:translate-x-1" href="/about" onClick={() => setOpen(false)}>
            <span className="flex items-center gap-2">
              <span>ℹ️</span> About
            </span>
          </Link>
          <Link className="py-2 px-3 rounded-md hover:text-primary hover:bg-primary/5 transition-all duration-200 transform hover:translate-x-1" href="/programs" onClick={() => setOpen(false)}>
            <span className="flex items-center gap-2">
              <span>🥋</span> Programs
            </span>
          </Link>
          <Link className="py-2 px-3 rounded-md hover:text-primary hover:bg-primary/5 transition-all duration-200 transform hover:translate-x-1" href="/contact" onClick={() => setOpen(false)}>
            <span className="flex items-center gap-2">
              <span>📞</span> Contact
            </span>
          </Link>
          <Link href="/contact" className="btn btn-primary mt-3 transform hover:scale-105 transition-transform duration-200" onClick={() => setOpen(false)}>
            ✨ Book a Free Trial
          </Link>
          <Link className="py-2 px-3 rounded-md hover:text-primary hover:bg-primary/5 transition-all duration-200 text-sm opacity-60" href="/admin" onClick={() => setOpen(false)}>
            <span className="flex items-center gap-2">
              <span>⚙️</span> Admin
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}



