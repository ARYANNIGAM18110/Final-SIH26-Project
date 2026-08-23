export const THEMES = {
  light: {
    bgPage: '#FBEFEF',
    bgCard: '#FFF2DB',
    btnAuth: '#FFE5BF',
    btnAuthHover: '#F2D3A7',
    textPrimary: '#3D2C2E',
    textMuted: '#7A6265',
    border: '#E8D3B8',
    cardShadow: 'rgba(61, 44, 46, 0.08)',
    inputBg: '#FFFDF9'
  },
  dark: {
    bgPage: '#0B192C',
    bgCard: '#071E3D',
    btnAuth: '#1E293B',
    btnAuthHover: '#334155',
    textPrimary: '#F1F5F9',
    textMuted: '#94A3B8',
    border: '#353941',
    cardShadow: 'rgba(0, 0, 0, 0.5)',
    inputBg: '#0F172A'
  }
};

export const VALID_USERS = [
  { badgeId: 'AUTH-8821', pin: '7749', name: 'Officer Alex Mercer', role: 'Security Ops Lead', clearance: 'Level 4 Command' },
  { badgeId: 'EMP-1001', pin: '1234', name: 'Dr. Sarah Connor', role: 'Senior Systems Admin', clearance: 'Level 3 Admin' }
];

export const INITIAL_ENTRY_LOGS = [
  { id: 'ENT-9012', name: 'Marcus Vance', type: 'Contractor', idNumber: 'GOV-88192', zone: 'Server Room B', timeIn: '08:45 AM', status: 'ACTIVE' },
  { id: 'ENT-9013', name: 'Elena Rostova', type: 'Executive Staff', idNumber: 'EMP-3042', zone: 'Command Hub 01', timeIn: '09:10 AM', status: 'ACTIVE' },
  { id: 'ENT-9014', name: 'TechSolutions Courier', type: 'Delivery', idNumber: 'VAN-7718', zone: 'Loading Bay 03', timeIn: '09:30 AM', status: 'CHECKED_OUT' }
];

export const INITIAL_EMERGENCY_ALERTS = [
  {
    id: 'EMG-882190',
    dispatchId: 'EMG-882190',
    category: 'Fire Help',
    text: 'Accident and fire breakdown near Gate 02 Loading Bay. Large crowd rapidly assembling around service ramp.',
    language: 'English',
    langFlag: '🇺🇸',
    time: '09:42 AM',
    date: 'Today',
    photo: null,
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Zone 02 Service Ramp, Sector 62',
      accuracy: '3.8 meters',
      city: 'Noida Command Grid'
    },
    crowdData: {
      densityLevel: 'HIGH',
      estimatedCount: 88,
      trend: 'Gathering Rapidly (+18 in last 5m)',
      congestionStatus: 'HEAVY TRAFFIC DELAY',
      hotspots: [
        { id: 1, name: 'Core Incident Site (Gate 02)', count: 56, latOffset: 0.0001, lngOffset: 0.0001, intensity: 'CRITICAL' },
        { id: 2, name: 'Service Ramp Junction', count: 32, latOffset: -0.0003, lngOffset: -0.0002, intensity: 'MODERATE' }
      ]
    },
    status: 'ACTIVE_DISPATCH',
    assignedOfficer: 'Officer Alex Mercer',
    resolvedAt: null
  },
  {
    id: 'EMG-771204',
    dispatchId: 'EMG-771204',
    category: 'Medical Emergency',
    text: 'चिकित्सा सहायता चाहिए - Senior staff collapsed in Server Room B.',
    language: 'हिन्दी (Hindi)',
    langFlag: '🇮🇳',
    time: '08:15 AM',
    date: 'Today',
    photo: null,
    location: {
      lat: 28.5380,
      lng: 77.3942,
      address: 'Building B, Floor 2, Server Bay',
      accuracy: '2.1 meters',
      city: 'Noida Command Grid'
    },
    crowdData: {
      densityLevel: 'LOW (NORMAL)',
      estimatedCount: 4,
      trend: 'Crowd Dispersed • Traffic Restored',
      congestionStatus: 'ROAD CLEAR & FLOWING',
      hotspots: [
        { id: 1, name: 'Server Bay Hallway', count: 3, latOffset: 0.0001, lngOffset: 0.0001, intensity: 'LOW' },
        { id: 2, name: 'Elevator Lobby B', count: 1, latOffset: -0.0001, lngOffset: 0.0002, intensity: 'LOW' }
      ]
    },
    status: 'RESOLVED',
    assignedOfficer: 'Dr. Sarah Connor',
    resolvedAt: {
      date: 'Today',
      time: '08:42 AM',
      timestamp: Date.now() - 3600000
    }
  },
  {
    id: 'EMG-662301',
    dispatchId: 'EMG-662301',
    category: 'Police Help',
    text: 'Unidentified intruder detected near East Gate perimeter fence line.',
    language: 'English',
    langFlag: '🇺🇸',
    time: '07:30 AM',
    date: 'Yesterday',
    photo: null,
    location: {
      lat: 28.5320,
      lng: 77.3880,
      address: 'East Gate Perimeter Gate 04',
      accuracy: '1.8 meters',
      city: 'Noida Command Grid'
    },
    crowdData: {
      densityLevel: 'LOW (NORMAL)',
      estimatedCount: 2,
      trend: 'Area Secured',
      congestionStatus: 'ROAD CLEAR & FLOWING',
      hotspots: [
        { id: 1, name: 'Fence Checkpoint', count: 2, latOffset: 0.0001, lngOffset: 0.0001, intensity: 'LOW' }
      ]
    },
    status: 'RESOLVED',
    assignedOfficer: 'Officer Alex Mercer',
    resolvedAt: {
      date: 'Yesterday',
      time: '08:05 AM',
      timestamp: Date.now() - 86400000
    }
  }
];

export const INITIAL_HABITATIONS = [
  { 
    id: 'hab-1', 
    name: 'Kalyani Village Upper (Red Hazard Zone)', 
    district: 'Uttarkashi / Bhatwari', 
    state: 'Uttarakhand',
    pop: 1420, 
    families: 284,
    houses: 260,
    kuchaHouses: 195,
    puccaHouses: 65,
    elderly: 180, 
    infants: 110, 
    pwd: 65, 
    hazard: 'Active Landslide & Mudflow', 
    cvs: 0.88, 
    tier: 'Tier 1 (Immediate Evacuation)', 
    status: 'RED_ALERT', 
    lat: 30.7380, 
    lng: 78.4420,
    scores: {
      flood: 85,
      landslide: 94,
      seismic: 78,
      terrain: 88,
      structural: 86,
      demographic: 82,
      infrastructure: 80
    }
  },
  { 
    id: 'hab-2', 
    name: 'Raini High Settlement (Red Hazard Zone)', 
    district: 'Chamoli / Joshimath', 
    state: 'Uttarakhand',
    pop: 890, 
    families: 178,
    houses: 165,
    kuchaHouses: 120,
    puccaHouses: 45,
    elderly: 95, 
    infants: 62, 
    pwd: 38, 
    hazard: 'Glacial Outburst & Flood', 
    cvs: 0.82, 
    tier: 'Tier 1 (Immediate Evacuation)', 
    status: 'RED_ALERT', 
    lat: 30.7210, 
    lng: 78.4280,
    scores: {
      flood: 95,
      landslide: 76,
      seismic: 80,
      terrain: 82,
      structural: 80,
      demographic: 75,
      infrastructure: 74
    }
  },
  { 
    id: 'hab-3', 
    name: 'Bagori Hamlet Lower', 
    district: 'Uttarkashi / Harsil', 
    state: 'Uttarakhand',
    pop: 650, 
    families: 130,
    houses: 120,
    kuchaHouses: 70,
    puccaHouses: 50,
    elderly: 65, 
    infants: 40, 
    pwd: 27, 
    hazard: 'Flash Flood & Bank Scour', 
    cvs: 0.76, 
    tier: 'Tier 1 (High Warning)', 
    status: 'YELLOW_ALERT', 
    lat: 30.7490, 
    lng: 78.4550,
    scores: {
      flood: 80,
      landslide: 68,
      seismic: 72,
      terrain: 74,
      structural: 70,
      demographic: 66,
      infrastructure: 62
    }
  },
  { 
    id: 'hab-4', 
    name: 'Dharasu Slope Colony', 
    district: 'Uttarkashi / Dunda', 
    state: 'Uttarakhand',
    pop: 2100, 
    families: 420,
    houses: 390,
    kuchaHouses: 180,
    puccaHouses: 210,
    elderly: 210, 
    infants: 150, 
    pwd: 80, 
    hazard: 'Unstable Shear Stratum', 
    cvs: 0.64, 
    tier: 'Tier 2 (Short-Term)', 
    status: 'YELLOW_ALERT', 
    lat: 30.7100, 
    lng: 78.4100,
    scores: {
      flood: 58,
      landslide: 74,
      seismic: 68,
      terrain: 66,
      structural: 62,
      demographic: 60,
      infrastructure: 54
    }
  }
];

export const INITIAL_CANDIDATE_SITES = [
  { id: 'site-1', name: 'Site Alpha - Chinyalisaur Ridge (Green Safe Field)', type: 'Green Site (Permanent)', maxCapacity: 4500, allocatedPop: 2070, waterSupply: '135 L/Capita/Day', lat: 30.7600, lng: 78.4800, accessibility: 'Flat Terrain (Elderly/PwD Accessible)', status: 'GREEN_SAFE' },
  { id: 'site-2', name: 'Site Beta - New Tehri Sector 4 (Green Safe Field)', type: 'Green Site (Permanent)', maxCapacity: 5000, allocatedPop: 890, waterSupply: '150 L/Capita/Day', lat: 30.6800, lng: 78.4700, accessibility: 'Full Medical Facility Integrated', status: 'GREEN_SAFE' },
  { id: 'site-3', name: 'Transit Hub Yellow - Bhatwari Stadium', type: 'Yellow Hub (24-72h Transit)', maxCapacity: 2200, allocatedPop: 350, waterSupply: '100 L/Capita/Day', lat: 30.7300, lng: 78.4500, accessibility: 'Rapid Highway Transit Shelter', status: 'YELLOW_HUB' }
];

export const INITIAL_CROWD_ZONES = [
  { id: 'zone-1', name: 'Gate 02 Loading Bay & Service Ramp', lat: 28.5355, lng: 77.3910, count: 88, maxCap: 95, density: 92, level: 'RED', category: 'High Alert Crowd Surge', trend: '+18 in last 5m' },
  { id: 'zone-2', name: 'Central Sector Command Square', lat: 28.5370, lng: 77.3925, count: 145, maxCap: 160, density: 84, level: 'RED', category: 'Mass Human Gathering', trend: '+22 in last 5m' },
  { id: 'zone-3', name: 'Uttarkashi Evacuation Hub Junction', lat: 30.7380, lng: 78.4420, count: 120, maxCap: 135, density: 88, level: 'RED', category: 'Evacuation Congestion', trend: '+15 in last 5m' },
  { id: 'zone-4', name: 'Building B Server Lobby & Corridor', lat: 28.5380, lng: 77.3942, count: 35, maxCap: 75, density: 48, level: 'YELLOW', category: 'Moderate Footfall', trend: '-2 in last 5m' },
  { id: 'zone-5', name: 'Kalyani Village Upper Market', lat: 30.7210, lng: 78.4280, count: 42, maxCap: 80, density: 52, level: 'YELLOW', category: 'Gathering Warning', trend: 'Stable' },
  { id: 'zone-6', name: 'Assembly Site Alpha (Chinyalisaur)', lat: 30.7600, lng: 78.4800, count: 12, maxCap: 4500, density: 15, level: 'GREEN', category: 'Clear Safe Zone', trend: 'Dispersed' },
  { id: 'zone-7', name: 'New Tehri Sector 4 Safe Field', lat: 30.6800, lng: 78.4700, count: 15, maxCap: 5000, density: 12, level: 'GREEN', category: 'Clear Safe Area', trend: 'Normal Flow' },
  { id: 'zone-8', name: 'Sector 62 Safe Green Assembly Park', lat: 28.5330, lng: 77.3950, count: 10, maxCap: 3000, density: 8, level: 'GREEN', category: 'Designated Green Safe Zone', trend: 'Clear & Secure' }
];

export const LANGUAGES = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', quickPhrases: ['Need Medical Help', 'Fire Breakdown', 'Police Emergency', 'Accident at Location'] },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳', quickPhrases: ['चिकित्सा सहायता चाहिए', 'आग लगी है', 'पुलिस आपातकाल', 'दुर्घटना हुई है'] },
  { code: 'es-ES', name: 'Español (Spanish)', flag: '🇪🇸', quickPhrases: ['Necesito ayuda médica', 'Emergencia de incendio', 'Llamen a la policía', 'Accidente grave'] },
  { code: 'fr-FR', name: 'Français (French)', flag: '🇫🇷', quickPhrases: ["Besoin d'aide médicale", 'Urgence incendie', 'Appelez la police', 'Accident de la route'] }
];

export const VIRTUAL_KEYBOARD_LAYOUTS = {
  'en-US': [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
  ],
  'hi-IN': [
    ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
    ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ'],
    ['त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म']
  ]
};