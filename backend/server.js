const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Initial State / Mock Database
let entryLogs = [
  { id: 'ENT-9012', name: 'Marcus Vance', type: 'Contractor', idNumber: 'GOV-88192', zone: 'Server Room B', timeIn: '08:45 AM', status: 'ACTIVE' },
  { id: 'ENT-9013', name: 'Elena Rostova', type: 'Executive Staff', idNumber: 'EMP-3042', zone: 'Command Hub 01', timeIn: '09:10 AM', status: 'ACTIVE' },
  { id: 'ENT-9014', name: 'Tech Solutions Courier', type: 'Delivery', idNumber: 'VAN-7718', zone: 'Loading Bay 03', timeIn: '09:30 AM', status: 'CHECKED_OUT' }
];

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
    location: { lat: 28.5355, lng: 77.3910, address: 'Zone 02 Service Ramp, Sector 62', accuracy: '3.8 meters', city: 'Noida Command Grid' },
    crowdData: {
      densityLevel: 'HIGH',
      estimatedCount: 54,
      trend: 'Gathering Rapidly (+14 in last 5m)',
      congestionStatus: 'HEAVY TRAFFIC DELAY',
      hotspots: [
        { id: 1, name: 'Core Incident Site (Gate 02)', count: 36, latOffset: 0.0001, lngOffset: 0.0001, intensity: 'CRITICAL' },
        { id: 2, name: 'Service Ramp Junction', count: 18, latOffset: -0.0003, lngOffset: -0.0002, intensity: 'MODERATE' }
      ]
    },
    status: 'ACTIVE_DISPATCH',
    assignedOfficer: 'Officer Alex Mercer',
    resolvedAt: null
  }
];

let habitations = [
  { id: 'hab-1', name: 'Kalyani Village Upper', district: 'Uttarkashi / Bhatwari', pop: 1420, elderly: 180, infants: 110, pwd: 65, hazard: 'Active Landslide & Mudflow', cvs: 0.88, tier: 'Tier 1 (Immediate)', lat: 30.7380, lng: 78.4420 },
  { id: 'hab-2', name: 'Raini High Settlement', district: 'Chamoli / Joshimath', pop: 890, elderly: 95, infants: 62, pwd: 38, hazard: 'Glacial Outburst & Flood', cvs: 0.82, tier: 'Tier 1 (Immediate)', lat: 30.7210, lng: 78.4280 },
  { id: 'hab-3', name: 'Bagori Hamlet Lower', district: 'Uttarkashi / Harsil', pop: 650, elderly: 65, infants: 40, pwd: 27, hazard: 'Flash Flood & Bank Scour', cvs: 0.76, tier: 'Tier 1 (Immediate)', lat: 30.7490, lng: 78.4550 },
  { id: 'hab-4', name: 'Dharasu Slope Colony', district: 'Uttarkashi / Dunda', pop: 2100, elderly: 210, infants: 150, pwd: 80, hazard: 'Unstable Shear Stratum', cvs: 0.64, tier: 'Tier 2 (Short-Term)', lat: 30.7100, lng: 78.4100 }
];

let candidateSites = [
  { id: 'site-1', name: 'Site Alpha - Chinyalisaur Ridge', type: 'Green Site (Permanent)', maxCapacity: 4500, allocatedPop: 2070, waterSupply: '135 L/Capita/Day', lat: 30.7600, lng: 78.4800, accessibility: 'Flat Terrain (Elderly/ PwD Accessible)' },
  { id: 'site-2', name: 'Site Beta - New Tehri Sector 4', type: 'Green Site (Permanent)', maxCapacity: 5000, allocatedPop: 890, waterSupply: '150 L/Capita/Day', lat: 30.6800, lng: 78.4700, accessibility: 'Full Medical Facility Integrated' },
  { id: 'site-3', name: 'Transit Hub Yellow - Bhatwari Stadium', type: 'Yellow Hub (24-72h Transit)', maxCapacity: 2200, allocatedPop: 350, waterSupply: '100 L/Capita/Day', lat: 30.7300, lng: 78.4500, accessibility: 'Rapid Highway Transit Shelter' }
];

// Routes
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Entry Logs API
app.get('/api/entries', (req, res) => res.json(entryLogs));
app.post('/api/entries', (req, res) => {
  const newRecord = { ...req.body, id: 'ENT-' + Math.floor(1000 + Math.random() * 9000), timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'ACTIVE' };
  entryLogs.unshift(newRecord);
  res.status(201).json(newRecord);
});
app.patch('/api/entries/:id/checkout', (req, res) => {
  entryLogs = entryLogs.map(log => log.id === req.params.id ? { ...log, status: 'CHECKED_OUT' } : log);
  res.json({ message: 'Checked out successfully' });
});

// Emergencies API
app.get('/api/emergencies', (req, res) => res.json(emergencyAlerts));
app.post('/api/emergencies', (req, res) => {
  const newEmergency = { ...req.body, id: 'EMG-' + Math.floor(100000 + Math.random() * 900000), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: 'Today', status: 'ACTIVE_DISPATCH', resolvedAt: null };
  emergencyAlerts.unshift(newEmergency);
  res.status(201).json(newEmergency);
});
app.patch('/api/emergencies/:id/status', (req, res) => {
  const { status, assignedOfficer } = req.body;
  const isResolved = status === 'RESOLVED';
  emergencyAlerts = emergencyAlerts.map(item => {
    if (item.id === req.params.id) {
      return {
        ...item,
        status,
        assignedOfficer: assignedOfficer || item.assignedOfficer,
        resolvedAt: isResolved ? { date: 'Today', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: Date.now() } : item.resolvedAt
      };
    }
    return item;
  });
  res.json({ message: 'Emergency status updated' });
});

// Decision Support GIS Data
app.get('/api/habitations', (req, res) => res.json(habitations));
app.get('/api/sites', (req, res) => res.json(candidateSites));
app.post('/api/sites/allocate', (req, res) => {
  const { habId, siteId } = req.body;
  const hab = habitations.find(h => h.id === habId);
  const site = candidateSites.find(s => s.id === siteId);
  if (hab && site) {
    site.allocatedPop += hab.pop;
    return res.json({ success: true, allocatedPop: site.allocatedPop });
  }
  res.status(400).json({ error: 'Invalid habitation or site' });
});

app.listen(PORT, () => console.log(`RedZoneRelocate Server running on port ${PORT}`));