import React from 'react';
import {
  AlertTriangle,
  Globe,
  Stethoscope,
  Flame,
  Siren,
  Car,
  Mic,
  Sparkles,
  Keyboard,
  Camera,
  X,
  Send,
  RefreshCw
} from 'lucide-react';
import { LANGUAGES, VIRTUAL_KEYBOARD_LAYOUTS } from '../../data/constants';

export const CATEGORY_QUICK_PHRASES = {
  'Medical Emergency': [
    'Person is injured',
    'Medical emergency',
    'Need an ambulance',
    'Person is unconscious',
    'Severe bleeding',
    'Need immediate medical assistance'
  ],
  'Fire Help': [
    'Fire reported',
    'Building is on fire',
    'Smoke detected',
    'People trapped inside',
    'Fire spreading rapidly',
    'Need fire brigade immediately'
  ],
  'Police Help': [
    'Police assistance required',
    'Crowd disturbance',
    'Security threat',
    'Suspicious activity',
    'Need immediate police support',
    'Situation is becoming violent'
  ],
  'Accident': [
    'Road accident',
    'Multiple people injured',
    'Vehicle collision',
    'Need ambulance',
    'People trapped in vehicle',
    'Traffic blocked due to accident'
  ]
};

export default function EmergencyForm({
  currentTheme,
  selectedLang,
  setSelectedLang,
  emergencyCategoryInput,
  setEmergencyCategoryInput,
  isListening,
  toggleListening,
  emergencyText,
  setEmergencyText,
  showVirtualKeyboard,
  setShowVirtualKeyboard,
  handleKeyPress,
  handleBackspace,
  attachedPhoto,
  photoName,
  fileInputRef,
  handlePhotoUpload,
  removePhoto,
  isSubmitting,
  onSubmitEmergencyForm
}) {
  return (
    <div
      className="border rounded-3xl p-5 sm:p-8 shadow-2xl max-w-2xl w-full text-left relative transition-all"
      style={{
        backgroundColor: currentTheme.bgCard,
        borderColor: currentTheme.border,
        boxShadow: `0 20px 40px ${currentTheme.cardShadow}`
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b gap-2" style={{ borderColor: currentTheme.border }}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-red-600 dark:text-red-400 uppercase tracking-tight">
              Emergency Dispatch Form
            </h2>
            <p className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>
              Multilingual Voice & Text Help Input
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-black/5 dark:bg-white/10 p-1.5 rounded-xl border" style={{ borderColor: currentTheme.border }}>
          <Globe className="w-4 h-4 ml-1" style={{ color: currentTheme.textMuted }} />
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="bg-transparent text-xs font-bold outline-none cursor-pointer pr-1"
            style={{ color: currentTheme.textPrimary }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} className="text-black">
                {lang.flag} {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={onSubmitEmergencyForm} className="space-y-6">
        {/* Category Picker */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: currentTheme.textMuted }}>
            Select Emergency Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Medical Emergency', name: 'Medical', icon: Stethoscope },
              { id: 'Fire Help', name: 'Fire Help', icon: Flame },
              { id: 'Police Help', name: 'Police Help', icon: Siren },
              { id: 'Accident', name: 'Accident', icon: Car }
            ].map((cat) => {
              const CatIcon = cat.icon;
              const isSelected = emergencyCategoryInput === cat.id;
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setEmergencyCategoryInput(cat.id)}
                  className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center space-y-1.5 border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md scale-105'
                      : 'bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    borderColor: isSelected ? undefined : currentTheme.border,
                    color: isSelected ? undefined : currentTheme.textPrimary
                  }}
                >
                  <CatIcon className="w-5 h-5" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Voice Input Section */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border bg-black/5 dark:bg-white/5 text-center relative overflow-hidden" style={{ borderColor: currentTheme.border }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: currentTheme.textMuted }}>
            Tap Mic & Speak in Any Language
          </p>

          <button
            type="button"
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all transform active:scale-90 cursor-pointer ${
              isListening
                ? 'bg-red-600 text-white ring-8 ring-red-500/30 scale-105'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
            title="Click to speak your emergency"
          >
            <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
          </button>

          {isListening ? (
            <div className="flex items-center space-x-1.5 mt-4 h-8">
              <div className="w-1 h-6 bg-red-500 rounded-full animate-bounce"></div>
              <div className="w-1 h-8 bg-red-500 rounded-full animate-bounce delay-75"></div>
              <div className="w-1 h-5 bg-red-500 rounded-full animate-bounce delay-150"></div>
              <span className="text-xs font-bold text-red-600 ml-2 animate-pulse">Listening... Speak now</span>
            </div>
          ) : (
            <p className="text-[11px] font-semibold mt-3" style={{ color: currentTheme.textMuted }}>
              Microphone Ready ({LANGUAGES.find((l) => l.code === selectedLang)?.name})
            </p>
          )}
        </div>

        {/* Quick Phrases */}
        <div>
          <p className="text-xs font-bold mb-2 flex items-center space-x-1" style={{ color: currentTheme.textMuted }}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Dynamic Quick Phrases ({emergencyCategoryInput}):</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {(CATEGORY_QUICK_PHRASES[emergencyCategoryInput] || CATEGORY_QUICK_PHRASES['Medical Emergency']).map((phrase, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setEmergencyText((prev) => (prev ? `${prev} - ${phrase}` : phrase))}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:brightness-90 active:scale-95 cursor-pointer"
                style={{
                  backgroundColor: currentTheme.btnAuth,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary
                }}
              >
                + {phrase}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea & Virtual Keyboard */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
              Emergency Details
            </label>

            <button
              type="button"
              onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
              className="text-xs font-extrabold flex items-center space-x-1.5 px-3 py-1 rounded-lg border hover:brightness-95 transition-all cursor-pointer"
              style={{
                backgroundColor: currentTheme.btnAuth,
                borderColor: currentTheme.border,
                color: currentTheme.textPrimary
              }}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>{showVirtualKeyboard ? 'Hide Keyboard' : 'On-Screen Keyboard'}</span>
            </button>
          </div>

          <textarea
            rows={3}
            value={emergencyText}
            onChange={(e) => setEmergencyText(e.target.value)}
            placeholder="Describe what happened, location, or injured count..."
            className="w-full p-4 rounded-2xl border text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            style={{
              backgroundColor: 'rgba(0,0,0,0.03)',
              borderColor: currentTheme.border,
              color: currentTheme.textPrimary
            }}
            required
          />

          {showVirtualKeyboard && (
            <div className="mt-3 p-3 rounded-2xl border bg-black/10 dark:bg-black/30 space-y-2 animate-fadeIn" style={{ borderColor: currentTheme.border }}>
              <div className="flex justify-between items-center text-[11px] font-bold px-1" style={{ color: currentTheme.textMuted }}>
                <span>Virtual {LANGUAGES.find((l) => l.code === selectedLang)?.name} Keyboard</span>
                <button
                  type="button"
                  onClick={handleBackspace}
                  className="px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                >
                  ⌫ Delete
                </button>
              </div>

              {(VIRTUAL_KEYBOARD_LAYOUTS[selectedLang] || VIRTUAL_KEYBOARD_LAYOUTS['en-US']).map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
                  {row.map((char) => (
                    <button
                      type="button"
                      key={char}
                      onClick={() => handleKeyPress(char)}
                      className="flex-1 min-w-6 sm:min-w-9 py-2 rounded-lg text-xs sm:text-sm font-bold border shadow-sm transition-all hover:bg-white/30 active:scale-95 cursor-pointer"
                      style={{
                        backgroundColor: currentTheme.btnAuth,
                        borderColor: currentTheme.border,
                        color: currentTheme.textPrimary
                      }}
                    >
                      {char}
                    </button>
                  ))}
                </div>
              ))}

              <button
                type="button"
                onClick={() => handleKeyPress(' ')}
                className="w-full py-2 bg-stone-300 dark:bg-stone-700 text-xs font-extrabold rounded-xl border mt-1 cursor-pointer"
                style={{ color: currentTheme.textPrimary, borderColor: currentTheme.border }}
              >
                SPACEBAR
              </button>
            </div>
          )}
        </div>

        {/* Photo Upload */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: currentTheme.textMuted }}>
            Upload Photo (Optional)
          </label>

          {!attachedPhoto ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 flex flex-col items-center justify-center space-y-1.5"
              style={{ borderColor: currentTheme.border }}
            >
              <div className="p-2.5 rounded-full bg-red-500/10 text-red-600">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-extrabold" style={{ color: currentTheme.textPrimary }}>
                Click or Drag to Upload Incident Scene Photo
              </p>
              <p className="text-[11px]" style={{ color: currentTheme.textMuted }}>
                JPG, PNG, WEBP (Max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl border p-3 flex items-center space-x-3 bg-black/5 dark:bg-white/5" style={{ borderColor: currentTheme.border }}>
              <img
                src={attachedPhoto}
                alt="Incident Upload"
                className="w-16 h-16 object-cover rounded-xl border"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold truncate" style={{ color: currentTheme.textPrimary }}>
                  {photoName || 'Incident_Photo.jpg'}
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded mt-1">
                  Photo Ready
                </span>
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 cursor-pointer"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-red-600 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 hover:bg-red-700 cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Transmitting Emergency Coordinates...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>SEND EMERGENCY ALERT NOW</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}