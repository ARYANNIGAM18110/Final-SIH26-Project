import React from 'react';
import { Radio, Shield } from 'lucide-react';

export default function Footer({ currentTheme }) {
  return (
    <footer
      className="w-full py-3.5 px-4 sm:px-6 text-center text-xs border-t mt-auto backdrop-blur-md transition-colors"
      style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono font-bold text-[11px] text-emerald-600 dark:text-emerald-400">
            P2P MESH NODE: ONLINE
          </span>
          <span className="opacity-40">•</span>
          <span className="text-[11px] font-medium">KARUNA Mission Response OS v2.4</span>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-amber-500" />
            <span>Store-and-Forward Mesh Ready</span>
          </span>
          <span className="opacity-40">•</span>
          <span className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-blue-500" />
            <span>NDRF Triage Protocol</span>
          </span>
        </div>
      </div>
    </footer>
  );
}