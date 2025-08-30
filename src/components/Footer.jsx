"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="mt-16 border-t border-accent/30 bg-gradient-to-br from-surface/15 via-background to-accent/20 relative overflow-hidden shadow-2xl">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-32 h-32 bg-primary rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-accent rounded-full"></div>
        </div>
        
        <div className="container-max py-12 relative">
          <div className="grid gap-8 md:grid-cols-4 text-sm">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md">
                  <img 
                    src="/favicon.ico" 
                    alt="Excellent Taekwondo Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-bold text-dark text-lg">Excellent <span className="text-primary">TAEKWONDO</span></p>
              </div>
              <p className="text-slate-600 mb-4 max-w-md">Building character, confidence, and physical fitness through traditional martial arts training. Join our community today!</p>
              <div className="flex items-center gap-1 text-slate-600">
                <span>⭐⭐⭐⭐⭐</span>
                <span className="ml-2 text-xs">Rated 5.0 by our students</span>
              </div>
            </div>
            
            <nav className="grid gap-3" aria-label="Footer">
              <h3 className="font-semibold text-dark mb-2">Quick Links</h3>
              <Link className="text-slate-600 hover:text-primary transition-colors duration-200 flex items-center gap-2 group" href="/about">
                <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:bg-primary transition-colors duration-200"></span>
                About
              </Link>
              <Link className="text-slate-600 hover:text-primary transition-colors duration-200 flex items-center gap-2 group" href="/programs">
                <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:bg-primary transition-colors duration-200"></span>
                Programs
              </Link>
              <Link className="text-slate-600 hover:text-primary transition-colors duration-200 flex items-center gap-2 group" href="/contact">
                <span className="w-1 h-1 bg-slate-400 rounded-full group-hover:bg-primary transition-colors duration-200"></span>
                Contact
              </Link>
            </nav>
            
            <div className="grid gap-3">
              <h3 className="font-semibold text-dark mb-2">Get in Touch</h3>
              <a className="text-slate-600 hover:text-primary transition-colors duration-200 flex items-center gap-3 group" href="tel:+97332051159">
                <div className="w-8 h-8 bg-slate-200 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <span>+(973) 3205 1159</span>
              </a>
              <a className="text-slate-600 hover:text-primary transition-colors duration-200 flex items-center gap-3 group" href="mailto:info@zoombahrain.com">
                <div className="w-8 h-8 bg-slate-200 group-hover:bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <span>info@zoombahrain.com</span>
              </a>
              <a className="text-slate-600 hover:text-primary transition-colors duration-200 flex items-center gap-3 group" href="https://wa.me/+97332051159" target="_blank" rel="noopener noreferrer">
                <div className="w-8 h-8 bg-slate-200 group-hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                  </svg>
                </div>
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-200 bg-slate-100/50">
          <div className="container-max py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© {new Date().getFullYear()} Excellent Taekwondo. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>Made with ❤️ for martial arts excellence</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-3 z-50">
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/+97332051159?text=Hi! I'm interested in Taekwondo classes"
          target="_blank"
          rel="noopener noreferrer"
          className="group w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 animate-pulse hover:animate-none"
          aria-label="Chat on WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
          </svg>
          
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chat with us on WhatsApp
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </a>

        {/* Call Button */}
        <a
          href="tel:+97332051159"
          className="group w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
          aria-label="Call us"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          
          {/* Tooltip */}
          <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Call us now
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </a>

        {/* Scroll to top button */}
        <button
          onClick={scrollToTop}
          className={`w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
          </svg>
        </button>
      </div>
    </>
  );
}



