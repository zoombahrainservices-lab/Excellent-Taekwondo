"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Valid email is required";
    if (!/^\+?[0-9\-\s()]{7,}$/.test(form.phone)) e.phone = "Valid phone is required";
    if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Placeholder: send to your provider
      // Example (Formspree): fetch('https://formspree.io/f/xxxxxx', { method: 'POST', body: new FormData(ev.currentTarget) })
      // Example (Netlify): add data-netlify="true" name="contact" to <form>, include a hidden input <input type="hidden" name="form-name" value="contact" />
      
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container-max py-12">
      <h1 className="text-4xl font-bold">Contact Us</h1>
      <p className="mt-3 text-slate-700 max-w-2xl">Have questions or want to book a free trial? Send us a message and we’ll get back to you shortly.</p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="space-y-8">
          <form onSubmit={onSubmit} noValidate className="grid gap-6">
            <div className="group">
              <label className="block text-sm font-medium text-dark mb-2" htmlFor="name">Name *</label>
              <input 
                id="name" 
                name="name" 
                type="text" 
                className={`mt-1 block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                  errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-300 focus:border-primary hover:border-slate-400'
                }`}
                placeholder="Enter your full name"
                value={form.name} 
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }} 
                aria-invalid={!!errors.name} 
                aria-describedby="name-error" 
                disabled={isSubmitting}
              />
              {errors.name && <p id="name-error" className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.name}
              </p>}
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-dark mb-2" htmlFor="email">Email *</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                className={`mt-1 block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                  errors.email ? 'border-rose-300 bg-rose-50' : 'border-slate-300 focus:border-primary hover:border-slate-400'
                }`}
                placeholder="your.email@example.com"
                value={form.email} 
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }} 
                aria-invalid={!!errors.email} 
                aria-describedby="email-error" 
                disabled={isSubmitting}
              />
              {errors.email && <p id="email-error" className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.email}
              </p>}
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-dark mb-2" htmlFor="phone">Phone *</label>
              <input 
                id="phone" 
                name="phone" 
                type="tel" 
                className={`mt-1 block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                  errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-300 focus:border-primary hover:border-slate-400'
                }`}
                placeholder="+1 (555) 123-4567"
                value={form.phone} 
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }} 
                aria-invalid={!!errors.phone} 
                aria-describedby="phone-error" 
                disabled={isSubmitting}
              />
              {errors.phone && <p id="phone-error" className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.phone}
              </p>}
            </div>
            
            <div className="group">
              <label className="block text-sm font-medium text-dark mb-2" htmlFor="message">Message *</label>
              <textarea 
                id="message" 
                name="message" 
                rows="5" 
                className={`mt-1 block w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none ${
                  errors.message ? 'border-rose-300 bg-rose-50' : 'border-slate-300 focus:border-primary hover:border-slate-400'
                }`}
                placeholder="Tell us about your interest in Taekwondo classes..."
                value={form.message} 
                onChange={(e) => {
                  setForm({ ...form, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: undefined });
                }} 
                aria-invalid={!!errors.message} 
                aria-describedby="message-error" 
                disabled={isSubmitting}
              />
              {errors.message && <p id="message-error" className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {errors.message}
              </p>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-fit hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Send Message
                </>
              )}
            </button>
          </form>

          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 animate-fade-in-up">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-green-800">Message sent successfully!</h3>
                <p className="text-sm text-green-700 mt-1">Thanks for reaching out! We'll get back to you within 24 hours.</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-4 content-start">
          <div className="aspect-video w-full rounded-md overflow-hidden border border-slate-200">
            <iframe
              title="Google Maps Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.08686127167!2d-122.419415!3d37.774929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjciTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1610000000000"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
          <div>
            <p className="text-slate-700">123 Dojang Street, Your City</p>
            <div className="mt-2 grid gap-1">
              <a className="text-primary hover:underline" href="tel:+10000000000">Call: +1 (000) 000-0000</a>
              <a className="text-primary hover:underline" href="mailto:info@example.com">Email: info@example.com</a>
              <a className="text-primary hover:underline" href="https://wa.me/10000000000" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


