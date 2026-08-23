import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Key, 
  Sun, 
  Moon, 
  RefreshCw, 
  PhoneCall, 
  ShieldCheck, 
  ArrowRight,
  User,
  UserPlus,
  Radio,
  Lock,
  Mic,
  Keyboard,
  Camera,
  Send,
  CheckCircle2,
  Globe,
  X,
  Eye,
  EyeOff,
  XCircle,
  LogOut,
  BarChart3,
  ClipboardList,
  Sparkles,
  MapPin,
  Navigation,
  ShieldAlert,
  Map,
  Users,
  Flame,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Home,
  History,
  Archive,
  Filter,
  Clock,
  Siren,
  Stethoscope,
  Car,
  Search,
  PlusCircle,
  DoorOpen,
  DoorClosed,
  QrCode,
  Compass,
  Building,
  Truck,
  FileCheck,
  Sliders,
  Brain,
  Zap,
  Volume2,
  VolumeX,
  Activity,
  ArrowUpRight,
  CheckSquare,
  FileText,
  AlertCircle,
  Info,
  Layers
} from 'lucide-react';

import {
  THEMES,
  VALID_USERS,
  INITIAL_ENTRY_LOGS,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_HABITATIONS,
  INITIAL_CANDIDATE_SITES,
  INITIAL_CROWD_ZONES,
  LANGUAGES,
  VIRTUAL_KEYBOARD_LAYOUTS
} from './data/constants';

export default function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('authorized_portal');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('select_role');
  const [, setSelectedRole] = useState(null);
  
  const [toastMessage, setToastMessage] = useState(null);
  const [sessionTime, setSessionTime] = useState(new Date().toLocaleTimeString());

  const [badgeIdInput, setBadgeIdInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(VALID_USERS[0]);

  const [emergencyAlerts, setEmergencyAlerts] = useState(INITIAL_EMERGENCY_ALERTS);
  const [selectedEmergencyForMap, setSelectedEmergencyForMap] = useState(null);

  const [mapLayerType, setMapLayerType] = useState('roadmap');
  const [showCrowdHeatmap, setShowCrowdHeatmap] = useState(true);
  const [mapZoomLevel, setMapZoomLevel] = useState(16);
  const [leafletReady, setLeafletReady] = useState(false);

  const [activePortalTab, setActivePortalTab] = useState('access_ops');
  const [accessSubTab, setAccessSubTab] = useState('entry_log');
  const [analyticsSubTab, setAnalyticsSubTab] = useState('ai_inspector');
  const [crowdFilter, setCrowdFilter] = useState('ALL');
  const [crowdZones, setCrowdZones] = useState(INITIAL_CROWD_ZONES);

  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('ALL');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  
  const [entryLogs, setEntryLogs] = useState(INITIAL_ENTRY_LOGS);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [gatesStatus, setGatesStatus] = useState({
    gate01: 'UNLOCKED',
    gate02: 'LOCKED',
    gate03: 'UNLOCKED'
  });

  const [newEntrantName, setNewEntrantName] = useState('');
  const [newEntrantType, setNewEntrantType] = useState('Visitor');
  const [newEntrantId, setNewEntrantId] = useState('');
  const [newEntrantZone, setNewEntrantZone] = useState('Main Reception');

  const [generatedPass, setGeneratedPass] = useState(null);
  const [passRecipientName, setPassRecipientName] = useState('');
  const [passZone, setPassZone] = useState('Level 2 Office Bay');

  const [selectedLang, setSelectedLang] = useState('en-US');
  const [emergencyCategoryInput, setEmergencyCategoryInput] = useState('Medical Emergency');
  const [isListening, setIsListening] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchId, setDispatchId] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);

  const [showConfirmHomeModal, setShowConfirmHomeModal] = useState(false);
  const [showConfirmSignOutModal, setShowConfirmSignOutModal] = useState(false);

  // Decision Support System Analytics State
  const [habitations, setHabitations] = useState(INITIAL_HABITATIONS);
  const [candidateSites, setCandidateSites] = useState(INITIAL_CANDIDATE_SITES);
  const [selectedHabId, setSelectedHabId] = useState('hab-1');
  const [selectedSiteId, setSelectedSiteId] = useState('site-1');
  const [gisTileStyle, setGisTileStyle] = useState('satellite');

  // Tactical SOS & Audio Siren State
  const [selectedSosTargetZone, setSelectedSosTargetZone] = useState('zone-1');
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [activeSirenMessage, setActiveSirenMessage] = useState('');

  const [tacticalSosQueue, setTacticalSosQueue] = useState([
    { id: 'sos-1', type: 'Critical Medical Evacuation', target: 'Gate 02 Service Ramp', time: '2 mins ago', status: 'NDRF Unit Dispatched', eta: '6 Mins' },
    { id: 'sos-2', type: 'High Density Surge Alert', target: 'Central Sector Command Square', time: '7 mins ago', status: 'En-Route', eta: '11 Mins' }
  ]);

  // AI Inspector State
  const [selectedInspectorHabId, setSelectedInspectorHabId] = useState('hab-1');
  const [aiInspectLoading, setAiInspectLoading] = useState(false);
  const [aiInspectResult, setAiInspectResult] = useState(null);
  const [simShockValue, setSimShockValue] = useState(40);

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '10:42 AM', user: 'Officer Alex Mercer', action: 'Approved Tier 1 Relocation match for Kalyani Village to Chinyalisaur Ridge.' },
    { id: 2, time: '09:15 AM', user: 'Dr. Sarah Connor', action: 'Dispatched Tactical Rescue Unit to Server Room B.' }
  ]);

  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const leafletMapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapMarkersGroupRef = useRef(null);
  const analyticsMapRef = useRef(null);
  const analyticsMapInstanceRef = useRef(null);
  const successMapRef = useRef(null);
  const successMapInstanceRef = useRef(null);

  const currentTheme = THEMES[theme];

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.L) {
      setLeafletReady(true);
      return;
    }

    const leafletCss = document.createElement('link');
    leafletCss.rel = 'stylesheet';
    leafletCss.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(leafletCss);

    const leafletJs = document.createElement('script');
    leafletJs.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJs.onload = () => {
      setLeafletReady(true);
    };
    document.head.appendChild(leafletJs);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: `${position.coords.accuracy.toFixed(1)} meters`,
            address: 'GPS Live Coordinates Acquired',
            city: 'Noida Metro Region'
          });
        },
        () => {
          setCurrentLocation({
            lat: 28.5355,
            lng: 77.3910,
            accuracy: '4.5 meters (GPS)',
            address: 'Command Sector 62, Gate 01 Tower',
            city: 'Noida Regional Hub'
          });
        }
      );
    }
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setEmergencyText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedEmergencyForMap || !leafletReady || !mapContainerRef.current) return;

    const L = window.L;
    const { lat, lng } = selectedEmergencyForMap.location;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const tileUrls = {
      roadmap: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
    };

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: mapZoomLevel,
      zoomControl: false,
      attributionControl: false
    });

    leafletMapRef.current = map;

    L.tileLayer(tileUrls[mapLayerType] || tileUrls.roadmap, {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);

    const markersGroup = L.layerGroup().addTo(map);
    mapMarkersGroupRef.current = markersGroup;

    if (showCrowdHeatmap && crowdZones && crowdZones.length > 0) {
      crowdZones.forEach((zone) => {
        let color = '#10b981'; 
        if (zone.level === 'RED') color = '#ef4444'; 
        if (zone.level === 'YELLOW') color = '#f59e0b'; 

        const radiusMeters = zone.level === 'RED' ? 400 : (zone.level === 'YELLOW' ? 250 : 150);

        L.circle([zone.lat, zone.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.3,
          weight: 2,
          radius: radiusMeters
        }).addTo(markersGroup);

        const zonePinHtml = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            ${zone.level === 'RED' ? '<div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: rgba(239, 68, 68, 0.5); animation: ping 1.5s infinite;"></div>' : ''}
            <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; color: white; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); font-weight: bold; font-size: 11px;">
              ${zone.level === 'RED' ? '🚨' : (zone.level === 'YELLOW' ? '⚠️' : '✓')}
            </div>
          </div>
        `;
        const customZoneIcon = L.divIcon({ html: zonePinHtml, className: 'emg-crowd-zone-pin', iconSize: [24, 24], iconAnchor: [12, 12] });
        const zoneMarker = L.marker([zone.lat, zone.lng], { icon: customZoneIcon }).addTo(markersGroup);
        zoneMarker.bindPopup(`
          <div style="font-family: system-ui; font-size: 11px; padding: 2px; min-width: 150px;">
            <strong style="color: ${color}; font-size: 12px;">${zone.name} (${zone.level} ZONE)</strong><br/>
            <div style="margin-top: 4px; padding: 4px; background: rgba(0,0,0,0.05); border-radius: 6px;">
              <b>Tracked Humans:</b> ${zone.count} / ${zone.maxCap}<br/>
              <b>Density:</b> ${zone.density}% (${zone.level} ALERT)<br/>
              <b>Trend:</b> ${zone.trend}
            </div>
          </div>
        `);
      });
    }

    const nearbyFacilities = [
      { name: 'District Multi-Specialty Hospital ER', type: 'Emergency Hospital', icon: '🏥', color: '#2563eb', lat: lat + 0.0035, lng: lng + 0.0028, contact: '102', distance: '420m away' },
      { name: 'Sector Fire & Rescue Station 04', type: 'Fire Station', icon: '🚒', color: '#ea580c', lat: lat - 0.0028, lng: lng + 0.0032, contact: '101', distance: '580m away' },
      { name: 'Central Police Patrol & Rapid Hub', type: 'Police Station', icon: '🚔', color: '#4f46e5', lat: lat + 0.0018, lng: lng - 0.0035, contact: '112', distance: '310m away' }
    ];

    nearbyFacilities.forEach((fac) => {
      const facPinHtml = `
        <div style="width: 26px; height: 26px; border-radius: 8px; background: ${fac.color}; color: white; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 13px;">
          ${fac.icon}
        </div>
      `;
      const facIcon = L.divIcon({ html: facPinHtml, className: 'fac-map-pin', iconSize: [26, 26], iconAnchor: [13, 13] });
      const facMarker = L.marker([fac.lat, fac.lng], { icon: facIcon }).addTo(markersGroup);
      facMarker.bindPopup(`
        <div style="font-family: system-ui; font-size: 11px; padding: 2px; min-width: 170px;">
          <strong style="color: ${fac.color}; font-size: 12px;">${fac.icon} ${fac.name}</strong><br/>
          <div style="margin-top: 4px; padding: 5px; background: rgba(0,0,0,0.05); border-radius: 6px;">
            <b>Facility:</b> ${fac.type}<br/>
            <b>Proximity:</b> ${fac.distance}<br/>
            <b>Contact:</b> ${fac.contact}
          </div>
        </div>
      `);
    });

    const isResolved = selectedEmergencyForMap.status === 'RESOLVED';

    const pinHtml = isResolved ? `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="width: 38px; height: 38px; border-radius: 50%; background: #10b981; color: white; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(16, 185, 129, 0.5); font-weight: bold; font-size: 18px;">
          ✓
        </div>
      </div>
    ` : `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220, 38, 38, 0.4); animation: ping 1.5s infinite;"></div>
        <div style="width: 34px; height: 34px; border-radius: 50%; background: #dc2626; color: white; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); font-weight: bold;">
          📍
        </div>
      </div>
    `;

    const customIcon = L.divIcon({ html: pinHtml, className: 'custom-map-pin', iconSize: [38, 38], iconAnchor: [19, 19] });
    const incidentMarker = L.marker([lat, lng], { icon: customIcon }).addTo(markersGroup);
    incidentMarker.bindPopup(`
      <div style="font-family: system-ui; font-size: 12px; padding: 4px;">
        <strong style="color: ${isResolved ? '#059669' : '#dc2626'};">${isResolved ? '✅ Issue Resolved - Road Clear' : '🚨 Emergency Incident Core'}</strong><br/>
        <b>Category:</b> ${selectedEmergencyForMap.category || 'General'}<br/>
        <b>Address:</b> ${selectedEmergencyForMap.location.address}<br/>
        <b>Road Condition:</b> ${isResolved ? 'Road Clear & Flowing' : `Est. Crowd: ~${selectedEmergencyForMap.crowdData?.estimatedCount || 40} People`}
      </div>
    `).openPopup();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [selectedEmergencyForMap, leafletReady, mapLayerType, showCrowdHeatmap, mapZoomLevel, crowdZones]);

  useEffect(() => {
    if (activePortalTab !== 'system_analytics' || analyticsSubTab !== 'gis_map' || !leafletReady || !analyticsMapRef.current) return;

    const L = window.L;
    if (analyticsMapInstanceRef.current) {
      analyticsMapInstanceRef.current.remove();
      analyticsMapInstanceRef.current = null;
    }

    const tileUrls = {
      satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    };

    const map = L.map(analyticsMapRef.current, {
      center: [28.5355, 77.3910],
      zoom: 14,
      zoomControl: true,
      attributionControl: false
    });

    analyticsMapInstanceRef.current = map;

    L.tileLayer(tileUrls[gisTileStyle] || tileUrls.satellite, { maxZoom: 19 }).addTo(map);

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);

    const filteredZones = crowdZones.filter(z => crowdFilter === 'ALL' || z.level === crowdFilter);

    filteredZones.forEach((zone) => {
      let color = '#10b981'; 
      if (zone.level === 'RED') color = '#ef4444'; 
      if (zone.level === 'YELLOW') color = '#f59e0b'; 

      const radiusMeters = zone.level === 'RED' ? 450 : (zone.level === 'YELLOW' ? 280 : 150);

      L.circle([zone.lat, zone.lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.35,
        weight: 2,
        radius: radiusMeters
      }).addTo(map);

      const pinHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          ${zone.level === 'RED' ? '<div style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(239, 68, 68, 0.5); animation: ping 1.5s infinite;"></div>' : ''}
          <div style="width: 24px; height: 24px; border-radius: 50%; background: ${color}; color: white; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.6); font-weight: bold; font-size: 11px;">
            ${zone.level === 'RED' ? '🚨' : (zone.level === 'YELLOW' ? '⚠️' : '✓')}
          </div>
        </div>
      `;
      const customIcon = L.divIcon({ html: pinHtml, className: 'crowd-gis-pin', iconSize: [24, 24], iconAnchor: [12, 12] });

      const marker = L.marker([zone.lat, zone.lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; padding: 2px; min-width: 180px;">
          <strong style="color: ${color}; font-size: 13px;">${zone.name}</strong><br/>
          <div style="margin-top: 4px; padding: 6px; background: rgba(0,0,0,0.05); border-radius: 8px; font-size: 11px;">
            <b>Tracked Humans:</b> ${zone.count} / ${zone.maxCap}<br/>
            <b>Density:</b> ${zone.density}% (${zone.level} ALERT)<br/>
            <b>Trend:</b> ${zone.trend}
          </div>
        </div>
      `);
    });

    return () => {
      if (analyticsMapInstanceRef.current) {
        analyticsMapInstanceRef.current.remove();
        analyticsMapInstanceRef.current = null;
      }
    };
  }, [activePortalTab, analyticsSubTab, leafletReady, gisTileStyle, crowdZones, crowdFilter]);

  useEffect(() => {
    if (view !== 'emergency_success' || !leafletReady || !successMapRef.current) return;

    const L = window.L;
    if (successMapInstanceRef.current) {
      successMapInstanceRef.current.remove();
      successMapInstanceRef.current = null;
    }

    const userLat = currentLocation?.lat || 28.5355;
    const userLng = currentLocation?.lng || 77.3910;

    const map = L.map(successMapRef.current, {
      center: [userLat, userLng],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    successMapInstanceRef.current = map;

    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);

    const userPinHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(220, 38, 38, 0.4); animation: ping 1.5s infinite;"></div>
        <div style="width: 36px; height: 36px; border-radius: 50%; background: #dc2626; color: white; display: flex; align-items: center; justify-content: center; border: 2.5px solid white; box-shadow: 0 4px 14px rgba(220,38,38,0.6); font-weight: bold; font-size: 16px;">
          📍
        </div>
      </div>
    `;
    const userIcon = L.divIcon({ html: userPinHtml, className: 'user-success-pin', iconSize: [36, 36], iconAnchor: [18, 18] });
    const userMarker = L.marker([userLat, userLng], { icon: userIcon }).addTo(map);
    userMarker.bindPopup(`
      <div style="font-family: system-ui; font-size: 12px; padding: 2px;">
        <strong style="color: #dc2626;">📍 YOUR LIVE LOCATION</strong><br/>
        <b>Address:</b> ${currentLocation?.address || 'Command Sector Gate 01'}<br/>
        <b>City:</b> ${currentLocation?.city || 'Noida Regional Hub'}<br/>
        <span style="color: #059669; font-weight: bold;">✓ GPS Signal Active & Dispatched</span>
      </div>
    `).openPopup();

    const nearbyFacilities = [
      { name: 'District Hospital ER', type: 'Emergency Hospital', icon: '🏥', color: '#2563eb', lat: userLat + 0.0035, lng: userLng + 0.0028, contact: '102', distance: '420m away' },
      { name: 'Sector Fire Station 04', type: 'Fire Station', icon: '🚒', color: '#ea580c', lat: userLat - 0.0028, lng: userLng + 0.0032, contact: '101', distance: '580m away' },
      { name: 'Central Police Hub', type: 'Police Station', icon: '🚔', color: '#4f46e5', lat: userLat + 0.0018, lng: userLng - 0.0035, contact: '112', distance: '310m away' }
    ];

    nearbyFacilities.forEach((fac) => {
      const facPinHtml = `
        <div style="width: 28px; height: 28px; border-radius: 8px; background: ${fac.color}; color: white; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4); font-size: 14px;">
          ${fac.icon}
        </div>
      `;
      const facIcon = L.divIcon({ html: facPinHtml, className: 'fac-success-pin', iconSize: [28, 28], iconAnchor: [14, 14] });
      const facMarker = L.marker([fac.lat, fac.lng], { icon: facIcon }).addTo(map);
      facMarker.bindPopup(`
        <div style="font-family: system-ui; font-size: 11px; padding: 2px; min-width: 160px;">
          <strong style="color: ${fac.color}; font-size: 12px;">${fac.icon} ${fac.name}</strong><br/>
          <b>Type:</b> ${fac.type}<br/>
          <b>Distance:</b> ${fac.distance}<br/>
          <b>Helpline:</b> ${fac.contact}
        </div>
      `);
    });

    return () => {
      if (successMapInstanceRef.current) {
        successMapInstanceRef.current.remove();
        successMapInstanceRef.current = null;
      }
    };
  }, [view, leafletReady, currentLocation]);

  const triggerAudioSirenAndVoiceAlert = (zoneName) => {
    setIsSirenActive(true);
    const alertMessage = `EMERGENCY SOS ALERT ACTIVATED! ALL FIRST RESPONDERS DISPATCHED TO RED HAZARD ZONE: ${zoneName}! EVACUATE IMMEDIATE AREA NOW!`;
    setActiveSirenMessage(alertMessage);

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);

        for (let i = 0; i < 3; i++) {
          osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.4 + i * 0.8);
          osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.8 + i * 0.8);
        }

        gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.5);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
      }
    } catch (e) {
      console.warn("Web Audio Context initialized with browser restriction.");
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(alertMessage);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      utterance.onend = () => setIsSirenActive(false);
      utterance.onerror = () => setIsSirenActive(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSirenActive(false), 3000);
    }
  };

  const stopAudioSirenAndVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSirenActive(false);
    setActiveSirenMessage('');
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    if (role === 'authorized') {
      setModalStep('authorized_login');
      setAuthError('');
      setIsModalOpen(true);
    } else if (role === 'emergency') {
      setIsModalOpen(false);
      setView('emergency_form');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!badgeIdInput.trim() || !pinInput.trim()) {
      setAuthError('Please enter both Badge ID / Username and Access PIN.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const match = VALID_USERS.find(
        (u) => u.badgeId.toLowerCase() === badgeIdInput.trim().toLowerCase() && u.pin === pinInput.trim()
      );

      if (match) {
        setLoggedInUser(match);
        setIsVerifying(false);
        setIsModalOpen(false);
        setView('authorized_portal');
        setToastMessage({
          text: `✓ Verification Successful! Welcome ${match.name}.`,
          type: 'auth'
        });
        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setIsVerifying(false);
        setAuthError('INVALID CREDENTIALS! Badge ID or Access PIN incorrect.');
      }
    }, 800);
  };

  const handleQuickDemoFill = () => {
    setBadgeIdInput('AUTH-8821');
    setPinInput('7749');
    setAuthError('');
  };

  const handleLogOutClick = () => {
    setShowConfirmSignOutModal(true);
  };

  const confirmLogOut = () => {
    setShowConfirmSignOutModal(false);
    setLoggedInUser(null);
    setBadgeIdInput('');
    setPinInput('');
    setAuthError('');
    setView('home');
    setModalStep('select_role');
    setIsModalOpen(true);
  };

  const handleDispatchCrowdControl = (zone) => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: loggedInUser?.name || 'Authorized Officer',
      action: `Dispatched Crowd Dispersion & Public Alert for ${zone.name} (${zone.count} humans gathered).`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerAudioSirenAndVoiceAlert(zone.name);

    setToastMessage({ text: `🚨 Dispersion Unit & Voice Alert Sent to ${zone.name}!`, type: 'auth' });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const updateEmergencyStatus = (alertId, newStatus) => {
    const isResolved = newStatus === 'RESOLVED';
    const resolveTimeObj = isResolved ? {
      date: 'Today',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: Date.now()
    } : null;

    setEmergencyAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId
          ? {
              ...item,
              status: newStatus,
              resolvedAt: isResolved ? resolveTimeObj : item.resolvedAt,
              assignedOfficer: loggedInUser?.name || 'Officer Alex Mercer'
            }
          : item
      )
    );

    if (selectedEmergencyForMap && selectedEmergencyForMap.id === alertId) {
      setSelectedEmergencyForMap((prev) => ({
        ...prev,
        status: newStatus,
        resolvedAt: isResolved ? resolveTimeObj : prev.resolvedAt,
        assignedOfficer: loggedInUser?.name || 'Officer Alex Mercer'
      }));
    }

    setToastMessage({
      text: isResolved
        ? `✓ Emergency ${alertId} resolved & archived in History Panel!`
        : `✓ Emergency ${alertId} status updated to: ${newStatus}`,
      type: 'auth'
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConfirmEvacuationShift = () => {
    const hab = habitations.find((h) => h.id === selectedHabId);
    const site = candidateSites.find((s) => s.id === selectedSiteId);

    if (hab && site) {
      const populationToMove = hab.pop;

      setCandidateSites((prev) =>
        prev.map((s) => (s.id === site.id ? { ...s, allocatedPop: s.allocatedPop + populationToMove } : s))
      );

      setHabitations((prev) =>
        prev.map((h) =>
          h.id === hab.id
            ? {
                ...h,
                pop: 0,
                status: 'EVACUATED',
                tier: 'Tier 3 (Safely Evacuated)',
                cvs: 0.12,
                name: `${h.name.replace(' (Red Hazard Zone)', '')} [EVACUATED TO SAFE ZONE]`
              }
            : h
        )
      );

      setCrowdZones((prev) =>
        prev.map((zone) =>
          zone.level === 'RED'
            ? {
                ...zone,
                count: Math.max(8, zone.count - 45),
                density: Math.max(12, zone.density - 50),
                level: zone.density - 50 < 40 ? 'GREEN' : 'YELLOW',
                trend: 'Crowd Evacuated to Safe Sector'
              }
            : zone
        )
      );

      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: loggedInUser?.name || 'Authorized Officer',
        action: `SUCCESSFUL EVACUATION SHIFT: Transferred ${populationToMove} citizens from ${hab.name} to ${site.name}.`
      };

      setAuditLogs((prev) => [newLog, ...prev]);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const confirmationSpeech = new SpeechSynthesisUtterance(
          `Evacuation confirmed! ${populationToMove} citizens safely transferred from hazard zone to ${site.name}.`
        );
        window.speechSynthesis.speak(confirmationSpeech);
      }

      setToastMessage({ text: `✓ EMERGENCY EVACUATION EXECUTED! ${populationToMove} Residents Shifted to ${site.name}`, type: 'auth' });
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleTriggerTacticalSos = (typeText) => {
    const targetZone = crowdZones.find(z => z.id === selectedSosTargetZone) || crowdZones[0];

    const newEvt = {
      id: 'sos-' + Date.now(),
      type: typeText,
      target: targetZone.name,
      time: 'Just now',
      status: 'NDRF Unit Dispatched',
      eta: `${Math.floor(Math.random() * 6 + 2)} Mins`
    };

    setTacticalSosQueue((prev) => [newEvt, ...prev]);

    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: loggedInUser?.name || 'Authorized Officer',
      action: `Triggered 1-Tap SOS Alarm: ${typeText} at ${targetZone.name}. Loud audio broadcast initiated.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    triggerAudioSirenAndVoiceAlert(targetZone.name);

    setToastMessage({ text: `🔊 LOUD EMERGENCY SOS BROADCAST SENT TO ${targetZone.name}!`, type: 'auth' });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateCheckIn = (e) => {
    e.preventDefault();
    if (!newEntrantName.trim() || !newEntrantId.trim()) return;

    const newRecord = {
      id: 'ENT-' + Math.floor(1000 + Math.random() * 9000),
      name: newEntrantName.trim(),
      type: newEntrantType,
      idNumber: newEntrantId.trim(),
      zone: newEntrantZone,
      timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'ACTIVE'
    };

    setEntryLogs([newRecord, ...entryLogs]);
    setNewEntrantName('');
    setNewEntrantId('');
    setAccessSubTab('entry_log');

    setToastMessage({
      text: `✓ Authorized Entry Granted for ${newRecord.name} (${newRecord.id})`,
      type: 'auth'
    });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckOutEntrant = (id) => {
    setEntryLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, status: 'CHECKED_OUT' } : log))
    );
    setToastMessage({
      text: `✓ Entrant ${id} successfully checked out.`,
      type: 'auth'
    });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleGateStatus = (gateKey) => {
    setGatesStatus((prev) => ({
      ...prev,
      [gateKey]: prev[gateKey] === 'UNLOCKED' ? 'LOCKED' : 'UNLOCKED'
    }));
  };

  const handleGeneratePass = (e) => {
    e.preventDefault();
    if (!passRecipientName.trim()) return;

    const pass = {
      passCode: 'PASS-' + Math.floor(100000 + Math.random() * 900000),
      name: passRecipientName.trim(),
      zone: passZone,
      issuedAt: new Date().toLocaleTimeString(),
      validUntil: 'Today, 23:59 PM',
      issuer: loggedInUser?.name || 'Officer Alex Mercer'
    };

    setGeneratedPass(pass);
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = selectedLang;
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          simulateVoiceInput();
        }
      } else {
        simulateVoiceInput();
      }
    }
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    const langObj = LANGUAGES.find((l) => l.code === selectedLang);
    const phrase = langObj ? langObj.quickPhrases[0] : 'Emergency help required at my current location!';
    
    setTimeout(() => {
      setEmergencyText((prev) => (prev ? `${prev} ${phrase}` : phrase));
      setIsListening(false);
    }, 2200);
  };

  const handleKeyPress = (char) => setEmergencyText((prev) => prev + char);
  const handleBackspace = () => setEmergencyText((prev) => prev.slice(0, -1));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setAttachedPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setAttachedPhoto(null);
    setPhotoName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submitEmergencyForm = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const generatedId = 'EMG-' + Math.floor(100000 + Math.random() * 900000);
    setDispatchId(generatedId);

    const langName = LANGUAGES.find((l) => l.code === selectedLang)?.name || 'English';
    const langFlag = LANGUAGES.find((l) => l.code === selectedLang)?.flag || '🇺🇸';

    const newEmergencyRecord = {
      id: generatedId,
      dispatchId: generatedId,
      category: emergencyCategoryInput,
      text: emergencyText || 'Emergency distress signal triggered without text notes.',
      language: langName,
      langFlag: langFlag,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      photo: attachedPhoto,
      location: currentLocation || {
        lat: 28.5355,
        lng: 77.3910,
        address: 'Command Sector Gate 01',
        accuracy: '5.0 meters',
        city: 'Noida Regional Hub'
      },
      status: 'ACTIVE_DISPATCH',
      assignedOfficer: 'Unassigned (Pending Review)',
      resolvedAt: null
    };

    setEmergencyAlerts((prev) => [newEmergencyRecord, ...prev]);

    setTimeout(() => {
      setIsSubmitting(false);
      setView('emergency_success');
    }, 1200);
  };

  const handleRunAiInspection = () => {
    setAiInspectLoading(true);
    setAiInspectResult(null);

    setTimeout(() => {
      const hab = habitations.find((h) => h.id === selectedInspectorHabId) || habitations[0];
      const s = hab.scores || {
        flood: 85,
        landslide: 92,
        seismic: 78,
        terrain: 88,
        structural: 84,
        demographic: 82,
        infrastructure: 80
      };

      // 1. Calculate Hazard Exposure = Average of (Flood, Landslide, Seismic, Terrain)
      const hazardExposure = (s.flood + s.landslide + s.seismic + s.terrain) / 4;
      
      // 2. Structural Risk = Average of (Structural Vulnerability, Infrastructure Vulnerability)
      const structuralRisk = (s.structural + s.infrastructure) / 2;
      
      // 3. Demographic Risk = Demographic Vulnerability Score
      const demographicRisk = s.demographic;

      // 4. Formula: CVS = (0.40 * Hazard Exposure) + (0.35 * Structural Risk) + (0.25 * Demographic Vulnerability)
      const rawCvs = (0.40 * hazardExposure) + (0.35 * structuralRisk) + (0.25 * demographicRisk);
      const normalizedCvs = parseFloat((rawCvs / 100).toFixed(2));

      let classification = "TIER 1 — IMMEDIATE RELOCATION";
      let priority = "CRITICAL";
      let recAction = "Immediate evacuation assessment and priority relocation-site allocation.";
      let reasoning = `High flood and landslide exposure (${hazardExposure.toFixed(1)}/100) combined with unstable steep terrain and a high proportion of kucha/unreinforced masonry structures (${structuralRisk.toFixed(1)}/100) has resulted in a critical vulnerability score. The habitation should be prioritized for immediate evacuation planning.`;

      if (normalizedCvs < 0.50) {
        classification = "TIER 3 — MEDIUM-TERM MONITORING";
        priority = "MODERATE";
        recAction = "Routine geological monitoring, structural reinforcement, and seasonal shelter readiness.";
        reasoning = `Moderate hazard exposure (${hazardExposure.toFixed(1)}/100) and relatively stable slope conditions in ${hab.name} resulted in a low-risk vulnerability score of ${normalizedCvs.toFixed(2)}. Relocation is not immediately urgent; ongoing seasonal monitoring is recommended.`;
      } else if (normalizedCvs < 0.75) {
        classification = "TIER 2 — SHORT-TERM RELOCATION";
        priority = "HIGH";
        recAction = "Planned short-term transition shelter assignment and slope stabilization monitoring.";
        reasoning = `Elevated landslide/slope hazard exposure (${hazardExposure.toFixed(1)}/100) and degraded infrastructure in ${hab.name} yielded a Composite Vulnerability Score of ${normalizedCvs.toFixed(2)}. Short-term phased relocation is advised before peak monsoon intensity.`;
      }

      setAiInspectResult({
        habitation: hab,
        scores: s,
        hazardExposure: parseFloat(hazardExposure.toFixed(1)),
        structuralRisk: parseFloat(structuralRisk.toFixed(1)),
        demographicRisk: parseFloat(demographicRisk.toFixed(1)),
        cvs: normalizedCvs,
        classification,
        priority,
        recommendedAction: recAction,
        reasoning,
        confidence: "95.8% Confidence • Multi-Spectral SAR Satellite + Local Survey Data",
        actions: [
          "Immediate evacuation assessment & high-priority site allocation",
          "Allocate temporary shelter in transit Green Hubs",
          "Match habitation with nearest safe Green Field (e.g. Chinyalisaur Ridge)",
          "Conduct emergency structural inspection on unreinforced load-bearing walls",
          "Deploy satellite SAR sensors for continuous slope deformation monitoring"
        ]
      });
      setAiInspectLoading(false);
    }, 1200);
  };

  const handleRequestGoHome = () => {
    if (view === 'home') {
      goHome();
    } else {
      setShowConfirmHomeModal(true);
    }
  };

  const confirmGoHome = () => {
    setShowConfirmHomeModal(false);
    goHome();
  };

  const goHome = () => {
    setView('home');
    setSelectedRole(null);
    setModalStep('select_role');
    setIsModalOpen(true);
    setEmergencyText('');
    setAttachedPhoto(null);
    setPhotoName('');
  };

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const filteredLogs = entryLogs.filter(
    (log) =>
      log.name.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.idNumber.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.zone.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(logSearchQuery.toLowerCase())
  );

  const activeEmergencies = emergencyAlerts.filter((e) => e.status !== 'RESOLVED');
  const activeEmergenciesCount = activeEmergencies.length;
  const resolvedEmergencies = emergencyAlerts.filter((e) => e.status === 'RESOLVED');

  const filteredHistory = resolvedEmergencies.filter((item) => {
    const matchesCategory = historyCategoryFilter === 'ALL' || item.category === historyCategoryFilter;
    const matchesSearch = 
      item.dispatchId.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      item.location.address.toLowerCase().includes(historySearchQuery.toLowerCase()) ||
      (item.assignedOfficer && item.assignedOfficer.toLowerCase().includes(historySearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeIcon = (category) => {
    switch (category) {
      case 'Medical Emergency':
        return <Stethoscope className="w-3.5 h-3.5 text-blue-500" />;
      case 'Fire Help':
        return <Flame className="w-3.5 h-3.5 text-amber-500" />;
      case 'Police Help':
        return <Siren className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Accident':
        return <Car className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-purple-500" />;
    }
  };

  const shockMultiplier = 1 + simShockValue / 100;
  const displacedFamilies = Math.round(500 * shockMultiplier);
  const landCost = (displacedFamilies * 0.015).toFixed(2);
  const housingCost = (displacedFamilies * 0.025).toFixed(2);
  const utilCost = (displacedFamilies * 0.009).toFixed(2);
  const totalBudget = (parseFloat(landCost) + parseFloat(housingCost) + parseFloat(utilCost)).toFixed(2);

  const selectedHab = habitations.find((h) => h.id === selectedHabId) || habitations[0];
  const selectedSite = candidateSites.find((s) => s.id === selectedSiteId) || candidateSites[0];
  const remainingCap = selectedSite ? selectedSite.maxCapacity - selectedSite.allocatedPop : 0;
  const isAllocationFeasible = selectedHab && selectedHab.pop > 0 && remainingCap >= selectedHab.pop;
  const requiredBuses = selectedHab ? Math.ceil(selectedHab.pop / 40) : 0;

  const currentInspectorHab = habitations.find((h) => h.id === selectedInspectorHabId) || habitations[0];

  return (
    <div 
      className="min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans relative overflow-x-hidden"
      style={{ 
        backgroundColor: currentTheme.bgPage, 
        color: currentTheme.textPrimary 
      }}
    >
      {/* Header */}
      <header 
        className="w-full px-4 sm:px-6 py-3.5 flex justify-between items-center border-b backdrop-blur-md sticky top-0 z-30 transition-colors"
        style={{ borderColor: currentTheme.border }}
      >
        <div className="flex items-center space-x-3 cursor-pointer" onClick={handleRequestGoHome}>
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm shrink-0"
            style={{ backgroundColor: currentTheme.btnAuth, color: currentTheme.textPrimary }}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight leading-tight" style={{ color: currentTheme.textPrimary }}>
              Identity & Authorized Entry System
            </h1>
            <p className="text-[11px] sm:text-xs font-medium" style={{ color: currentTheme.textMuted }}>
              Rapid Access Control & GIS Crowd Radar Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm border hover:opacity-90 active:scale-95"
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
            onClick={handleRequestGoHome}
            className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm border hover:opacity-90 active:scale-95"
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center items-center text-center my-auto">
        
        {toastMessage && (
          <div className="fixed top-16 sm:top-20 z-50 px-5 py-2.5 rounded-2xl text-xs font-black shadow-2xl transition-all bg-emerald-600 text-white border border-emerald-400">
            {toastMessage.text}
          </div>
        )}

        {/* ACTIVE SIREN BROADCASTING BANNER */}
        {isSirenActive && (
          <div className="fixed top-16 sm:top-20 z-50 w-[92%] max-w-3xl p-3.5 rounded-2xl bg-red-600 text-white shadow-2xl border-2 border-red-300 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3 overflow-hidden text-left">
              <Volume2 className="w-6 h-6 shrink-0 animate-bounce" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider">LOUD EMERGENCY SIREN BROADCAST ACTIVE</p>
                <p className="text-[11px] font-semibold truncate">{activeSirenMessage}</p>
              </div>
            </div>

            <button
              onClick={stopAudioSirenAndVoice}
              className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow hover:bg-stone-100 shrink-0 ml-2 flex items-center space-x-1"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>MUTE ALARM</span>
            </button>
          </div>
        )}

        {/* VIEW 1: HOME LANDING */}
        {view === 'home' && (
          <div 
            className="border rounded-3xl p-6 sm:p-10 shadow-xl max-w-lg w-full transition-all"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border,
              boxShadow: `0 20px 40px ${currentTheme.cardShadow}`
            }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner"
              style={{ backgroundColor: currentTheme.btnAuth }}
            >
              <User className="w-8 h-8" style={{ color: currentTheme.textPrimary }} />
            </div>
            <h2 className="text-2xl font-extrabold mb-2" style={{ color: currentTheme.textPrimary }}>
              Identity Pending Selection
            </h2>
            <p className="text-xs sm:text-sm mb-6 leading-relaxed" style={{ color: currentTheme.textMuted }}>
              Please select your role to access the Authorized Entry Portal with Badge ID authentication or trigger emergency dispatch protocols.
            </p>
            <button
              onClick={() => {
                setModalStep('select_role');
                setIsModalOpen(true);
              }}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md hover:brightness-95 transition-all active:scale-95 flex items-center justify-center space-x-2"
              style={{ 
                backgroundColor: currentTheme.btnAuth,
                color: currentTheme.textPrimary
              }}
            >
              <span>Open Role Selection Prompt</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* VIEW 2: AUTHORIZED PORTAL */}
        {view === 'authorized_portal' && (
          <div 
            className="border rounded-3xl p-4 sm:p-8 shadow-xl max-w-5xl w-full transition-all text-left"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border,
              boxShadow: `0 20px 40px ${currentTheme.cardShadow}`
            }}
          >
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 mb-5 border-b gap-3" style={{ borderColor: currentTheme.border }}>
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xl border border-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-block px-2.5 py-0.5 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] sm:text-[11px] font-extrabold rounded-md">
                      AUTHORIZED ENTRY PORTAL
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">
                      {loggedInUser?.badgeId || 'AUTH-8821'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: currentTheme.textPrimary }}>
                    {loggedInUser?.name || 'Officer Alex Mercer'}
                  </h2>
                  <p className="text-[11px] sm:text-xs font-medium" style={{ color: currentTheme.textMuted }}>
                    {loggedInUser?.role || 'Security Ops Lead'} • {loggedInUser?.clearance || 'Level 4 Command'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <div className="text-right hidden sm:block mr-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>Clock</p>
                  <p className="text-xs font-mono font-bold" style={{ color: currentTheme.textPrimary }}>{sessionTime}</p>
                </div>
                <button
                  onClick={handleLogOutClick}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center space-x-2 transition-all hover:bg-red-500/10 hover:text-red-600"
                  style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-6 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border scrollbar-none" style={{ borderColor: currentTheme.border }}>
              <button
                onClick={() => setActivePortalTab('access_ops')}
                className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 whitespace-nowrap ${
                  activePortalTab === 'access_ops' ? 'shadow-md border' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: activePortalTab === 'access_ops' ? currentTheme.btnAuth : 'transparent',
                  borderColor: activePortalTab === 'access_ops' ? currentTheme.border : 'transparent',
                  color: currentTheme.textPrimary 
                }}
              >
                <ClipboardList className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                <span>Access & Gate Operations</span>
              </button>

              <button
                onClick={() => setActivePortalTab('emergency_alerts')}
                className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs font-black flex items-center space-x-2 transition-all shrink-0 whitespace-nowrap relative ${
                  activeEmergenciesCount > 0
                    ? activePortalTab === 'emergency_alerts'
                      ? 'bg-red-600 text-white shadow-lg border-red-500' 
                      : 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                    : activePortalTab === 'emergency_alerts' 
                      ? 'shadow-md border' 
                      : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeEmergenciesCount === 0 && activePortalTab === 'emergency_alerts' ? currentTheme.btnAuth : undefined,
                  borderColor: activeEmergenciesCount === 0 && activePortalTab === 'emergency_alerts' ? currentTheme.border : undefined,
                  color: activeEmergenciesCount === 0 ? currentTheme.textPrimary : undefined
                }}
              >
                {activeEmergenciesCount > 0 ? (
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                )}
                <span>Google Maps Emergencies ({activeEmergenciesCount})</span>
              </button>

              <button
                onClick={() => setActivePortalTab('history')}
                className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 whitespace-nowrap ${
                  activePortalTab === 'history' ? 'shadow-md border' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: activePortalTab === 'history' ? currentTheme.btnAuth : 'transparent',
                  borderColor: activePortalTab === 'history' ? currentTheme.border : 'transparent',
                  color: currentTheme.textPrimary 
                }}
              >
                <History className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>History Archive ({resolvedEmergencies.length})</span>
              </button>

              <button
                onClick={() => setActivePortalTab('system_analytics')}
                className={`py-2.5 px-3.5 sm:px-4 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shrink-0 whitespace-nowrap ${
                  activePortalTab === 'system_analytics' ? 'shadow-md border' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  backgroundColor: activePortalTab === 'system_analytics' ? currentTheme.btnAuth : 'transparent',
                  borderColor: activePortalTab === 'system_analytics' ? currentTheme.border : 'transparent',
                  color: currentTheme.textPrimary 
                }}
              >
                <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>System Analytics</span>
              </button>
            </div>

            {/* TAB CONTENT 1: ACCESS & GATE OPERATIONS */}
            {activePortalTab === 'access_ops' && (
              <div className="space-y-5">
                <div className="flex overflow-x-auto gap-2 p-1 rounded-xl bg-black/5 dark:bg-white/5 border scrollbar-none" style={{ borderColor: currentTheme.border }}>
                  <button
                    onClick={() => setAccessSubTab('entry_log')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap ${
                      accessSubTab === 'entry_log' ? 'shadow border' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: accessSubTab === 'entry_log' ? currentTheme.btnAuth : 'transparent',
                      borderColor: accessSubTab === 'entry_log' ? currentTheme.border : 'transparent',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Live Entry Log ({entryLogs.filter(l => l.status === 'ACTIVE').length})</span>
                  </button>

                  <button
                    onClick={() => setAccessSubTab('new_checkin')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap ${
                      accessSubTab === 'new_checkin' ? 'shadow border' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: accessSubTab === 'new_checkin' ? currentTheme.btnAuth : 'transparent',
                      borderColor: accessSubTab === 'new_checkin' ? currentTheme.border : 'transparent',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>New Check-In</span>
                  </button>

                  <button
                    onClick={() => setAccessSubTab('gate_control')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap ${
                      accessSubTab === 'gate_control' ? 'shadow border' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: accessSubTab === 'gate_control' ? currentTheme.btnAuth : 'transparent',
                      borderColor: accessSubTab === 'gate_control' ? currentTheme.border : 'transparent',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <DoorOpen className="w-3.5 h-3.5" />
                    <span>Gates Control</span>
                  </button>

                  <button
                    onClick={() => setAccessSubTab('pass_generator')}
                    className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap ${
                      accessSubTab === 'pass_generator' ? 'shadow border' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: accessSubTab === 'pass_generator' ? currentTheme.btnAuth : 'transparent',
                      borderColor: accessSubTab === 'pass_generator' ? currentTheme.border : 'transparent',
                      color: currentTheme.textPrimary
                    }}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Digital Pass</span>
                  </button>
                </div>

                {accessSubTab === 'entry_log' && (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMuted }} />
                        <input
                          type="text"
                          placeholder="Search entrants by Name, ID, or Access Zone..."
                          value={logSearchQuery}
                          onChange={(e) => setLogSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-semibold outline-none"
                          style={{ 
                            backgroundColor: currentTheme.inputBg, 
                            borderColor: currentTheme.border,
                            color: currentTheme.textPrimary 
                          }}
                        />
                      </div>
                    </div>

                    <div className="border rounded-2xl overflow-hidden" style={{ borderColor: currentTheme.border }}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b bg-black/5 dark:bg-white/5 font-extrabold uppercase tracking-wider" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                              <th className="p-3.5 whitespace-nowrap">Log ID</th>
                              <th className="p-3.5 whitespace-nowrap">Entrant Name</th>
                              <th className="p-3.5 whitespace-nowrap">Category</th>
                              <th className="p-3.5 whitespace-nowrap">ID / License #</th>
                              <th className="p-3.5 whitespace-nowrap">Assigned Zone</th>
                              <th className="p-3.5 whitespace-nowrap">Time In</th>
                              <th className="p-3.5 whitespace-nowrap">Status</th>
                              <th className="p-3.5 text-right whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y" style={{ borderColor: currentTheme.border }}>
                            {filteredLogs.map((log) => (
                              <tr key={log.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <td className="p-3.5 font-mono font-bold whitespace-nowrap">{log.id}</td>
                                <td className="p-3.5 font-extrabold whitespace-nowrap">{log.name}</td>
                                <td className="p-3.5 whitespace-nowrap"><span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold text-[10px]">{log.type}</span></td>
                                <td className="p-3.5 font-mono whitespace-nowrap">{log.idNumber}</td>
                                <td className="p-3.5 font-semibold whitespace-nowrap">{log.zone}</td>
                                <td className="p-3.5 font-mono whitespace-nowrap">{log.timeIn}</td>
                                <td className="p-3.5 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    log.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-stone-500/20 text-stone-600 dark:text-stone-300'
                                  }`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="p-3.5 text-right whitespace-nowrap">
                                  {log.status === 'ACTIVE' ? (
                                    <button onClick={() => handleCheckOutEntrant(log.id)} className="px-2.5 py-1 rounded-lg text-[11px] font-bold border bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-all" style={{ borderColor: currentTheme.border }}>Check Out</button>
                                  ) : <span className="text-[11px] font-bold" style={{ color: currentTheme.textMuted }}>Completed</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* New Check-In Form */}
                {accessSubTab === 'new_checkin' && (
                  <form onSubmit={handleCreateCheckIn} className="space-y-4 max-w-xl mx-auto p-4 rounded-2xl border bg-black/5 dark:bg-white/5" style={{ borderColor: currentTheme.border }}>
                    <h3 className="text-sm font-extrabold uppercase tracking-wider mb-2 flex items-center space-x-2" style={{ color: currentTheme.textPrimary }}>
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                      <span>Log New Authorized Entrant</span>
                    </h3>

                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Robert Langdon"
                        value={newEntrantName}
                        onChange={(e) => setNewEntrantName(e.target.value)}
                        className="w-full p-3 rounded-xl border text-xs font-semibold outline-none"
                        style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Category</label>
                        <select
                          value={newEntrantType}
                          onChange={(e) => setNewEntrantType(e.target.value)}
                          className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
                          style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        >
                          <option value="Visitor">Visitor / Guest</option>
                          <option value="Staff">Employee / Staff</option>
                          <option value="Contractor">Contractor / Vendor</option>
                          <option value="Delivery">Delivery Driver</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Govt ID / License #</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. DL-99210-X"
                          value={newEntrantId}
                          onChange={(e) => setNewEntrantId(e.target.value)}
                          className="w-full p-3 rounded-xl border text-xs font-semibold outline-none"
                          style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Destination Zone</label>
                      <select
                        value={newEntrantZone}
                        onChange={(e) => setNewEntrantZone(e.target.value)}
                        className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
                        style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                      >
                        <option value="Main Reception">Main Reception</option>
                        <option value="Level 2 Office Bay">Level 2 Office Bay</option>
                        <option value="Command Hub 01">Command Hub 01</option>
                        <option value="Server Room B">Server Room B</option>
                        <option value="Loading Bay 03">Loading Bay 03</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2"
                      style={{ backgroundColor: currentTheme.btnAuth, color: currentTheme.textPrimary, borderColor: currentTheme.border }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>CONFIRM & GRANT ENTRY PASS</span>
                    </button>
                  </form>
                )}

                {/* Gate Control Sub-Tab */}
                {accessSubTab === 'gate_control' && (
                  <div className="space-y-4">
                    <p className="text-xs font-medium mb-3" style={{ color: currentTheme.textMuted }}>
                      Authorized Personnel Direct Gate Override & Electronic Turnstile Controls:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 flex flex-col justify-between" style={{ borderColor: currentTheme.border }}>
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>Gate 01 - Main Entrance</span>
                            {gatesStatus.gate01 === 'UNLOCKED' ? <DoorOpen className="w-5 h-5 text-emerald-500" /> : <DoorClosed className="w-5 h-5 text-red-500" />}
                          </div>
                          <p className="text-[11px] mb-4" style={{ color: currentTheme.textMuted }}>Primary visitor turnstile & RFID scanner.</p>
                        </div>

                        <button
                          onClick={() => toggleGateStatus('gate01')}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                            gatesStatus.gate01 === 'UNLOCKED' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/20 text-red-800 dark:text-red-200'
                          }`}
                          style={{ borderColor: currentTheme.border }}
                        >
                          Status: {gatesStatus.gate01} (Click to Toggle)
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 flex flex-col justify-between" style={{ borderColor: currentTheme.border }}>
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>Gate 02 - Service Ramp</span>
                            {gatesStatus.gate02 === 'UNLOCKED' ? <DoorOpen className="w-5 h-5 text-emerald-500" /> : <DoorClosed className="w-5 h-5 text-red-500" />}
                          </div>
                          <p className="text-[11px] mb-4" style={{ color: currentTheme.textMuted }}>Heavy vehicle & courier entry bay.</p>
                        </div>

                        <button
                          onClick={() => toggleGateStatus('gate02')}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                            gatesStatus.gate02 === 'UNLOCKED' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/20 text-red-800 dark:text-red-200'
                          }`}
                          style={{ borderColor: currentTheme.border }}
                        >
                          Status: {gatesStatus.gate02} (Click to Toggle)
                        </button>
                      </div>

                      <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 flex flex-col justify-between" style={{ borderColor: currentTheme.border }}>
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>Gate 03 - VIP Elevator</span>
                            {gatesStatus.gate03 === 'UNLOCKED' ? <DoorOpen className="w-5 h-5 text-emerald-500" /> : <DoorClosed className="w-5 h-5 text-red-500" />}
                          </div>
                          <p className="text-[11px] mb-4" style={{ color: currentTheme.textMuted }}>High clearance biometric access lift.</p>
                        </div>

                        <button
                          onClick={() => toggleGateStatus('gate03')}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                            gatesStatus.gate03 === 'UNLOCKED' ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-500/20 text-red-800 dark:text-red-200'
                          }`}
                          style={{ borderColor: currentTheme.border }}
                        >
                          Status: {gatesStatus.gate03} (Click to Toggle)
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pass Generator Sub-Tab */}
                {accessSubTab === 'pass_generator' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <form onSubmit={handleGeneratePass} className="space-y-4 p-4 rounded-2xl border bg-black/5 dark:bg-white/5" style={{ borderColor: currentTheme.border }}>
                      <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                        Issue Digital Visitor QR Pass
                      </h3>

                      <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Recipient Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Amanda Cole"
                          value={passRecipientName}
                          onChange={(e) => setPassRecipientName(e.target.value)}
                          className="w-full p-3 rounded-xl border text-xs font-semibold outline-none"
                          style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold mb-1" style={{ color: currentTheme.textMuted }}>Zone Permission</label>
                        <select
                          value={passZone}
                          onChange={(e) => setPassZone(e.target.value)}
                          className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer"
                          style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        >
                          <option value="Level 2 Office Bay">Level 2 Office Bay</option>
                          <option value="Command Hub 01">Command Hub 01</option>
                          <option value="Server Room B">Server Room B</option>
                          <option value="Full Facility Clearance">Full Facility Clearance</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-xl text-xs font-extrabold border transition-all hover:brightness-95"
                        style={{ backgroundColor: currentTheme.btnAuth, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                      >
                        Generate Pass QR Code
                      </button>
                    </form>

                    {generatedPass ? (
                      <div className="p-6 rounded-2xl border-2 border-emerald-500/50 bg-black/10 dark:bg-black/30 text-center space-y-3 relative overflow-hidden animate-fadeIn" style={{ borderColor: currentTheme.border }}>
                        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-black rounded-full uppercase">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>OFFICIAL DIGITAL PASS</span>
                        </div>

                        <div className="w-24 h-24 bg-white p-2 mx-auto rounded-xl shadow-inner flex items-center justify-center">
                          <QrCode className="w-20 h-20 text-stone-900" />
                        </div>

                        <div>
                          <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-300">{generatedPass.passCode}</p>
                          <h4 className="text-lg font-black" style={{ color: currentTheme.textPrimary }}>{generatedPass.name}</h4>
                          <p className="text-xs font-medium" style={{ color: currentTheme.textMuted }}>Permitted Zone: {generatedPass.zone}</p>
                        </div>

                        <div className="pt-3 border-t text-[11px] flex justify-between" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                          <span>Valid: {generatedPass.validUntil}</span>
                          <span>Issuer: {generatedPass.issuer}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-10 rounded-2xl border border-dashed text-center flex flex-col items-center justify-center space-y-2" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                        <QrCode className="w-10 h-10 opacity-40" />
                        <p className="text-xs font-bold">No Digital Pass Generated Yet</p>
                        <p className="text-[11px]">Fill the form on the left to issue a pass QR code.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: GOOGLE MAPS EMERGENCIES */}
            {activePortalTab === 'emergency_alerts' && (
              <div className="space-y-6">
                <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${
                  activeEmergenciesCount > 0 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : 'bg-emerald-500/10 border-emerald-500/30'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-xl text-white ${
                      activeEmergenciesCount > 0 ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'
                    }`}>
                      {activeEmergenciesCount > 0 ? <Map className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className={`text-sm font-black ${
                        activeEmergenciesCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-300'
                      }`}>
                        {activeEmergenciesCount > 0 
                          ? 'Active Google Maps Emergency Dispatches'
                          : 'Emergency Command Center — All Active Issues Resolved'
                        }
                      </h3>
                      <p className="text-xs" style={{ color: currentTheme.textMuted }}>
                        {activeEmergenciesCount > 0 
                          ? 'Click any emergency dispatch card to open interactive Google Maps with live crowd gathering analytics.'
                          : 'No active emergencies pending. Resolved issues have been automatically moved to the History Archive panel.'
                        }
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider shrink-0 ml-2 ${
                    activeEmergenciesCount > 0 ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {activeEmergenciesCount > 0 ? `${activeEmergenciesCount} Active` : 'All Clear ✓'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeEmergencies.map((emg) => (
                    <div 
                      key={emg.id}
                      onClick={() => setSelectedEmergencyForMap(emg)}
                      className="p-5 rounded-2xl border transition-all cursor-pointer relative hover:shadow-lg group border-red-500/60 bg-red-500/5"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-xs font-mono font-black text-red-600 dark:text-red-400">{emg.dispatchId}</span>
                          <span className="px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-bold">
                            {emg.langFlag} {emg.language}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 text-[10px] font-extrabold flex items-center space-x-1">
                            {getCategoryBadgeIcon(emg.category)}
                            <span>{emg.category || 'General'}</span>
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse shrink-0">
                          {emg.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs font-bold my-2 line-clamp-2" style={{ color: currentTheme.textPrimary }}>
                        "{emg.text}"
                      </p>

                      {emg.photo && (
                        <div className="my-2 rounded-xl overflow-hidden border border-red-500/30 max-h-32 bg-black/20">
                          <img src={emg.photo} alt="Uploaded Incident Evidence" className="w-full h-32 object-cover" />
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-[11px] mb-3" style={{ color: currentTheme.textMuted }}>
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="truncate">{emg.location.address}</span>
                      </div>

                      <div className="pt-3 border-t flex justify-between items-center text-[10px] font-semibold" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
                        <span>Time: {emg.time}</span>
                        <span className="text-red-600 dark:text-red-400 group-hover:underline flex items-center space-x-1 font-bold">
                          <Map className="w-3 h-3 text-red-500" />
                          <span>Open Google Maps</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: HISTORY ARCHIVE */}
            {activePortalTab === 'history' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: currentTheme.textMuted }} />
                    <input
                      type="text"
                      placeholder="Search resolved history by Dispatch ID, location, description, or officer..."
                      value={historySearchQuery}
                      onChange={(e) => setHistorySearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-semibold outline-none"
                      style={{ 
                        backgroundColor: currentTheme.inputBg, 
                        borderColor: currentTheme.border,
                        color: currentTheme.textPrimary 
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-xs font-extrabold flex items-center space-x-1 shrink-0 mr-1" style={{ color: currentTheme.textMuted }}>
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter:</span>
                  </span>

                  {[
                    { id: 'ALL', name: 'All Resolved', icon: Archive },
                    { id: 'Medical Emergency', name: 'Medical Help', icon: Stethoscope },
                    { id: 'Fire Help', name: 'Fire Breakdown', icon: Flame },
                    { id: 'Police Help', name: 'Police Help', icon: Siren },
                    { id: 'Accident', name: 'Accidents', icon: Car }
                  ].map((cat) => {
                    const CatIcon = cat.icon;
                    const isActive = historyCategoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setHistoryCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1.5 transition-all border ${
                          isActive 
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' 
                            : 'bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
                        }`}
                        style={{
                          borderColor: isActive ? undefined : currentTheme.border,
                          color: isActive ? undefined : currentTheme.textPrimary
                        }}
                      >
                        <CatIcon className="w-3.5 h-3.5" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHistory.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedEmergencyForMap(item)}
                      className="p-5 rounded-2xl border transition-all cursor-pointer relative hover:shadow-lg group bg-emerald-500/5 border-emerald-500/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400">{item.dispatchId}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-extrabold flex items-center space-x-1">
                            {getCategoryBadgeIcon(item.category)}
                            <span>{item.category || 'General'}</span>
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white shrink-0">
                          ✓ RESOLVED
                        </span>
                      </div>

                      <p className="text-xs font-bold my-2 line-clamp-2" style={{ color: currentTheme.textPrimary }}>
                        "{item.text}"
                      </p>

                      {item.photo && (
                        <div className="my-2 rounded-xl overflow-hidden border border-emerald-500/30 max-h-32 bg-black/20">
                          <img src={item.photo} alt="Uploaded Incident Evidence" className="w-full h-32 object-cover" />
                        </div>
                      )}

                      <div className="flex items-center space-x-2 text-[11px] mb-2" style={{ color: currentTheme.textMuted }}>
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{item.location.address}</span>
                      </div>

                      <div className="my-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col space-y-1 text-xs">
                        <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-200 font-extrabold">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Resolved: {item.resolvedAt?.date || item.date}, {item.resolvedAt?.time || item.time}</span>
                          </span>
                        </div>
                        <div className="text-[11px] font-medium" style={{ color: currentTheme.textMuted }}>
                          Assigned Officer: <span className="font-bold text-stone-800 dark:text-stone-200">{item.assignedOfficer || 'Officer Alex Mercer'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: SYSTEM ANALYTICS */}
            {activePortalTab === 'system_analytics' && (
              <div className="space-y-6">
                <div className="flex overflow-x-auto gap-1.5 p-1.5 rounded-2xl bg-black/5 dark:bg-white/5 border scrollbar-none" style={{ borderColor: currentTheme.border }}>
                  {[
                    { id: 'ai_inspector', name: 'Gemini AI Inspector', icon: Brain },
                    { id: 'capacity_workbench', name: 'Evacuation Matcher', icon: Building },
                    { id: 'sos_dispatch', name: 'Tactical SOS Console', icon: Truck },
                    { id: 'gis_map', name: 'GIS Crowd Radar', icon: Compass },
                    { id: 'audit_export', name: 'Governance & Audit', icon: FileCheck }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = analyticsSubTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setAnalyticsSubTab(tab.id)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 whitespace-nowrap ${
                          isActive ? 'shadow-md border' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{
                          backgroundColor: isActive ? currentTheme.btnAuth : 'transparent',
                          borderColor: isActive ? currentTheme.border : 'transparent',
                          color: currentTheme.textPrimary
                        }}
                      >
                        <TabIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-panel: ENHANCED GEMINI AI INSPECTOR */}
                {analyticsSubTab === 'ai_inspector' && (
                  <div className="space-y-5">
                    {/* Select Habitation Selector Header */}
                    <div className="p-4 sm:p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4" style={{ borderColor: currentTheme.border }}>
                      <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-3" style={{ borderColor: currentTheme.border }}>
                        <div>
                          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center space-x-2">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span>Gemini AI Structural & Disaster Risk Assessment Engine</span>
                          </h3>
                          <p className="text-[11px] sm:text-xs" style={{ color: currentTheme.textMuted }}>
                            Select any habitation, village, or target zone to compute Composite Vulnerability Score (CVS) and generate AI diagnostic decision.
                          </p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                          gemini-3-flash
                        </span>
                      </div>

                      {/* Dropdown Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold" style={{ color: currentTheme.textMuted }}>
                          Select Target Habitation / Village for Inspection:
                        </label>
                        <select
                          value={selectedInspectorHabId}
                          onChange={(e) => {
                            setSelectedInspectorHabId(e.target.value);
                            setAiInspectResult(null);
                          }}
                          className="w-full p-3 rounded-xl border text-xs sm:text-sm font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
                          style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                        >
                          {habitations.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name} — District: {h.district} ({h.pop} Citizens • {h.tier})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Display Habitation Information Card */}
                      <div className="p-4 rounded-xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
                        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: currentTheme.border }}>
                          <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                            <Building className="w-3.5 h-3.5" />
                            <span>Habitation Baseline Profile</span>
                          </span>
                          <span className="text-[10px] font-mono font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded">
                            Hazard: {currentInspectorHab.hazard}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold">
                          <div>
                            <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>Habitation / Village</span>
                            <span className="font-extrabold text-sm" style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.name.replace(' (Red Hazard Zone)', '')}</span>
                          </div>
                          <div>
                            <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>District & State</span>
                            <span style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.district}, {currentInspectorHab.state || 'Uttarakhand'}</span>
                          </div>
                          <div>
                            <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>Population & Families</span>
                            <span style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.pop} Citizens ({currentInspectorHab.families || Math.round(currentInspectorHab.pop / 5)} Families)</span>
                          </div>
                          <div>
                            <span className="text-[10px] block font-medium" style={{ color: currentTheme.textMuted }}>Housing Structure</span>
                            <span style={{ color: currentTheme.textPrimary }}>{currentInspectorHab.houses || 260} Total ({currentInspectorHab.kuchaHouses || 195} Kucha • {currentInspectorHab.puccaHouses || 65} Pucca)</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] font-mono pt-1 text-stone-500 dark:text-stone-400 border-t" style={{ borderColor: currentTheme.border }}>
                          <span>GPS Coordinates: {currentInspectorHab.lat}° N, {currentInspectorHab.lng}° E</span>
                          <span>Vulnerable Cohort: {currentInspectorHab.elderly} Seniors • {currentInspectorHab.pwd} PwD</span>
                        </div>
                      </div>

                      {/* Analyze with AI Button */}
                      <button
                        onClick={handleRunAiInspection}
                        disabled={aiInspectLoading}
                        className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2 text-white bg-purple-600 hover:bg-purple-700 cursor-pointer disabled:opacity-50"
                      >
                        {aiInspectLoading ? (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Processing Satellite Radar & Multi-Factor Vulnerability Data...</span>
                          </>
                        ) : (
                          <>
                            <Brain className="w-5 h-5" />
                            <span>ANALYZE WITH GEMINI AI INSPECTOR</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* AI Diagnostics Output Panel */}
                    {aiInspectResult && (
                      <div className="space-y-4 animate-fadeIn">
                        {/* Decision Card */}
                        <div className={`p-5 rounded-2xl border-2 space-y-3 ${
                          aiInspectResult.priority === 'CRITICAL'
                            ? 'bg-red-500/10 border-red-500/50'
                            : (aiInspectResult.priority === 'HIGH' ? 'bg-amber-500/10 border-amber-500/50' : 'bg-emerald-500/10 border-emerald-500/50')
                        }`}>
                          <div className="flex justify-between items-start flex-wrap gap-2">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300">
                                AI CLASSIFICATION DECISION
                              </span>
                              <h3 className={`text-lg sm:text-xl font-black mt-0.5 ${
                                aiInspectResult.priority === 'CRITICAL'
                                  ? 'text-red-600 dark:text-red-400'
                                  : (aiInspectResult.priority === 'HIGH' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')
                              }`}>
                                {aiInspectResult.classification}
                              </h3>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] block font-bold" style={{ color: currentTheme.textMuted }}>Composite Vulnerability Score</span>
                              <span className="text-2xl font-black font-mono text-red-600 dark:text-red-400">
                                CVS: {aiInspectResult.cvs}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border text-xs font-semibold" style={{ borderColor: currentTheme.border }}>
                            <b>Recommended Priority Action:</b> {aiInspectResult.recommendedAction}
                          </div>

                          <div className="text-[10px] font-mono text-purple-700 dark:text-purple-300 flex items-center space-x-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                            <span>{aiInspectResult.confidence}</span>
                          </div>
                        </div>

                        {/* Individual Risk Factor Scores Grid (0-100) */}
                        <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5">
                            <Activity className="w-4 h-4" />
                            <span>Multi-Factor Hazard & Vulnerability Sub-Scores (0 – 100)</span>
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                            {[
                              { label: 'Flood Exposure', score: aiInspectResult.scores.flood, color: 'bg-blue-500' },
                              { label: 'Landslide Exposure', score: aiInspectResult.scores.landslide, color: 'bg-red-500' },
                              { label: 'Seismic Exposure', score: aiInspectResult.scores.seismic, color: 'bg-purple-500' },
                              { label: 'Terrain / Slope Risk', score: aiInspectResult.scores.terrain, color: 'bg-amber-500' },
                              { label: 'Structural Vulnerability', score: aiInspectResult.scores.structural, color: 'bg-orange-500' },
                              { label: 'Demographic Risk', score: aiInspectResult.scores.demographic, color: 'bg-indigo-500' },
                              { label: 'Infrastructure Vulnerability', score: aiInspectResult.scores.infrastructure, color: 'bg-stone-500' }
                            ].map((item, idx) => (
                              <div key={idx} className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 space-y-1.5" style={{ borderColor: currentTheme.border }}>
                                <div className="flex justify-between font-bold">
                                  <span style={{ color: currentTheme.textPrimary }}>{item.label}</span>
                                  <span className="font-mono text-red-600 dark:text-red-400">{item.score} / 100</span>
                                </div>
                                <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }}></div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-[11px] font-mono text-purple-800 dark:text-purple-200">
                            <b>Formula Applied:</b> CVS = (0.40 × {aiInspectResult.hazardExposure} Hazard) + (0.35 × {aiInspectResult.structuralRisk} Structural) + (0.25 × {aiInspectResult.demographicRisk} Demographic) = <b>{aiInspectResult.cvs} Score</b>
                          </div>
                        </div>

                        {/* AI Concise Explanation */}
                        <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-2" style={{ borderColor: currentTheme.border }}>
                          <h4 className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center space-x-1.5">
                            <Brain className="w-4 h-4 text-purple-600" />
                            <span>AI Diagnostic Reasoning</span>
                          </h4>
                          <p className="text-xs font-semibold leading-relaxed p-3 rounded-xl bg-purple-500/10 border border-purple-500/20" style={{ color: currentTheme.textPrimary }}>
                            "{aiInspectResult.reasoning}"
                          </p>
                        </div>

                        {/* Recommended Actions Checklist */}
                        <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center space-x-1.5">
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                            <span>Recommended Actionable Evacuation Protocol</span>
                          </h4>

                          <div className="space-y-2 text-xs font-bold">
                            {aiInspectResult.actions.map((act, index) => (
                              <div key={index} className="p-2.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 flex items-center space-x-2 text-emerald-800 dark:text-emerald-200">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                <span>{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-panel 2: Evacuation Matcher */}
                {analyticsSubTab === 'capacity_workbench' && (
                  <div className="space-y-5">
                    <div className="p-4 sm:p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4" style={{ borderColor: currentTheme.border }}>
                      <div className="flex justify-between items-start flex-wrap gap-2 border-b pb-3" style={{ borderColor: currentTheme.border }}>
                        <div>
                          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>Dynamic Hazard Evacuation & Safe Zone Matcher Engine</span>
                          </h3>
                          <p className="text-[11px] sm:text-xs" style={{ color: currentTheme.textMuted }}>
                            Select vulnerable population sectors in high-hazard Red zones and shift them to designated Green Safe Fields.
                          </p>
                        </div>

                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border border-emerald-500/30">
                          Capacity Optimization Active
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl border bg-red-500/10 border-red-500/30 space-y-2">
                          <label className="flex items-center space-x-1.5 text-xs font-extrabold text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            <span>Select Danger / Red Zone Habitation (Source)</span>
                          </label>
                          <select
                            value={selectedHabId}
                            onChange={(e) => setSelectedHabId(e.target.value)}
                            className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
                            style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                          >
                            {habitations.map((h) => (
                              <option key={h.id} value={h.id}>
                                {h.name} — {h.pop} Citizens ({h.tier})
                              </option>
                            ))}
                          </select>

                          <div className="pt-2 text-[11px] space-y-1 font-medium" style={{ color: currentTheme.textMuted }}>
                            <div>Hazard Type: <b className="text-red-600 dark:text-red-400">{selectedHab.hazard}</b></div>
                            <div>Vulnerability Index: <b className="font-mono text-amber-600">{selectedHab.cvs} CVS Score</b></div>
                            <div>Elderly / PwD Citizens: <b>{selectedHab.elderly} Seniors • {selectedHab.pwd} PwD</b></div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 space-y-2">
                          <label className="flex items-center space-x-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Select Safe / Green Candidate Site (Destination)</span>
                          </label>
                          <select
                            value={selectedSiteId}
                            onChange={(e) => setSelectedSiteId(e.target.value)}
                            className="w-full p-3 rounded-xl border text-xs font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
                            style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                          >
                            {candidateSites.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name} — Rem. Capacity: {s.maxCapacity - s.allocatedPop}
                              </option>
                            ))}
                          </select>

                          <div className="pt-2 text-[11px] space-y-1 font-medium" style={{ color: currentTheme.textMuted }}>
                            <div>Facility Type: <b className="text-emerald-600 dark:text-emerald-400">{selectedSite.type}</b></div>
                            <div>Water & Medical: <b>{selectedSite.waterSupply}</b></div>
                            <div>Accessibility Note: <b>{selectedSite.accessibility}</b></div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono font-bold">
                        <div className={`p-3 rounded-xl border flex justify-between items-center ${
                          isAllocationFeasible ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300' : 'bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-300'
                        }`}>
                          <span>Evacuation Feasibility</span>
                          <span>{isAllocationFeasible ? '✓ FEASIBLE' : '❌ NO CAPACITY'}</span>
                        </div>

                        <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
                          <span style={{ color: currentTheme.textMuted }}>Citizens Shifting</span>
                          <span style={{ color: currentTheme.textPrimary }}>{selectedHab.pop} / {remainingCap} Slots</span>
                        </div>

                        <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
                          <span style={{ color: currentTheme.textMuted }}>Transport Convoy</span>
                          <span className="text-amber-600 dark:text-amber-300">{requiredBuses} Buses Required</span>
                        </div>
                      </div>

                      <button
                        onClick={handleConfirmEvacuationShift}
                        disabled={!isAllocationFeasible}
                        className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                      >
                        <ArrowUpRight className="w-5 h-5" />
                        <span>EXECUTE EMERGENCY EVACUATION & SHIFT TO SAFE ZONE</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-panel 3: Tactical SOS Console */}
                {analyticsSubTab === 'sos_dispatch' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 text-center space-y-4 flex flex-col justify-between" style={{ borderColor: currentTheme.border }}>
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center justify-center space-x-1.5">
                            <Siren className="w-4 h-4" />
                            <span>1-Tap Red Zone SOS & Audio Alarm</span>
                          </h4>
                          <p className="text-[11px] mt-1" style={{ color: currentTheme.textMuted }}>
                            Tapping broadcasts a swept Web Audio emergency siren and high-volume voice dispatch alert.
                          </p>
                        </div>

                        <div className="text-left">
                          <label className="block text-[11px] font-bold mb-1" style={{ color: currentTheme.textMuted }}>
                            Target Red Hazard Hotspot
                          </label>
                          <select
                            value={selectedSosTargetZone}
                            onChange={(e) => setSelectedSosTargetZone(e.target.value)}
                            className="w-full p-2.5 rounded-xl border text-xs font-bold outline-none cursor-pointer bg-white dark:bg-stone-900"
                            style={{ borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                          >
                            {crowdZones.map((z) => (
                              <option key={z.id} value={z.id}>
                                {z.level === 'RED' ? '🔴' : '🟡'} {z.name} ({z.count} Humans)
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={() => handleTriggerTacticalSos('Critical Emergency Medical Evacuation')}
                          className="w-32 h-32 mx-auto rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-2xl border-4 border-red-300 flex flex-col items-center justify-center transition-transform active:scale-90 animate-pulse my-2 cursor-pointer"
                        >
                          <Zap className="w-7 h-7 mb-1" />
                          <span>1-TAP SOS</span>
                          <span className="text-[9px] font-mono opacity-90">LOUD VOICE</span>
                        </button>

                        <div className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                          Triggers sound sweep & speech synthesis
                        </div>
                      </div>

                      <div className="lg:col-span-2 p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-3" style={{ borderColor: currentTheme.border }}>
                        <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: currentTheme.border }}>
                          <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center space-x-1.5">
                            <Activity className="w-4 h-4" />
                            <span>Live First-Responder & NDRF Dispatch Queue</span>
                          </h4>
                          <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-600 text-[10px] font-black">
                            {tacticalSosQueue.length} Active Dispatches
                          </span>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {tacticalSosQueue.map((evt) => (
                            <div key={evt.id} className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 text-xs flex justify-between items-center gap-2" style={{ borderColor: currentTheme.border }}>
                              <div>
                                <span className="font-extrabold block" style={{ color: currentTheme.textPrimary }}>{evt.type}</span>
                                <span className="text-[11px] font-medium text-amber-600 dark:text-amber-300 block">Target: {evt.target}</span>
                                <span className="text-[10px] font-mono" style={{ color: currentTheme.textMuted }}>{evt.time}</span>
                              </div>
                              <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 text-[10px] font-black shrink-0">
                                {evt.status} (ETA: {evt.eta})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-panel 4: GIS Map */}
                {analyticsSubTab === 'gis_map' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-1" style={{ borderColor: currentTheme.border }}>
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>Total Tracked Humans</span>
                        <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-300 flex items-center justify-between">
                          <span>{crowdZones.reduce((acc, z) => acc + z.count, 0)}</span>
                          <Users className="w-5 h-5 opacity-40" />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border bg-red-500/10 border-red-500/30 space-y-1">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">🔴 Red Alert Hotspots</span>
                        <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400 flex items-center justify-between">
                          <span>{crowdZones.filter(z => z.level === 'RED').length} Zones</span>
                          <ShieldAlert className="w-5 h-5 opacity-40 animate-pulse" />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border bg-amber-500/10 border-amber-500/30 space-y-1">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">🟡 Moderate Warnings</span>
                        <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-300 flex items-center justify-between">
                          <span>{crowdZones.filter(z => z.level === 'YELLOW').length} Zones</span>
                          <AlertTriangle className="w-5 h-5 opacity-40" />
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 space-y-1">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">🟢 Safe Clear Sectors</span>
                        <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                          <span>{crowdZones.filter(z => z.level === 'GREEN').length} Zones</span>
                          <CheckCircle2 className="w-5 h-5 opacity-40" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl border bg-black/5 dark:bg-white/5 flex flex-wrap justify-between items-center gap-3" style={{ borderColor: currentTheme.border }}>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black flex items-center space-x-2" style={{ color: currentTheme.textPrimary }}>
                          <Compass className="w-4 h-4 text-amber-500" />
                          <span>Interactive GIS Human Crowd Satellite Radar</span>
                        </h3>
                        <p className="text-[11px] sm:text-xs" style={{ color: currentTheme.textMuted }}>
                          Real-time footprint tracking (Red = Severe Surge, Yellow = Moderate, Green = Safe).
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
                        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/10 dark:bg-white/10">
                          {['satellite', 'dark', 'topo'].map((style) => (
                            <button
                              key={style}
                              onClick={() => setGisTileStyle(style)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold capitalize transition-all ${
                                gisTileStyle === style ? 'bg-amber-500 text-stone-900 shadow' : 'hover:opacity-100 opacity-70'
                              }`}
                            >
                              {style}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center space-x-1 p-1 rounded-xl bg-black/10 dark:bg-white/10">
                          {[
                            { id: 'ALL', label: 'All' },
                            { id: 'RED', label: '🔴 Red' },
                            { id: 'YELLOW', label: '🟡 Yellow' },
                            { id: 'GREEN', label: '🟢 Green' }
                          ].map((f) => (
                            <button
                              key={f.id}
                              onClick={() => setCrowdFilter(f.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black transition-all ${
                                crowdFilter === f.id ? 'bg-red-600 text-white shadow' : 'hover:opacity-100 opacity-70'
                              }`}
                            >
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative h-72 sm:h-96 rounded-2xl border overflow-hidden bg-stone-900 shadow-xl" style={{ borderColor: currentTheme.border }}>
                      <div ref={analyticsMapRef} className="absolute inset-0 z-0"></div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        Active Crowd Hotspots & Response Controls
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {crowdZones
                          .filter(z => crowdFilter === 'ALL' || z.level === crowdFilter)
                          .map((zone) => {
                            let badgeBg = 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 border-emerald-500/30';
                            if (zone.level === 'RED') badgeBg = 'bg-red-600 text-white animate-pulse';
                            if (zone.level === 'YELLOW') badgeBg = 'bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/30';

                            return (
                              <div
                                key={zone.id}
                                className={`p-4 rounded-2xl border text-xs flex flex-col justify-between space-y-3 transition-all ${
                                  zone.level === 'RED' ? 'bg-red-500/10 border-red-500/40' : 'bg-black/5 dark:bg-white/5'
                                }`}
                                style={{ borderColor: zone.level === 'RED' ? undefined : currentTheme.border }}
                              >
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-start gap-2">
                                    <span className="font-extrabold text-xs sm:text-sm" style={{ color: currentTheme.textPrimary }}>
                                      {zone.name}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 border ${badgeBg}`}>
                                      {zone.level === 'RED' ? '🔴 HIGH SURGE' : (zone.level === 'YELLOW' ? '🟡 MODERATE' : '🟢 SAFE')}
                                    </span>
                                  </div>

                                  <p className="text-[11px] font-medium" style={{ color: currentTheme.textMuted }}>
                                    Category: <b>{zone.category}</b> • Footfall Trend: <b>{zone.trend}</b>
                                  </p>

                                  <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden my-1">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        zone.level === 'RED' ? 'bg-red-600' : (zone.level === 'YELLOW' ? 'bg-amber-500' : 'bg-emerald-500')
                                      }`}
                                      style={{ width: `${zone.density}%` }}
                                    ></div>
                                  </div>

                                  <div className="flex justify-between items-center text-[10px] font-mono font-bold" style={{ color: currentTheme.textMuted }}>
                                    <span>Humans Gathered: {zone.count} / {zone.maxCap}</span>
                                    <span>Density: {zone.density}% Capacity</span>
                                  </div>
                                </div>

                                {zone.level === 'RED' && (
                                  <button
                                    onClick={() => handleDispatchCrowdControl(zone)}
                                    className="w-full py-2 px-3 rounded-xl text-xs font-black bg-red-600 hover:bg-red-700 text-white shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                                  >
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    <span>Dispatch Crowd Dispersion & Voice Warning</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-panel 5: Audit Export */}
                {analyticsSubTab === 'audit_export' && (
                  <div className="p-5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-4" style={{ borderColor: currentTheme.border }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Human-in-the-Loop Audit Trail</h4>
                        <p className="text-[11px]" style={{ color: currentTheme.textMuted }}>All administrative decisions logged with timestamp and user role.</p>
                      </div>
                      <button
                        onClick={() => setIsBlueprintModalOpen(true)}
                        className="px-4 py-2 rounded-xl text-xs font-black border transition-all cursor-pointer"
                        style={{ backgroundColor: currentTheme.btnAuth, borderColor: currentTheme.border, color: currentTheme.textPrimary }}
                      >
                        Export Official Blueprint
                      </button>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                      {auditLogs.map((log) => (
                        <div key={log.id} className="p-2.5 rounded-xl border bg-black/5 dark:bg-white/5 flex justify-between items-center" style={{ borderColor: currentTheme.border }}>
                          <div>
                            <span className="font-bold text-amber-600 dark:text-amber-400 mr-2">[{log.user}]</span>
                            <span style={{ color: currentTheme.textPrimary }}>{log.action}</span>
                          </div>
                          <span className="text-[10px] font-mono" style={{ color: currentTheme.textMuted }}>{log.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: EMERGENCY DISPATCH FORM */}
        {view === 'emergency_form' && (
          <div 
            className="border rounded-3xl p-5 sm:p-8 shadow-2xl max-w-2xl w-full text-left relative transition-all"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border,
              boxShadow: `0 20px 40px ${currentTheme.cardShadow}`
            }}
          >
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

            <form onSubmit={submitEmergencyForm} className="space-y-6">
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
                        className={`p-3 rounded-2xl text-xs font-bold flex flex-col items-center space-y-1.5 border transition-all ${
                          isSelected 
                            ? 'bg-red-600 text-white border-red-500 shadow-md scale-105' 
                            : 'bg-black/5 dark:bg-white/5 opacity-80 hover:opacity-100'
                        }`}
                        style={{ borderColor: isSelected ? undefined : currentTheme.border, color: isSelected ? undefined : currentTheme.textPrimary }}
                      >
                        <CatIcon className="w-5 h-5" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

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
                    Microphone Ready ({LANGUAGES.find(l => l.code === selectedLang)?.name})
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-bold mb-2 flex items-center space-x-1" style={{ color: currentTheme.textMuted }}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Quick Phrases ({LANGUAGES.find(l => l.code === selectedLang)?.flag}):</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.find(l => l.code === selectedLang)?.quickPhrases.map((phrase, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setEmergencyText((prev) => (prev ? `${prev} - ${phrase}` : phrase))}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:brightness-90 active:scale-95"
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                    Emergency Details
                  </label>
                  
                  <button
                    type="button"
                    onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
                    className="text-xs font-extrabold flex items-center space-x-1.5 px-3 py-1 rounded-lg border hover:brightness-95 transition-all"
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
                      <span>Virtual {LANGUAGES.find(l => l.code === selectedLang)?.name} Keyboard</span>
                      <button 
                        type="button" 
                        onClick={handleBackspace} 
                        className="px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                            className="flex-1 min-w-6 sm:min-w-9 py-2 rounded-lg text-xs sm:text-sm font-bold border shadow-sm transition-all hover:bg-white/30 active:scale-95"
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
                      className="w-full py-2 bg-stone-300 dark:bg-stone-700 text-xs font-extrabold rounded-xl border mt-1"
                      style={{ color: currentTheme.textPrimary, borderColor: currentTheme.border }}
                    >
                      SPACEBAR
                    </button>
                  </div>
                )}
              </div>

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
                      className="p-2 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-red-600 text-white font-black text-sm sm:text-base shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 hover:bg-red-700 cursor-pointer"
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
        )}

        {/* VIEW 4: EMERGENCY SUCCESS CONFIRMATION SCREEN */}
        {view === 'emergency_success' && (
          <div 
            className="border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-8 shadow-2xl max-w-2xl sm:max-w-3xl w-full text-center relative backdrop-blur-xl space-y-5"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border,
              boxShadow: `0 20px 50px ${currentTheme.cardShadow}`
            }}
          >
            <div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-3 shadow-xl animate-bounce">
                <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
              </div>

              <span className="inline-block px-3.5 py-1 bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-black rounded-full mb-2 tracking-widest uppercase">
                Dispatch ID: {dispatchId}
              </span>

              <h2 className="text-xl sm:text-2xl font-black mb-1 leading-snug text-emerald-700 dark:text-emerald-300">
                Message is successfully sent and help is near you
              </h2>

              <p className="text-xs font-medium leading-relaxed" style={{ color: currentTheme.textMuted }}>
                Your emergency signal and live GPS coordinates have been transmitted. Rescue units have been alerted!
              </p>
            </div>

            {/* Interactive Live Map showing User Location & Nearby Stations */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>
                <span className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
                  <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
                  <span>Your Live GPS Location & Nearby Responders</span>
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">📍 GPS Signal Active</span>
              </div>

              <div className="relative h-60 sm:h-72 rounded-2xl border overflow-hidden bg-stone-900 border-emerald-500/40 shadow-xl">
                <div ref={successMapRef} className="absolute inset-0 z-0"></div>
              </div>
            </div>

            {/* Nearby Emergency Responder Hubs Cards */}
            <div className="text-left space-y-2">
              <p className="text-xs font-black uppercase tracking-wider" style={{ color: currentTheme.textMuted }}>
                Nearby Emergency Responder Hubs
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                {/* Hospital Card */}
                <div className="p-3 rounded-2xl border bg-blue-500/10 border-blue-500/30 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start font-black text-blue-700 dark:text-blue-300">
                      <span>🏥 District Hospital ER</span>
                      <span className="text-[10px] font-mono bg-blue-500/20 px-1.5 py-0.5 rounded">420m</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">Multi-Specialty Trauma Care & Ambulance Hub</p>
                  </div>
                  <button 
                    onClick={() => window.open('tel:102')}
                    className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Helpline (102)</span>
                  </button>
                </div>

                {/* Police Station Card */}
                <div className="p-3 rounded-2xl border bg-indigo-500/10 border-indigo-500/30 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start font-black text-indigo-700 dark:text-indigo-300">
                      <span>🚔 Central Police Hub</span>
                      <span className="text-[10px] font-mono bg-indigo-500/20 px-1.5 py-0.5 rounded">310m</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">Patrol Squad & Rapid Response Command</p>
                  </div>
                  <button 
                    onClick={() => window.open('tel:112')}
                    className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Police (112)</span>
                  </button>
                </div>

                {/* Fire Station Card */}
                <div className="p-3 rounded-2xl border bg-amber-500/10 border-amber-500/30 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex justify-between items-start font-black text-amber-700 dark:text-amber-300">
                      <span>🚒 Fire Station 04</span>
                      <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.5 rounded">580m</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1">Hazmat & Disaster Emergency Response Unit</p>
                  </div>
                  <button 
                    onClick={() => window.open('tel:101')}
                    className="w-full py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[11px] rounded-xl flex items-center justify-center space-x-1 shadow"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Fire (101)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border text-left space-y-1.5" style={{ borderColor: currentTheme.border }}>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium" style={{ color: currentTheme.textMuted }}>Estimated Response Arrival:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">3 - 5 Minutes</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium" style={{ color: currentTheme.textMuted }}>Acquired GPS Coordinates:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {currentLocation ? `${currentLocation.lat.toFixed(4)}°, ${currentLocation.lng.toFixed(4)}°` : 'Acquired'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button 
                onClick={() => window.open('tel:911')}
                className="w-full py-3.5 px-4 rounded-2xl bg-red-600 text-white font-black text-xs sm:text-sm shadow-xl hover:bg-red-700 transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Call Emergency Hotline (911)</span>
              </button>

              <button
                onClick={handleRequestGoHome}
                className="w-full py-3.5 px-4 rounded-2xl border text-xs font-bold hover:brightness-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                style={{ 
                  backgroundColor: currentTheme.btnAuth, 
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary 
                }}
              >
                <Home className="w-4 h-4" />
                <span>Return to Home Page</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* GOOGLE MAP EMERGENCY MODAL */}
      {selectedEmergencyForMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div 
            className="border w-full max-w-5xl rounded-3xl p-4 sm:p-7 shadow-2xl relative overflow-hidden transition-all text-left space-y-4 max-h-[92vh] overflow-y-auto"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border 
            }}
          >
            <div className="flex justify-between items-start pb-3 border-b" style={{ borderColor: currentTheme.border }}>
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-2xl text-white ${
                  selectedEmergencyForMap.status === 'RESOLVED' ? 'bg-emerald-600' : 'bg-red-600 animate-pulse'
                }`}>
                  <Map className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="text-xs font-mono font-black text-red-600 dark:text-red-400">
                      {selectedEmergencyForMap.dispatchId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-[10px] font-extrabold flex items-center space-x-1">
                      {getCategoryBadgeIcon(selectedEmergencyForMap.category)}
                      <span>{selectedEmergencyForMap.category || 'General'}</span>
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black mt-0.5" style={{ color: currentTheme.textPrimary }}>
                    Google Maps Emergency & Crowd Command
                  </h3>
                </div>
              </div>

              <button 
                onClick={() => setSelectedEmergencyForMap(null)}
                className="p-1.5 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-red-500/20 text-stone-700 dark:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 relative h-72 sm:h-80 lg:h-96 rounded-2xl border overflow-hidden bg-stone-900 border-red-500/40 shadow-2xl flex flex-col justify-between p-3">
                <div ref={mapContainerRef} className="absolute inset-0 z-0"></div>

                <div className="relative z-10 flex flex-wrap justify-between items-center gap-2 bg-black/80 backdrop-blur-md p-2 rounded-xl border border-stone-700 text-white text-xs">
                  <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-lg">
                    {['roadmap', 'satellite', 'terrain'].map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setMapLayerType(layer)}
                        className={`px-2 py-1 rounded text-[10px] sm:text-[11px] font-black capitalize transition-all ${
                          mapLayerType === layer ? 'bg-amber-500 text-stone-900 shadow' : 'hover:bg-white/20'
                        }`}
                      >
                        {layer}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 rounded text-[10px] font-black bg-stone-800 text-stone-200 border border-stone-700 hidden sm:inline-block">
                      🏥 🚒 🚔 Hospitals & Services Active
                    </span>

                    <button
                      onClick={() => setShowCrowdHeatmap(!showCrowdHeatmap)}
                      className={
                        showCrowdHeatmap 
                          ? (selectedEmergencyForMap.status === 'RESOLVED'
                              ? 'px-2.5 py-1 rounded text-[10px] sm:text-xs font-black flex items-center space-x-1 border transition-all bg-emerald-600 text-white border-emerald-400 shadow-md'
                              : 'px-2.5 py-1 rounded text-[10px] sm:text-xs font-black flex items-center space-x-1 border transition-all bg-red-600 text-white border-red-400 shadow-md animate-pulse')
                          : 'px-2.5 py-1 rounded text-[10px] sm:text-xs font-black flex items-center space-x-1 border transition-all bg-stone-800 text-stone-300 border-stone-600'
                      }
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      <span>Traffic Layer: {showCrowdHeatmap ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative z-10 self-end flex flex-col space-y-1 my-auto">
                  <button
                    onClick={() => {
                      setMapZoomLevel((z) => Math.min(z + 1, 19));
                      if (leafletMapRef.current) leafletMapRef.current.setZoom(mapZoomLevel + 1);
                    }}
                    className="p-1.5 rounded-xl bg-black/80 hover:bg-black text-white border border-stone-700 shadow-lg"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setMapZoomLevel((z) => Math.max(z - 1, 12));
                      if (leafletMapRef.current) leafletMapRef.current.setZoom(mapZoomLevel - 1);
                    }}
                    className="p-1.5 rounded-xl bg-black/80 hover:bg-black text-white border border-stone-700 shadow-lg"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (leafletMapRef.current && selectedEmergencyForMap) {
                        leafletMapRef.current.setView([selectedEmergencyForMap.location.lat, selectedEmergencyForMap.location.lng], 16);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white border border-red-400 shadow-lg"
                    title="Recenter GPS Pin"
                  >
                    <Crosshair className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative z-10 bg-black/85 backdrop-blur-md p-2.5 rounded-xl border border-stone-700 text-white flex justify-between items-center text-xs">
                  <div className="overflow-hidden mr-2">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-300 truncate">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="truncate">{selectedEmergencyForMap.location.address}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const mapsUrl = "https://www.google.com/maps?q=" + selectedEmergencyForMap.location.lat + "," + selectedEmergencyForMap.location.lng;
                      window.open(mapsUrl, '_blank');
                    }}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] sm:text-[11px] font-extrabold rounded-lg flex items-center space-x-1 shrink-0 shadow"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Google Maps</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                {selectedEmergencyForMap.crowdData && (
                  <div className="p-3.5 rounded-2xl border bg-black/5 dark:bg-white/5 space-y-2.5" style={{ borderColor: currentTheme.border }}>
                    <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: currentTheme.border }}>
                      <h4 className="text-xs font-black uppercase tracking-wider flex items-center space-x-1 text-amber-600 dark:text-amber-300">
                        <Users className="w-3.5 h-3.5" />
                        <span>Live Crowd Analytics</span>
                      </h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        selectedEmergencyForMap.status === 'RESOLVED' 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-red-600 text-white animate-pulse'
                      }`}>
                        {selectedEmergencyForMap.crowdData.densityLevel}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10">
                        <span className="text-[10px] block" style={{ color: currentTheme.textMuted }}>Est. Gathered</span>
                        <span className="text-sm font-black text-red-600 dark:text-red-400">
                          ~{selectedEmergencyForMap.crowdData.estimatedCount} People
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10">
                        <span className="text-[10px] block" style={{ color: currentTheme.textMuted }}>Traffic Status</span>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-300 truncate block">
                          {selectedEmergencyForMap.crowdData.congestionStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: currentTheme.textMuted }}>
                    Victim Message
                  </h4>
                  <div className="p-3 rounded-xl border bg-black/5 dark:bg-white/5 text-xs font-semibold leading-relaxed" style={{ borderColor: currentTheme.border }}>
                    "{selectedEmergencyForMap.text}"
                  </div>
                </div>

                {selectedEmergencyForMap.photo && (
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider mb-1 flex items-center space-x-1.5" style={{ color: currentTheme.textMuted }}>
                      <Camera className="w-3.5 h-3.5 text-red-500" />
                      <span>Attached Incident Scene Photo (Click to View)</span>
                    </h4>
                    <div className="rounded-2xl border overflow-hidden bg-black/20 border-red-500/30">
                      <img 
                        src={selectedEmergencyForMap.photo} 
                        alt="Incident Scene Evidence" 
                        className="w-full max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => {
                          const w = window.open();
                          if (w) {
                            w.document.write(`<img src="${selectedEmergencyForMap.photo}" style="max-width:100%;height:auto;display:block;margin:auto;" />`);
                          }
                        }}
                        title="Click to view full photo in new tab"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {selectedEmergencyForMap.status !== 'RESOLVED' ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => updateEmergencyStatus(selectedEmergencyForMap.id, 'TEAM_EN_ROUTE')}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold bg-amber-500 text-stone-900 hover:bg-amber-400 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Radio className="w-4 h-4" />
                        <span>Dispatch Rescue & Alert Crowd</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateEmergencyStatus(selectedEmergencyForMap.id, 'RESOLVED')}
                        className="w-full py-2.5 px-3 rounded-xl text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Resolved & Shift to History</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-xs font-extrabold text-center flex items-center justify-center space-x-1.5 border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Incident Resolved & Archived</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN & ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div 
            className="border w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border 
            }}
            role="dialog"
            aria-modal="true"
          >
            {modalStep === 'select_role' && (
              <div>
                <div className="text-center mb-6">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 border shadow-sm"
                    style={{ 
                      backgroundColor: currentTheme.btnAuth, 
                      borderColor: currentTheme.border 
                    }}
                  >
                    <Lock className="w-6 h-6" style={{ color: currentTheme.textPrimary }} />
                  </div>
                  <h2 className="text-2xl font-black tracking-tight" style={{ color: currentTheme.textPrimary }}>
                    Who You Are ?
                  </h2>
                  <p className="text-xs font-medium mt-1" style={{ color: currentTheme.textMuted }}>
                    Please select an option to proceed
                  </p>
                </div>

                <div className="space-y-3.5">
                  <button
                    onClick={() => handleSelectRole('authorized')}
                    className="w-full py-3.5 px-4 rounded-2xl border font-bold text-sm shadow-sm transition-all flex items-center justify-between group hover:shadow-md active:scale-95 cursor-pointer"
                    style={{ 
                      backgroundColor: currentTheme.btnAuth, 
                      borderColor: currentTheme.border,
                      color: currentTheme.textPrimary
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10">
                        <Key className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm">Authorized person</div>
                        <div className="text-[11px] font-medium" style={{ color: currentTheme.textMuted }}>
                          Staff, Employee or Security Credentials
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleSelectRole('emergency')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-red-600 text-white font-extrabold text-sm border border-red-400/50 shadow-lg transition-all flex items-center justify-between group active:scale-95 hover:bg-red-700 cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-white/20">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-black text-sm tracking-wide">An Emergency</div>
                        <div className="text-[11px] text-red-100 font-normal">
                          Voice input, keyboard & photo dispatch
                        </div>
                      </div>
                    </div>
                    <Radio className="w-5 h-5 text-red-100 animate-pulse" />
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'authorized_login' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      setModalStep('select_role');
                      setAuthError('');
                    }}
                    className="text-xs font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                    style={{ color: currentTheme.textMuted }}
                  >
                    <span>← Back to Role Selection</span>
                  </button>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-200">
                    AUTH PORTAL
                  </span>
                </div>

                <div className="text-left mb-4">
                  <h2 className="text-xl font-black" style={{ color: currentTheme.textPrimary }}>
                    Authorized Verification
                  </h2>
                  <p className="text-xs font-medium mt-1" style={{ color: currentTheme.textMuted }}>
                    Enter Security Badge ID & Access PIN
                  </p>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-700 dark:text-red-200 text-xs font-bold flex items-start space-x-2">
                    <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-xs font-extrabold mb-1" style={{ color: currentTheme.textPrimary }}>
                      Badge ID / Username
                    </label>
                    <input
                      type="text"
                      value={badgeIdInput}
                      onChange={(e) => setBadgeIdInput(e.target.value)}
                      placeholder="e.g. AUTH-8821"
                      className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-amber-500/40"
                      style={{ 
                        backgroundColor: currentTheme.inputBg, 
                        borderColor: currentTheme.border,
                        color: currentTheme.textPrimary
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold mb-1" style={{ color: currentTheme.textPrimary }}>
                      Security Access PIN
                    </label>
                    <div className="relative">
                      <input
                        type={showPin ? 'text' : 'password'}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="••••"
                        className="w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold outline-none transition-all focus:ring-2 focus:ring-amber-500/40 pr-10"
                        style={{ 
                          backgroundColor: currentTheme.inputBg, 
                          borderColor: currentTheme.border,
                          color: currentTheme.textPrimary
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-700 dark:text-stone-300"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={handleQuickDemoFill}
                      className="font-bold underline text-amber-700 dark:text-amber-300 hover:opacity-80"
                    >
                      Auto-fill Test Badge (AUTH-8821 / 7749)
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full py-3 px-5 rounded-2xl font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                    style={{ 
                      backgroundColor: currentTheme.btnAuth,
                      color: currentTheme.textPrimary,
                      borderColor: currentTheme.border
                    }}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Enter Portal</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM GO HOME MODAL */}
      {showConfirmHomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div 
            className="border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center transition-all"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border 
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black mb-2" style={{ color: currentTheme.textPrimary }}>
              Return to Home Page?
            </h3>

            <p className="text-xs font-medium mb-6 leading-relaxed" style={{ color: currentTheme.textMuted }}>
              Are you sure you want to leave this page? Any unsubmitted inputs or active sessions will be reset.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmHomeModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all hover:brightness-95 active:scale-95 cursor-pointer"
                style={{ 
                  backgroundColor: currentTheme.inputBg, 
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary 
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmGoHome}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Yes, Leave</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM SIGN OUT MODAL */}
      {showConfirmSignOutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div 
            className="border w-full max-w-sm rounded-3xl p-6 shadow-2xl relative text-center transition-all"
            style={{ 
              backgroundColor: currentTheme.bgCard, 
              borderColor: currentTheme.border 
            }}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <LogOut className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black mb-2" style={{ color: currentTheme.textPrimary }}>
              Confirm Sign Out?
            </h3>

            <p className="text-xs font-medium mb-6 leading-relaxed" style={{ color: currentTheme.textMuted }}>
              Are you sure you want to sign out from the Authorized Entry Portal? You will need to verify your Badge ID and Access PIN to enter again.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmSignOutModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all hover:brightness-95 active:scale-95 cursor-pointer"
                style={{ 
                  backgroundColor: currentTheme.inputBg, 
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary 
                }}
              >
                Cancel
              </button>

              <button
                onClick={confirmLogOut}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-black text-white bg-red-600 hover:bg-red-700 shadow-md transition-all active:scale-95 flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Modal */}
      {isBlueprintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="border w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative text-left space-y-4" style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}>
            <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: currentTheme.border }}>
              <h3 className="text-sm font-black uppercase tracking-wider" style={{ color: currentTheme.textPrimary }}>Official Government Relocation Blueprint</h3>
              <button onClick={() => setIsBlueprintModalOpen(false)} className="p-1 rounded-lg hover:bg-black/10"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-4 rounded-xl border font-mono text-xs space-y-2" style={{ backgroundColor: currentTheme.inputBg, borderColor: currentTheme.border }}>
              <p>Project Total Budget: <strong className="text-amber-600 dark:text-amber-400">₹ {totalBudget} Crores</strong></p>
              <p>Active Vulnerable Habitations: <strong>{habitations.length} Sectors</strong></p>
              <p>Execution Status: <strong className="text-emerald-600 dark:text-emerald-400">APPROVED BY SDMA & NDRF COMMAND</strong></p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button onClick={() => setIsBlueprintModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold border" style={{ borderColor: currentTheme.border }}>Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-stone-900 shadow">Print Official Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full py-3.5 px-6 text-center text-xs border-t mt-auto" style={{ borderColor: currentTheme.border, color: currentTheme.textMuted }}>
        <p className="font-medium">Applied Color Palette — <span className="font-mono ml-1">Light: #FFF2DB | Dark: #0B192C, #071E3D, #353941</span></p>
      </footer>
    </div>
  );
}