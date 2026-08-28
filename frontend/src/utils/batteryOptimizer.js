export function registerBatteryOptimizer(onPowerStateChange) {
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      const evaluatePower = () => {
        const level = battery.level;
        const isCharging = battery.charging;
        
        const isLowPower = level <= 0.20 && !isCharging;
        const isCritical = level <= 0.10 && !isCharging;

        if (typeof onPowerStateChange === 'function') {
          onPowerStateChange({
            levelPercent: Math.round(level * 100),
            isCharging,
            isLowPower,
            isCritical,
            recommendedGpsInterval: isCritical ? 60000 : (isLowPower ? 30000 : 5000)
          });
        }
      };

      evaluatePower();
      battery.addEventListener('levelchange', evaluatePower);
      battery.addEventListener('chargingchange', evaluatePower);
    }).catch(() => {
      if (typeof onPowerStateChange === 'function') {
        onPowerStateChange({ levelPercent: 100, isCharging: true, isLowPower: false, isCritical: false, recommendedGpsInterval: 5000 });
      }
    });
  } else {
    if (typeof onPowerStateChange === 'function') {
      onPowerStateChange({ levelPercent: 95, isCharging: false, isLowPower: false, isCritical: false, recommendedGpsInterval: 5000 });
    }
  }
}