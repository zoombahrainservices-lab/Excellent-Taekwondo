"use client";

import { useMemo, useState } from "react";
import programs from "@/data/programs.json";

const LEVELS = ["All", "Kids", "Teens", "Adults", "Black Belt"];

function ProgramCard({ program, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getColorScheme = (index) => {
    const colors = [
      { bg: 'bg-primary', text: 'text-primary', border: 'border-primary/20 hover:border-primary/50', accent: 'bg-primary/5' },
      { bg: 'bg-accent', text: 'text-accent', border: 'border-accent/20 hover:border-accent/50', accent: 'bg-accent/5' },
      { bg: 'bg-slate-600', text: 'text-slate-600', border: 'border-slate-200 hover:border-slate-300', accent: 'bg-slate-50' }
    ];
    return colors[index % colors.length];
  };
  
  const colorScheme = getColorScheme(index);
  
  return (
    <article className={`group rounded-lg border p-6 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${colorScheme.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${colorScheme.bg} group-hover:scale-110 transition-transform duration-300`}>
          {program.level.charAt(0)}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-2 rounded-full transition-all duration-300 ${colorScheme.accent} ${colorScheme.text} hover:scale-110`}
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      <h3 className={`text-xl font-semibold text-dark group-hover:${colorScheme.text} transition-colors duration-300`}>{program.name}</h3>
      <p className="text-sm text-slate-600 mb-3">Ages {program.ageRange} • <span className="font-medium">{program.level}</span></p>
      <p className="text-slate-700 group-hover:text-slate-800 transition-colors duration-300">{program.blurb}</p>
      
      <div className={`mt-4 pt-4 border-t transition-all duration-300 ${isExpanded ? 'border-primary/20' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <span>{program.days.join(", ")}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{program.time}</span>
        </div>
      </div>
      
      {/* Expanded content */}
      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pt-4 space-y-4">
          <div className={`p-4 rounded-lg ${colorScheme.accent}`}>
            <h4 className="font-semibold text-dark mb-2">What You'll Learn:</h4>
            <ul className="text-sm text-slate-700 space-y-1">
              <li>• Basic kicks and punches</li>
              <li>• Self-defense techniques</li>
              <li>• Forms and patterns</li>
              <li>• Sparring fundamentals</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <button className={`flex-1 btn btn-primary text-sm py-2`}>
              Join Class
            </button>
            <button className={`px-3 py-2 rounded-md border ${colorScheme.border} ${colorScheme.text} hover:${colorScheme.accent} transition-colors duration-200`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProgramsPage() {
  const [level, setLevel] = useState("All");
  const filtered = useMemo(
    () => (level === "All" ? programs : programs.filter((p) => p.level === level)),
    [level]
  );

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold">Programs</h1>
      <p className="mt-3 text-slate-700">Filter by level to find the right class for you.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`btn ${l === level ? "btn-primary" : "btn-outline"}`}
            onClick={() => setLevel(l)}
            aria-pressed={l === level}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, index) => (
          <ProgramCard key={p.name} program={p} index={index} />
        ))}
      </div>
    </div>
  );
}


