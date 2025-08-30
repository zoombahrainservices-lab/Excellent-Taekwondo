"use client";

import { useState } from 'react';

export default function ColorPaletteShowcase() {
  const [selectedPalette, setSelectedPalette] = useState('premium');

  const palettes = {
    classic: {
      name: "Classic & Powerful",
      description: "Traditional Taekwondo - Authority, tradition, strength",
      colors: {
        primary: "#E53935",
        secondary: "#FFC107", 
        background: "#FFFFFF",
        surface: "#F5F5F5",
        text: "#111111"
      },
      audience: "Adults, traditional martial arts enthusiasts",
      mood: "Authoritative, Traditional, Strong"
    },
    modern: {
      name: "Modern & Energetic", 
      description: "Sporty & Youthful - Energy, innovation, fun",
      colors: {
        primary: "#007BFF",
        secondary: "#00E676",
        accent: "#FF3B3F", 
        background: "#FAFAFA",
        text: "#222222"
      },
      audience: "Young adults, fitness enthusiasts, beginners",
      mood: "Energetic, Fun, Approachable"
    },
    premium: {
      name: "Premium & Minimalist",
      description: "Elite & High-End - Excellence, sophistication, exclusivity", 
      colors: {
        primary: "#D72638",
        secondary: "#FFD700",
        accent: "#0D1B2A",
        background: "#FFFFFF", 
        surface: "#2F3E46",
        text: "#0D1B2A"
      },
      audience: "Affluent clients, serious competitors, premium market",
      mood: "Sophisticated, Exclusive, Professional"
    }
  };

  const currentPalette = palettes[selectedPalette];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Taekwondo Website Color Palette Options
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the perfect color scheme that represents your martial arts school's identity and appeals to your target audience.
        </p>
      </div>

      {/* Palette Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {Object.entries(palettes).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => setSelectedPalette(key)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              selectedPalette === key
                ? 'bg-blue-600 text-white shadow-lg scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {palette.name}
          </button>
        ))}
      </div>

      {/* Selected Palette Display */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Color Swatches */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-4">{currentPalette.name}</h3>
            <p className="text-gray-600 mb-4">{currentPalette.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentPalette.colors).map(([name, color]) => (
                <div key={name} className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                    style={{ backgroundColor: color }}
                  ></div>
                  <div>
                    <div className="font-semibold capitalize text-sm">{name}</div>
                    <div className="text-xs text-gray-500 font-mono">{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Target Audience:</h4>
            <p className="text-sm text-gray-600 mb-3">{currentPalette.audience}</p>
            
            <h4 className="font-semibold mb-2">Brand Mood:</h4>
            <p className="text-sm text-gray-600">{currentPalette.mood}</p>
          </div>
        </div>

        {/* Website Preview Mockup */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Website Preview</h3>
          
          {/* Hero Section Mockup */}
          <div 
            className="rounded-lg p-6 text-center"
            style={{ 
              backgroundColor: selectedPalette === 'modern' || selectedPalette === 'premium' 
                ? currentPalette.colors.accent || currentPalette.colors.primary
                : currentPalette.colors.background,
              color: selectedPalette === 'modern' || selectedPalette === 'premium'
                ? '#FFFFFF'
                : currentPalette.colors.text
            }}
          >
            <h4 className="text-2xl font-bold mb-2">Excellent Taekwondo</h4>
            <p className="mb-4 opacity-90">Build Discipline, Confidence, and Fitness</p>
            <div className="flex gap-2 justify-center">
              <button 
                className="px-4 py-2 rounded-md font-semibold text-sm transition-transform hover:scale-105"
                style={{ 
                  backgroundColor: currentPalette.colors.primary,
                  color: '#FFFFFF'
                }}
              >
                Book Free Trial
              </button>
              <button 
                className="px-4 py-2 rounded-md font-semibold text-sm border-2 transition-transform hover:scale-105"
                style={{ 
                  borderColor: currentPalette.colors.secondary || currentPalette.colors.primary,
                  color: selectedPalette === 'modern' || selectedPalette === 'premium' 
                    ? '#FFFFFF' 
                    : currentPalette.colors.primary,
                  backgroundColor: 'transparent'
                }}
              >
                View Programs
              </button>
            </div>
          </div>

          {/* Card Mockup */}
          <div 
            className="rounded-lg p-4 border"
            style={{ 
              backgroundColor: currentPalette.colors.background,
              borderColor: currentPalette.colors.surface || '#E5E5E5'
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: currentPalette.colors.primary }}
              >
                🥋
              </div>
              <h5 className="font-semibold" style={{ color: currentPalette.colors.text }}>
                Adult Classes
              </h5>
            </div>
            <p className="text-sm mb-3" style={{ color: currentPalette.colors.text + '99' }}>
              Professional training for adults of all skill levels
            </p>
            <button 
              className="text-sm font-semibold"
              style={{ color: currentPalette.colors.primary }}
            >
              Learn More →
            </button>
          </div>

          {/* Navigation Mockup */}
          <div 
            className="rounded-lg p-3 flex items-center justify-between text-sm"
            style={{ 
              backgroundColor: currentPalette.colors.surface || currentPalette.colors.background,
              borderBottom: `2px solid ${currentPalette.colors.primary}`
            }}
          >
            <div className="font-bold" style={{ color: currentPalette.colors.text }}>
              Logo
            </div>
            <div className="flex gap-4">
              {['Home', 'About', 'Programs', 'Contact'].map((item) => (
                <span 
                  key={item}
                  className="hover:underline cursor-pointer"
                  style={{ color: currentPalette.colors.text }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Implementation Code</h3>
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
          <div>/* CSS Variables for {currentPalette.name} */</div>
          <div>:root {`{`}</div>
          {Object.entries(currentPalette.colors).map(([name, color]) => (
            <div key={name} className="ml-4">
              --{name}: {color};
            </div>
          ))}
          <div>{`}`}</div>
        </div>
      </div>
    </div>
  );
}
