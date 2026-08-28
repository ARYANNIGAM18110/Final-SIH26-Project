// Web Bluetooth Service UUID for Emergency Mesh
const EMERGENCY_BLE_SERVICE_UUID = '0000feaa-0000-1000-8000-00805f9b34fb';
const EMERGENCY_CHARACTERISTIC_UUID = '0000fe01-0000-1000-8000-00805f9b34fb';

export async function checkBluetoothAvailability() {
  if ('bluetooth' in navigator && typeof navigator.bluetooth.getAvailability === 'function') {
    return await navigator.bluetooth.getAvailability();
  }
  return false;
}

export async function broadcastDistressPacket(ticketData) {
  if (!('bluetooth' in navigator)) {
    return { success: false, reason: 'BLE_NOT_SUPPORTED' };
  }

  try {
    // acceptAllDevices: true makes every nearby device visible for demo pairing
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['generic_access', 'battery_service']
    });

    return { 
      success: true, 
      deviceName: device.name || 'Nearby Device (Paired)' 
    };
  } catch (error) {
    return { success: false, reason: error.message };
  }
}

export async function scanNearbyBleRescuers(onFoundCallback) {
  if (!('bluetooth' in navigator) || !navigator.bluetooth.requestLEScan) {
    return { success: false, reason: 'BLE_SCAN_NOT_SUPPORTED' };
  }

  try {
    const scan = await navigator.bluetooth.requestLEScan({
      filters: [{ services: [EMERGENCY_BLE_SERVICE_UUID] }],
      keepRepeatedDevices: false
    });

    navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
      if (typeof onFoundCallback === 'function') {
        onFoundCallback({
          deviceId: event.device.id,
          name: event.device.name || 'NDRF Mesh Relay Node',
          rssi: event.rssi,
          timestamp: Date.now()
        });
      }
    });

    return { success: true, scanInstance: scan };
  } catch (err) {
    return { success: false, reason: err.message };
  }
}