"use client";

import Link from "next/link";
import { useState } from "react";

export default function CTA({ href = "/contact", label = "Book a Free Trial", variant = "primary" }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = "btn relative overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-lg";
  const variantClasses = variant === "primary" 
    ? "btn-primary" 
    : "btn-outline";
  
  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${variantClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="relative z-10 flex items-center gap-2">
        {variant === "primary" && (
          <svg className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'rotate-12' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        )}
        <span>{label}</span>
        <svg className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </span>
      
      {/* Animated background effect */}
      <div className={`absolute inset-0 transition-transform duration-300 ${variant === "primary" ? 'bg-white/20' : 'bg-primary/10'} ${isHovered ? 'scale-100' : 'scale-0'} rounded-md`}></div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 opacity-0 group-active:opacity-30 transition-opacity duration-200">
        <div className="absolute inset-0 bg-white rounded-md transform scale-0 group-active:scale-100 transition-transform duration-200"></div>
      </div>
    </Link>
  );
}



