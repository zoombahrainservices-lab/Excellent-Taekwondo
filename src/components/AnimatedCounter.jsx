"use client";

import { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "" }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * end);
      
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef} className="inline-block">
      {prefix}{count}{suffix}
    </span>
  );
}

// Stats section component
export function StatsSection() {
  const stats = [
    { number: 500, suffix: "+", label: "Happy Students", icon: "👥", color: "text-blue-600" },
    { number: 15, suffix: "+", label: "Years Experience", icon: "🏆", color: "text-green-600" },
    { number: 50, suffix: "+", label: "Belt Promotions", icon: "🥋", color: "text-purple-600" },
    { number: 98, suffix: "%", label: "Success Rate", icon: "⭐", color: "text-yellow-600" }
  ];

  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-16">
      <div className="container-max">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Our Success in Numbers</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">These numbers represent the dedication and success of our martial arts community</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="group text-center">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 hover:border-primary/30">
                <div className={`text-4xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                  <AnimatedCounter end={stat.number} suffix={stat.suffix} duration={2500} />
                </div>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
