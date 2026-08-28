import React from 'react';
import { Shield, Sun, Moon, Home } from 'lucide-react';

export default function Header({ currentTheme, theme, toggleTheme, onRequestGoHome }) {
  return (
    <header
      className="w-full px-4 sm:px-6 py-3.5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30 transition-colors"
      style={{ borderColor: currentTheme.border }}
    >
      <div className="flex items-center space-x-3 cursor-pointer" onClick={onRequestGoHome}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
          style={{ backgroundColor: currentTheme.btnAuth, color: currentTheme.textPrimary }}
        >
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-tight" style={{ color: currentTheme.textPrimary }}>
            KARUNA : Ai Powered Rapid Response Portal
          </h1>
          <p className="text-[11px] sm:text-xs font-medium" style={{ color: currentTheme.textMuted }}>
            Rapid Access Control & GIS Crowd Radar Engine
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm border hover:opacity-90 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: currentTheme.bgCard,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
        >
          {theme === 'light' ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4 text-amber-200" />}
          <span className="hidden sm:inline">{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>

        <button
          onClick={onRequestGoHome}
          className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm border hover:opacity-90 active:scale-95 cursor-pointer"
          style={{
            backgroundColor: currentTheme.btnAuth,
            borderColor: currentTheme.border,
            color: currentTheme.textPrimary
          }}
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </button>
      </div>
    </header>
  );
}