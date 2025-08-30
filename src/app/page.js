"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import CTA from "@/components/CTA";
import siteSettings from "@/data/website-settings.json";
import programs from "@/data/programs.json";
import testimonials from "@/data/testimonials.json";

function UpcomingSessions({ sessions }) {
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const levels = ['All', ...new Set(sessions.map(s => s.level))];
  const filteredSessions = filter === 'All' 
    ? sessions 
    : sessions.filter(s => s.level === filter);

  const getTimeUntil = (dateString, timeString) => {
    const sessionDate = new Date(dateString);
    const [time, period] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours);
    if (period === 'PM' && hour24 !== 12) hour24 += 12;
    if (period === 'AM' && hour24 === 12) hour24 = 0;
    
    sessionDate.setHours(hour24, parseInt(minutes), 0, 0);
    
    const now = new Date();
    const diffMs = sessionDate - now;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} days`;
    if (diffHours > 0) return `${diffHours} hours`;
    return 'Soon';
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Kids': return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' };
      case 'Teens': return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', dot: 'bg-green-500' };
      case 'Adults': return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' };
      case 'Black Belt': return { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-700', dot: 'bg-gray-700' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' };
    }
  };

  const getSessionIcon = (level) => {
    switch(level) {
      case 'Kids': return '👶';
      case 'Teens': return '🧒';
      case 'Adults': return '👨‍💼';
      case 'Black Belt': return '🥋';
      default: return '⭐';
    }
  };

  return (
    <section className="container-max py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8">
        <div className="mb-6 lg:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold">Upcoming Sessions</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600 font-medium">Live Schedule</span>
            </div>
          </div>
          <p className="text-slate-600">Join our next training sessions and start your martial arts journey</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === level
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Display */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No sessions found</h3>
          <p className="text-slate-600">Try selecting a different filter or check back later for updates.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
          : "space-y-4"
        }>
          {filteredSessions.map((session, i) => {
            const levelColors = getLevelColor(session.level);
            const timeUntil = getTimeUntil(session.date, session.time);
            const isToday = new Date(session.date).toDateString() === new Date().toDateString();

            return viewMode === 'grid' ? (
              // Grid View
              <div
                key={i}
                className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
                
                {/* Today indicator */}
                {isToday && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full animate-pulse">
                    TODAY
                  </div>
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {getSessionIcon(session.level)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${levelColors.bg} ${levelColors.text} ${levelColors.border} group-hover:scale-105 transition-transform duration-300`}>
                      {session.level}
                    </span>
                  </div>

                  {/* Session Info */}
                  <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors duration-300 mb-3">
                    {session.name}
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>{new Date(session.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span>{session.time}</span>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <div className={`w-2 h-2 rounded-full ${levelColors.dot}`}></div>
                      <span>Starts in {timeUntil}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                      Join Session →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <div
                key={i}
                className="group bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">{getSessionIcon(session.level)}</div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-dark group-hover:text-primary transition-colors duration-300">
                          {session.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelColors.bg} ${levelColors.text}`}>
                          {session.level}
                        </span>
                        {isToday && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                            TODAY
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span>{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <span>{session.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${levelColors.dot}`}></div>
                          <span>Starts in {timeUntil}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="opacity-0 group-hover:opacity-100 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105">
                    Join
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-8 border border-slate-200">
          <h3 className="text-xl font-bold text-dark mb-3">Don&apos;t see a suitable time?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            We offer flexible scheduling and private sessions. Contact us to discuss custom training times that work for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              📞 Request Custom Schedule
            </Link>
            <Link href="/contact" className="btn btn-gold">
              📧 Get Full Timetable
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgramPreviewCard({ program, index }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const getAgeEmoji = (ageRange) => {
    if (ageRange.includes('4-6')) return '👶';
    if (ageRange.includes('7-12')) return '🧒';
    if (ageRange.includes('13')) return '👦';
    return '👨‍💼';
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Kids': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Teens': return 'bg-green-100 text-green-700 border-green-200';
      case 'Adults': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Black Belt': return 'bg-gray-900 text-white border-gray-700';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <article 
      className="group rounded-xl border border-accent/30 p-6 bg-gradient-to-br from-background via-surface/12 to-accent/15 hover:shadow-xl hover:shadow-accent/30 hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="text-3xl">{getAgeEmoji(program.ageRange)}</div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(program.level)} group-hover:scale-105 transition-transform duration-300`}>
            {program.level}
          </span>
        </div>
        
        <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors duration-300 mb-2">
          {program.name}
        </h3>
        
        <p className="text-sm text-slate-600 mb-3 flex items-center gap-2">
          <span>👥</span>
          <span>Ages {program.ageRange}</span>
        </p>
        
        <p className="text-slate-700 group-hover:text-slate-800 transition-colors duration-300 mb-4 leading-relaxed">
          {program.blurb}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{program.days.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{program.time}</span>
          </div>
        </div>
        
        {/* Quick action on hover */}
        <div className={`mt-4 pt-4 border-t border-slate-100 transition-all duration-300 ${showDetails ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
          >
            <span>Join this class</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeatureCard({ feature, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`group rounded-xl border border-accent/30 p-8 bg-gradient-to-br from-background via-surface/15 to-accent/12 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30 hover:scale-105 cursor-pointer ${feature.color}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="text-center">
        <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
          {feature.icon}
        </div>
        <h3 className="text-2xl font-bold text-dark group-hover:text-primary transition-colors duration-300 mb-3">
          {feature.title}
        </h3>
        <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300 leading-relaxed">
          {feature.description}
        </p>
        
        {/* Expandable content */}
        <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
          <div className="pt-4 border-t border-slate-200">
            <h4 className="font-semibold text-dark mb-3">Key Benefits:</h4>
            <div className="grid grid-cols-2 gap-2">
              {feature.features.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Expand indicator */}
        <div className="mt-4 flex justify-center">
          <div className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'rotate-180 bg-primary' : 'group-hover:bg-slate-200'}`}>
            <svg className={`w-3 h-3 transition-colors duration-300 ${isExpanded ? 'text-white' : 'text-slate-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function getNextSessions(count = 5) {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const upcoming = [];
  const now = new Date();
  for (let i = 0; i < 21 && upcoming.length < count + 2; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const day = daysOfWeek[d.getDay()];
    programs.forEach((p) => {
      if (p.days.includes(day)) {
        upcoming.push({
          date: d.toDateString(),
          name: p.name,
          level: p.level,
          time: p.time,
        });
      }
    });
  }
  return upcoming.slice(2, count + 2); // Skip first 2 sessions
}

export default function Home() {
  const nextSessions = getNextSessions(5);
  return (
    <div className="bg-gradient-to-br from-background via-surface/10 to-accent/8 min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-background via-surface/10 to-accent/15">
        <div className="absolute inset-0 -z-10">
          <Image
            src={siteSettings.heroImage || "/images/et1.jpg"}
            alt="Excellent Taekwondo — adults martial arts classes poster"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
            style={{ objectPosition: 'center center' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/85 via-primary/70 to-accent/50" />
        </div>
        <div className="container-max py-24 md:py-36 text-white">
          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl leading-tight">Build Discipline, Confidence, and Fitness with Excellent Taekwondo</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-100">All ages and skill levels welcome. Join our supportive community and start your journey today.</p>
          <div className="mt-8 flex gap-4">
            <CTA href="/contact" label="Book a Free Trial" variant="primary" />
            <CTA href="/programs" label="View Programs" variant="outline" />
          </div>
        </div>
      </section>

      {/* Promotions gallery */}
      <section className="container-max py-10 bg-gradient-to-r from-surface/20 to-accent/15 rounded-3xl mx-4 my-8 shadow-lg">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Latest Promotions</h2>
            <p className="text-slate-600 mt-2">Discover our special offers and events</p>
          </div>
          <Link className="group text-primary hover:text-primary/80 transition-all duration-200 flex items-center gap-2 font-medium" href="/contact">
            <span>Enroll Now</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto">
          <div className="flex gap-6 min-w-full pb-4">
            {[
              {src: "/images/et2.jpg", alt: "Excellent Taekwondo — adults martial arts classes poster", title: "Adult Classes", badge: "Popular"},
              {src: "/images/et1.jpg", alt: "Excellent Taekwondo — enroll now promotional poster", title: "Special Offer", badge: "Limited Time"},
              {src: "/images/et3.jpg", alt: "Excellent Taekwondo — kids martial arts classes poster", title: "Kids Program", badge: "New"}
            ].map((img, i) => (
              <div key={i} className="group relative h-64 w-[360px] sm:w-[420px] flex-shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 768px) 360px, 420px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : 'bg-green-500'
                } transform group-hover:scale-110 transition-transform duration-300`}>
                  {img.badge}
                </div>
                
                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-semibold text-lg">{img.title}</h3>
                  <p className="text-white/90 text-sm">Learn more about this program</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container-max py-16 bg-gradient-to-br from-surface/15 via-background to-accent/10 rounded-3xl mx-4 my-8 shadow-xl border border-surface/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark">Why Choose Excellent Taekwondo?</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Transform your life through martial arts with our comprehensive approach to physical and mental development.</p>
            </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Discipline", 
              description: "Build self-control and focus through structured training routines and traditional martial arts principles.",
              icon: "🥋",
              color: "border-primary/20 hover:border-primary/50 hover:bg-primary/5",
              features: ["Mental Focus", "Self-Control", "Goal Setting", "Time Management"]
            },
            {
              title: "Confidence", 
              description: "Develop inner strength and self-assurance through progressive skill building and personal achievements.",
              icon: "💪",
              color: "border-accent/20 hover:border-accent/50 hover:bg-accent/5",
              features: ["Self-Esteem", "Leadership", "Public Speaking", "Social Skills"]
            },
            {
              title: "Fitness", 
              description: "Improve cardiovascular health, flexibility, and strength through dynamic martial arts movements.",
              icon: "⚡",
              color: "border-primary/20 hover:border-primary/50 hover:bg-primary/5",
              features: ["Cardio Health", "Flexibility", "Strength", "Coordination"]
            }
          ].map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Programs preview */}
      <section className="container-max py-16 bg-gradient-to-l from-accent/12 via-surface/15 to-primary/10 rounded-3xl mx-4 my-8 shadow-xl border border-accent/20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="mb-4 md:mb-0">
            <h2 className="text-3xl font-bold">Our Programs</h2>
            <p className="text-slate-600 mt-2">Choose the perfect class for your age and skill level</p>
          </div>
          <Link className="group text-primary hover:text-primary/80 transition-all duration-200 flex items-center gap-2 font-medium" href="/programs">
            <span>View All Programs</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 3).map((p, index) => (
            <ProgramPreviewCard key={p.name} program={p} index={index} />
          ))}
        </div>
        
        {/* Quick enrollment CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-8 border border-primary/20 shadow-lg">
            <h3 className="text-2xl font-bold text-dark mb-3">Ready to Start Your Journey?</h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">Join thousands of students who have transformed their lives through martial arts. Book your free trial class today!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTA href="/contact" label="📞 Book Free Trial" />
              <Link href="/programs" className="btn btn-gold">
                <span className="flex items-center gap-2">
                  <span>📋</span>
                  <span>View All Programs</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Sessions */}
      <div className="bg-gradient-to-tr from-primary/8 via-accent/12 to-surface/15 rounded-3xl mx-4 my-8 shadow-xl border border-primary/20">
        <UpcomingSessions sessions={nextSessions} />
      </div>

      {/* Testimonials slider (simple auto-advance) */}
      <div className="bg-gradient-to-bl from-surface/12 via-accent/15 to-primary/8 rounded-3xl mx-4 my-8 shadow-xl border border-accent/25">
      <TestimonialsSlider />
      </div>

      {/* CTA band */}
      <section className="relative text-white bg-gradient-to-r from-dark via-primary to-accent rounded-3xl mx-4 my-8 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/et1.jpg" alt="Excellent Taekwondo — enroll now promotional poster background" fill sizes="100vw" className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-primary/85 to-accent/75" />
        </div>
        <div className="container-max py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold">Ready to begin? Book a free trial class today.</h3>
          <CTA href="/contact" label="Book a Free Trial" />
        </div>
      </section>
    </div>
  );
}

function TestimonialsSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="container-max py-16">
      <div className="text-center mb-12">
      <h2 className="text-3xl font-bold">What Our Members Say</h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto">Real stories from our martial arts community</p>
      </div>
      
      <div 
        className="relative max-w-4xl mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main testimonial display */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100 min-h-[300px] flex items-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="w-full relative z-10">
            {/* Quote icon */}
            <div className="text-6xl text-primary/20 mb-6 font-serif">&quot;</div>
            
            {/* Testimonial content with smooth transitions */}
            <div className="transition-all duration-500 ease-in-out">
              <blockquote className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8 font-medium">
                {testimonials[currentIndex]?.quote}
              </blockquote>
              
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {testimonials[currentIndex]?.name.charAt(0)}
                </div>
                <div>
                  <figcaption className="font-bold text-dark text-lg">
                    {testimonials[currentIndex]?.name}
                  </figcaption>
                  <p className="text-slate-600">Martial Arts Student</p>
                  {/* Star rating */}
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                    <span className="text-xs text-slate-500 ml-1">5.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Previous button */}
          <button 
            onClick={prevTestimonial}
            className="group w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          {/* Dots indicator with progress */}
          <div className="flex items-center gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8 h-3 bg-primary rounded-full' 
                    : 'w-3 h-3 bg-slate-300 hover:bg-slate-400 rounded-full hover:scale-125'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping"></div>
                )}
              </button>
            ))}
          </div>

          {/* Next button */}
          <button 
            onClick={nextTestimonial}
            className="group w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 hover:scale-110"
            aria-label="Next testimonial"
          >
            <svg className="w-5 h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Auto-play controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary transition-colors duration-200 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 hover:border-primary/30"
          >
            {isAutoPlaying ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6"></path>
                </svg>
                Pause auto-play
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1"></path>
                </svg>
                Resume auto-play
              </>
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-slate-200 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-100 ease-linear"
            style={{
              width: isAutoPlaying && !isHovered ? '100%' : '0%',
              transition: isAutoPlaying && !isHovered ? 'width 4000ms linear' : 'width 0.3s ease'
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}
