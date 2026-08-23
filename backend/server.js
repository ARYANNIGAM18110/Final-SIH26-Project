const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '20mb' }));

// Initial Entry Logs
let entryLogs = [
  { id: 'ENT-9012', name: 'Marcus Vance', type: 'Contractor', idNumber: 'GOV-88192', zone: 'Server Room B', timeIn: '08:45 AM', status: 'ACTIVE' },
  { id: 'ENT-9013', name: 'Elena Rostova', type: 'Executive Staff', idNumber: 'EMP-3042', zone: 'Command Hub 01', timeIn: '09:10 AM', status: 'ACTIVE' },
  { id: 'ENT-9014', name: 'TechSolutions Courier', type: 'Delivery', idNumber: 'VAN-7718', zone: 'Loading Bay 03', timeIn: '09:30 AM', status: 'CHECKED_OUT' }
];

// Initial Emergency Alerts
let emergencyAlerts = [
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

// Initial Crowd Zones
let crowdZones = [
  { id: 'zone-1', name: 'Gate 02 Loading Bay & Service Ramp', lat: 28.5355, lng: 77.3910, count: 88, maxCap: 95, density: 92, level: 'RED', category: 'High Alert Crowd Surge', trend: '+18 in last 5m' },
  { id: 'zone-2', name: 'Central Sector Command Square', lat: 28.5370, lng: 77.3925, count: 145, maxCap: 160, density: 84, level: 'RED', category: 'Mass Human Gathering', trend: '+22 in last 5m' },
  { id: 'zone-3', name: 'Uttarkashi Evacuation Hub Junction', lat: 30.7380, lng: 78.4420, count: 120, maxCap: 135, density: 88, level: 'RED', category: 'Evacuation Congestion', trend: '+15 in last 5m' },
  { id: 'zone-4', name: 'Building B Server Lobby & Corridor', lat: 28.5380, lng: 77.3942, count: 35, maxCap: 75, density: 48, level: 'YELLOW', category: 'Moderate Footfall', trend: '-2 in last 5m' },
  { id: 'zone-5', name: 'Kalyani Village Upper Market', lat: 30.7210, lng: 78.4280, count: 42, maxCap: 80, density: 52, level: 'YELLOW', category: 'Gathering Warning', trend: 'Stable' },
  { id: 'zone-6', name: 'Assembly Site Alpha (Chinyalisaur)', lat: 30.7600, lng: 78.4800, count: 12, maxCap: 4500, density: 15, level: 'GREEN', category: 'Clear Safe Zone', trend: 'Dispersed' },
  { id: 'zone-7', name: 'New Tehri Sector 4 Safe Field', lat: 30.6800, lng: 78.4700, count: 15, maxCap: 5000, density: 12, level: 'GREEN', category: 'Clear Safe Area', trend: 'Normal Flow' },
  { id: 'zone-8', name: 'Sector 62 Safe Green Assembly Park', lat: 28.5330, lng: 77.3950, count: 10, maxCap: 3000, density: 8, level: 'GREEN', category: 'Designated Green Safe Zone', trend: 'Clear & Secure' }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Identity & Emergency Dispatch API operational', timestamp: new Date() });
});

// Entry Logs Endpoints
app.get('/api/entries', (req, res) => res.json(entryLogs));

app.post('/api/entries', (req, res) => {
  const newRecord = {
    id: 'ENT-' + Math.floor(1000 + Math.random() * 9000),
    name: req.body.name,
    type: req.body.type || 'Visitor',
    idNumber: req.body.idNumber,
    zone: req.body.zone || 'Main Reception',
    timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'ACTIVE'
  };
  entryLogs.unshift(newRecord);
  res.status(201).json(newRecord);
});

app.patch('/api/entries/:id/checkout', (req, res) => {
  entryLogs = entryLogs.map(log => log.id === req.params.id ? { ...log, status: 'CHECKED_OUT' } : log);
  res.json({ success: true, message: 'Entrant successfully checked out' });
});

// Emergency Alerts Endpoints
app.get('/api/emergencies', (req, res) => res.json(emergencyAlerts));

app.post('/api/emergencies', (req, res) => {
  const generatedId = 'EMG-' + Math.floor(100000 + Math.random() * 900000);
  const newEmergency = {
    id: generatedId,
    dispatchId: generatedId,
    category: req.body.category || 'General Emergency',
    text: req.body.text || 'Emergency distress signal triggered.',
    language: req.body.language || 'English',
    langFlag: req.body.langFlag || '🇺🇸',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: 'Today',
    photo: req.body.photo || null,
    location: req.body.location || {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Command Sector Gate 01',
      accuracy: '5.0 meters',
      city: 'Noida Regional Hub'
    },
    crowdData: req.body.crowdData || {
      densityLevel: 'MODERATE',
      estimatedCount: 20,
      trend: 'First responders notified',
      congestionStatus: 'ROAD CLEAR & FLOWING'
    },
    status: 'ACTIVE_DISPATCH',
    assignedOfficer: 'Unassigned (Pending Review)',
    resolvedAt: null
  };
  emergencyAlerts.unshift(newEmergency);
  res.status(201).json(newEmergency);
});

app.patch('/api/emergencies/:id/status', (req, res) => {
  const { status, assignedOfficer } = req.body;
  const isResolved = status === 'RESOLVED';
  const resolveTimeObj = isResolved ? {
    date: 'Today',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: Date.now()
  } : null;

  emergencyAlerts = emergencyAlerts.map(item => item.id === req.params.id ? {
    ...item,
    status,
    assignedOfficer: assignedOfficer || item.assignedOfficer,
    resolvedAt: isResolved ? resolveTimeObj : item.resolvedAt
  } : item);

  res.json({ success: true, message: `Emergency ${req.params.id} updated to ${status}` });
});

// Crowd Zones Endpoint
app.get('/api/crowd-zones', (req, res) => res.json(crowdZones));

app.listen(PORT, () => {
  console.log(`✓ RedZone Backend Server running on http://localhost:${PORT}`);
});