import React from 'react';

export default function Toast({ toastMessage }) {
  if (!toastMessage) return null;

  return (
    <div className="fixed top-16 sm:top-20 z-50 px-5 py-2.5 rounded-2xl text-xs font-black shadow-2xl transition-all bg-emerald-600 text-white border border-emerald-400 animate-fadeIn">
      {toastMessage.text}
    </div>
  );
}