// Native Web Haptic Vibration & Tactile Feedback Engine
export function triggerHapticFeedback(pattern = 'medium') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;

  try {
    switch (pattern) {
      case 'light':
        navigator.vibrate(35);
        break;
      case 'medium':
        navigator.vibrate(70);
        break;
      case 'heavy':
        navigator.vibrate(120);
        break;
      case 'success':
        navigator.vibrate([40, 60, 80]);
        break;
      case 'danger':
      case 'sos':
        // Strong SOS rhythm: ... --- ...
        navigator.vibrate([150, 80, 150, 80, 300, 100, 150]);
        break;
      case 'warning':
        navigator.vibrate([90, 50, 90]);
        break;
      default:
        navigator.vibrate(50);
    }
  } catch (e) {
    // Ignore unsupported browser silent failures
  }
}