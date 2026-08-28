import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  Radio, 
  Building2, 
  FileText, 
  Undo2, 
  Lock, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

// Constants & Utilities
import {
  THEMES,
  VALID_USERS,
  INITIAL_ENTRY_LOGS,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_HABITATIONS,
  INITIAL_CANDIDATE_SITES,
  INITIAL_CROWD_ZONES,
  LANGUAGES
} from './data/constants';
import { triggerEmergencySiren, stopEmergencySiren } from './utils/audioSiren';
import { registerBatteryOptimizer } from './utils/batteryOptimizer';
import {
  saveOfflineTicket,
  getOfflineOutbox,
  clearSyncedTicket
} from './utils/offlineSyncEngine';
import { triggerHapticFeedback } from './utils/haptics';
import { speakEmergencyVoice, stopEmergencyVoice } from './utils/voiceAlerts';

// Common Components
import Header from './components/common/header';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';
import AuthLoginModal from './components/common/AuthLoginModal';
import TelemetryBar from './components/common/TelemetryBar';
import PwaInstallBanner from './components/common/PwaInstallBanner';
import { ConfirmHomeModal, ConfirmSignOutModal } from './components/common/ConfirmModals';

// Portals & Views
import EmergencyForm from './components/citizen/EmergencyForm';
import EmergencySuccess from './components/citizen/EmergencySuccess';
import CommunityFeed from './components/citizen/CommunityFeed';
import RescuerCockpit from './components/rescuer/RescuerCockpit';
import AuthorityPortal from './components/authority/AuthorityPortal';
import GoogleMapsModal from './components/authority/GoogleMapsModal';
import BlueprintModal from './components/authority/SystemAnalytics/BlueprintModal';

const INITIAL_FEED_POSTS = [
  {
    id: 'FEED-1',
    type: 'OFFER_AID',
    category: 'Drinking Water & Charging',
    title: 'Drinking Water Tanker & 20+ Mobile Charging Sockets Open',
    desc: 'Block D Community Hall has generator power and clean RO water. Families are welcome.',
    location: 'Sector 62, Gate 02 Community Park',
    distanceKm: 0.6,
    time: '8 mins ago',
    author: 'Sunil Verma (Volunteer)',
    isOfficial: false,
    confirmedCount: 6,
    reportedCount: 0,
    synced: true,
    comments: [
      { id: 1, user: 'Pooja R.', text: 'Are baby milk supplies available?', time: '4 mins ago' }
    ]
  },
  {
    id: 'FEED-2',
    type: 'HAZARD_ALERT',
    category: 'Waterlogging & Blockage',
    title: '3.5ft Waterlogged Underpass — Cars Stranded',
    desc: 'Main underpass connecting Sector 62 to Expressway is blocked. Divert via Sector 63 elevated road.',
    location: 'Sector 62 Underpass Junction',
    distanceKm: 1.4,
    time: '15 mins ago',
    author: 'Rajesh K.',
    isOfficial: false,
    confirmedCount: 11,
    reportedCount: 0,
    synced: true,
    comments: []
  },
  {
    id: 'FEED-3',
    type: 'NEED_AID',
    category: 'Medical Prescription',
    title: 'Urgently Need Asthma Inhaler (Salbutamol) for Elderly',
    desc: 'Local pharmacy is inundated with water. Looking for spare unopened inhaler nearby.',
    location: 'Sector 62, Tower B-402',
    distanceKm: 2.1,
    time: '24 mins ago',
    author: 'Dr. Anita S.',
    isOfficial: false,
    confirmedCount: 4,
    reportedCount: 0,
    synced: true,
    comments: []
  }
];

export default function App() {
  const [theme, setTheme] = useState('light');
  const [view, setView] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState('authorized_login');
  const [selectedRole, setSelectedRole] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);
  const [sessionTime, setSessionTime] = useState(new Date().toLocaleTimeString());

  // Network, Battery & Offline Outbox State
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [outboxCount, setOutboxCount] = useState(0);
  const [powerState, setPowerState] = useState({ levelPercent: 100, isCharging: true, isLowPower: false });

  // Auth State
  const [badgeIdInput, setBadgeIdInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Strict Device-Level Active SOS Ticket Lock
  const [myActiveTicketId, setMyActiveTicketId] = useState(() => {
    return localStorage.getItem('karuna_device_active_ticket') || null;
  });

  // Emergency Alerts State
  const [emergencyAlerts, setEmergencyAlerts] = useState(() => {
    const saved = localStorage.getItem('ndrf_shared_alerts');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_ALERTS;
  });

  // Community Feed State
  const [feedPosts, setFeedPosts] = useState(() => {
    const saved = localStorage.getItem('karuna_feed_posts');
    return saved ? JSON.parse(saved) : INITIAL_FEED_POSTS;
  });

  const [selectedEmergencyForMap, setSelectedEmergencyForMap] = useState(null);
  const [communityCommentInput, setCommunityCommentInput] = useState('');

  // Map & GIS Settings
  const [gisTileStyle, setGisTileStyle] = useState('satellite');
  const [leafletReady, setLeafletReady] = useState(false);

  // Authority Navigation Tabs
  const [activePortalTab, setActivePortalTab] = useState('access_ops');
  const [accessSubTab, setAccessSubTab] = useState('entry_log');
  const [analyticsSubTab, setAnalyticsSubTab] = useState('ai_inspector');
  const [crowdFilter, setCrowdFilter] = useState('ALL');
  const [crowdZones, setCrowdZones] = useState(INITIAL_CROWD_ZONES);

  // History & Entry Logs
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState('ALL');
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [entryLogs, setEntryLogs] = useState(INITIAL_ENTRY_LOGS);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [gatesStatus, setGatesStatus] = useState({ gate01: 'UNLOCKED', gate02: 'LOCKED', gate03: 'UNLOCKED' });

  // Entry Check-In Form State
  const [newEntrantName, setNewEntrantName] = useState('');
  const [newEntrantType, setNewEntrantType] = useState('Visitor');
  const [newEntrantId, setNewEntrantId] = useState('');
  const [newEntrantZone, setNewEntrantZone] = useState('Main Reception');

  // Digital Pass State
  const [generatedPass, setGeneratedPass] = useState(null);
  const [passRecipientName, setPassRecipientName] = useState('');
  const [passZone, setPassZone] = useState('Level 2 Office Bay');

  // Citizen SOS Form State
  const [selectedLang, setSelectedLang] = useState('en-US');
  const [emergencyCategoryInput, setEmergencyCategoryInput] = useState('Medical Emergency');
  const [isListening, setIsListening] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [attachedPhoto, setAttachedPhoto] = useState(null);
  const [photoName, setPhotoName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchId, setDispatchId] = useState(() => {
    return localStorage.getItem('karuna_device_active_ticket') || '';
  });
  const [citizenSafeCode, setCitizenSafeCode] = useState(() => {
    return localStorage.getItem('karuna_device_safe_code') || '4829';
  });
  const [currentLocation, setCurrentLocation] = useState(null);

  // Modals
  const [showConfirmHomeModal, setShowConfirmHomeModal] = useState(false);
  const [showConfirmSignOutModal, setShowConfirmSignOutModal] = useState(false);

  // Evacuation Optimizer State
  const [habitations, setHabitations] = useState(INITIAL_HABITATIONS);
  const [candidateSites, setCandidateSites] = useState(INITIAL_CANDIDATE_SITES);
  const [selectedHabId, setSelectedHabId] = useState('hab-1');
  const [selectedSiteId, setSelectedSiteId] = useState('site-1');

  // Tactical SOS & Siren State
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
  const [simShockValue] = useState(40);

  // Governance Audit State
  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '10:42 AM', user: 'Officer Alex Mercer', action: 'Approved Tier 1 Relocation match for Kalyani Village to Chinyalisaur Ridge.' },
    { id: 2, time: '09:15 AM', user: 'Dr. Sarah Connor', action: 'Dispatched Tactical Rescue Unit to Server Room B.' }
  ]);
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);

  // Hero Center Panic Hold Mechanics
  const [isHolding, setIsHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [cancelCountdown, setCancelCountdown] = useState(null);
  const [pendingQuickTicketId, setPendingQuickTicketId] = useState(null);
  const progressIntervalRef = useRef(null);
  const cancelTimerRef = useRef(null);

  // Refs
  const broadcastChannelRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const leafletMapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const analyticsMapRef = useRef(null);
  const successMapRef = useRef(null);
  const successMapInstanceRef = useRef(null);

  const currentTheme = THEMES[theme];

  // --- MULTI-TAB REALTIME BROADCAST SYNC ---
  useEffect(() => {
    const channel = new BroadcastChannel('ndrf_emergency_mesh_sync');
    broadcastChannelRef.current = channel;

    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'NEW_EMERGENCY_ALERT') {
        setEmergencyAlerts((prev) => {
          if (prev.some((a) => a.id === payload.id)) return prev;
          const updated = [payload, ...prev];
          localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
          return updated;
        });
        setToastMessage({ text: `🚨 Inbound Distress Alert: ${payload.dispatchId} (${payload.category})`, type: 'auth' });
        speakEmergencyVoice(`Attention. New distress beacon received for ${payload.category}.`);
        setTimeout(() => setToastMessage(null), 4000);
      } else if (type === 'NEW_FEED_POST') {
        setFeedPosts((prev) => {
          if (prev.some((p) => p.id === payload.id)) return prev;
          const updated = [payload, ...prev];
          localStorage.setItem('karuna_feed_posts', JSON.stringify(updated));
          return updated;
        });
      } else if (type === 'NEW_FEED_REPLY') {
        setFeedPosts((prev) => {
          const updated = prev.map((post) =>
            post.id === payload.postId
              ? { ...post, comments: [...(post.comments || []), payload.reply] }
              : post
          );
          localStorage.setItem('karuna_feed_posts', JSON.stringify(updated));
          return updated;
        });
      } else if (type === 'UPDATE_STATUS') {
        setEmergencyAlerts((prev) => {
          let updated;
          if (payload.status === 'CANCELLED_BY_USER') {
            updated = prev.filter((item) => item.id !== payload.id);
          } else {
            updated = prev.map((item) => (item.id === payload.id ? { ...item, ...payload } : item));
          }
          localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
          return updated;
        });

        if (payload.status === 'RESOLVED' || payload.status === 'CANCELLED_BY_USER') {
          setMyActiveTicketId((curr) => {
            if (curr === payload.id) {
              localStorage.removeItem('karuna_device_active_ticket');
              localStorage.removeItem('karuna_device_safe_code');
              return null;
            }
            return curr;
          });
        }

        if (selectedEmergencyForMap && selectedEmergencyForMap.id === payload.id) {
          setSelectedEmergencyForMap((prev) => (payload.status === 'CANCELLED_BY_USER' ? null : { ...prev, ...payload }));
        }
      }
    };

    return () => channel.close();
  }, [selectedEmergencyForMap]);

  // Battery Optimizer
  useEffect(() => {
    registerBatteryOptimizer((power) => setPowerState(power));
  }, []);

  // Network & Sync
  useEffect(() => {
    getOfflineOutbox().then((tickets) => setOutboxCount(tickets.length));

    const handleOnline = async () => {
      setIsOnline(true);
      const pendingTickets = await getOfflineOutbox();
      if (pendingTickets.length > 0) {
        setToastMessage({
          text: `📡 Connection restored! Auto-syncing ${pendingTickets.length} offline tickets...`,
          type: 'auth'
        });
        for (const t of pendingTickets) {
          await clearSyncedTicket(t.id);
        }
        setOutboxCount(0);
        setTimeout(() => setToastMessage(null), 3000);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setToastMessage({
        text: '⚠️ Network offline. Emergency tickets will be saved to IndexedDB outbox.',
        type: 'auth'
      });
      setTimeout(() => setToastMessage(null), 3500);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Leaflet Dynamic Loader
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
    leafletJs.onload = () => setLeafletReady(true);
    document.head.appendChild(leafletJs);
  }, []);

  // GPS Coordinates Listener
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

  // Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        if (spokenText) {
          setEmergencyText((prev) => (prev ? `${prev.trim()} ${spokenText.trim()}` : spokenText.trim()));
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Success Citizen Map Rendering
  useEffect(() => {
    if (view !== 'emergency_success' || !leafletReady || !successMapRef.current) return;
    const L = window.L;
    if (successMapInstanceRef.current) {
      successMapInstanceRef.current.remove();
      successMapInstanceRef.current = null;
    }

    const userLat = currentLocation?.lat || 28.5355;
    const userLng = currentLocation?.lng || 77.3910;
    const map = L.map(successMapRef.current, { center: [userLat, userLng], zoom: 15, zoomControl: false, attributionControl: false });
    successMapInstanceRef.current = map;
    L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'] }).addTo(map);

    return () => {
      if (successMapInstanceRef.current) {
        successMapInstanceRef.current.remove();
        successMapInstanceRef.current = null;
      }
    };
  }, [view, leafletReady, currentLocation]);

  // Auth Login Submission
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (!badgeIdInput.trim() || !pinInput.trim()) {
      setAuthError('Please enter both Badge ID / Username and Access PIN.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      const inputStr = badgeIdInput.trim().toLowerCase();
      const inputPin = pinInput.trim();

      const match = VALID_USERS.find(
        (u) =>
          (u.badgeId.toLowerCase() === inputStr || (u.name && u.name.toLowerCase().includes(inputStr))) &&
          u.pin === inputPin
      );

      if (match) {
        setLoggedInUser(match);
        setIsVerifying(false);
        setIsModalOpen(false);
        triggerHapticFeedback('success');

        const isRescuerUser =
          selectedRole === 'rescuer' ||
          match.role?.toLowerCase().includes('rescue') ||
          match.badgeId?.toLowerCase().includes('rescue');

        if (isRescuerUser) {
          setView('rescuer_portal');
          setToastMessage({ text: `✓ Rescuer Unit Verified: ${match.name}`, type: 'auth' });
        } else {
          setView('authorized_portal');
          setToastMessage({ text: `✓ Verification Successful! Welcome ${match.name}.`, type: 'auth' });
        }

        setTimeout(() => setToastMessage(null), 3500);
      } else {
        setIsVerifying(false);
        triggerHapticFeedback('danger');
        setAuthError('INVALID CREDENTIALS! Badge ID or Access PIN incorrect.');
      }
    }, 800);
  };

  const confirmLogOut = () => {
    setShowConfirmSignOutModal(false);
    setLoggedInUser(null);
    setBadgeIdInput('');
    setPinInput('');
    setAuthError('');
    setView('home');
    setIsModalOpen(false);
  };

  // Status Progression & Device Unlock
  const updateEmergencyStatus = (alertId, newStatus, proofData = null) => {
    const isResolved = newStatus === 'RESOLVED';
    const isNotified = newStatus === 'RESCUE_NOTIFIED';
    const resolveTimeObj = (isResolved || isNotified)
      ? { date: 'Today', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: Date.now() }
      : null;

    const payload = {
      id: alertId,
      status: newStatus,
      proofData,
      resolvedAt: isResolved ? resolveTimeObj : null,
      assignedOfficer: loggedInUser?.name || 'Officer Alex Mercer'
    };

    if (isResolved && myActiveTicketId === alertId) {
      setMyActiveTicketId(null);
      localStorage.removeItem('karuna_device_active_ticket');
      localStorage.removeItem('karuna_device_safe_code');
    }

    setEmergencyAlerts((prev) => {
      const updated = prev.map((item) => (item.id === alertId ? { ...item, ...payload } : item));
      localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
      return updated;
    });

    if (selectedEmergencyForMap && selectedEmergencyForMap.id === alertId) {
      setSelectedEmergencyForMap((prev) => ({ ...prev, ...payload }));
    }

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'UPDATE_STATUS', payload });
    }

    triggerHapticFeedback(isResolved ? 'success' : 'medium');

    if (isResolved) {
      speakEmergencyVoice(`Incident ${alertId} verified and officially sealed.`);
    } else if (isNotified) {
      speakEmergencyVoice(`Ground rescue proof submitted for ticket ${alertId}.`);
    }

    const toastText = isNotified
      ? `📡 Rescue proof submitted for ${alertId}. Transferred to HQ for Verification Audit.`
      : isResolved
      ? `✓ Incident ${alertId} Verified & Officially Sealed by HQ.`
      : `✓ Status updated to: ${newStatus}`;

    setToastMessage({ text: toastText, type: 'auth' });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- HERO 3-SECOND HOLD SOS ENGINE ---
  const HOLD_DURATION = 3000;
  const INTERVAL_STEP = 50;

  const startHoldingSos = (e) => {
    if (Boolean(myActiveTicketId) || cancelCountdown !== null) return;
    e.preventDefault();
    setIsHolding(true);
    setHoldProgress(0);
    triggerHapticFeedback('medium');

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / HOLD_DURATION) * 100);
      setHoldProgress(progress);

      if (progress > 30 && progress < 35) triggerHapticFeedback('light');
      if (progress > 65 && progress < 70) triggerHapticFeedback('medium');

      if (elapsed >= HOLD_DURATION) {
        clearInterval(progressIntervalRef.current);
        executeImmediateSos();
      }
    }, INTERVAL_STEP);
  };

  const cancelHoldingSos = () => {
    if (cancelCountdown !== null) return;
    setIsHolding(false);
    setHoldProgress(0);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  const executeImmediateSos = () => {
    setIsHolding(false);
    setHoldProgress(0);
    triggerHapticFeedback('sos');
    speakEmergencyVoice('Critical distress beacon broadcasted. Help is en route.');

    const generatedId = 'EMG-' + Math.floor(100000 + Math.random() * 900000);
    const generatedSafeCode = String(Math.floor(1000 + Math.random() * 9000));
    setDispatchId(generatedId);
    setCitizenSafeCode(generatedSafeCode);
    setMyActiveTicketId(generatedId);
    setPendingQuickTicketId(generatedId);
    localStorage.setItem('karuna_device_active_ticket', generatedId);
    localStorage.setItem('karuna_device_safe_code', generatedSafeCode);

    const newRecord = {
      id: generatedId,
      dispatchId: generatedId,
      safeCode: generatedSafeCode,
      category: 'Critical Panic SOS',
      text: 'CRITICAL PANIC BEACON: Instant GPS SOS broadcasted from Home Action Gateway.',
      language: 'English',
      langFlag: '🇺🇸',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      photo: null,
      location: currentLocation || { lat: 28.5355, lng: 77.3910, address: 'Live GPS Coordinates Recorded', city: 'Noida Regional Hub' },
      status: 'ACTIVE_DISPATCH',
      assignedOfficer: 'Unassigned',
      resolvedAt: null,
      proofData: null
    };

    setEmergencyAlerts((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
      return updated;
    });

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'NEW_EMERGENCY_ALERT', payload: newRecord });
    }

    setCancelCountdown(5);
  };

  useEffect(() => {
    if (cancelCountdown === null) return;
    if (cancelCountdown > 0) {
      cancelTimerRef.current = setTimeout(() => {
        setCancelCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCancelCountdown(null);
      setPendingQuickTicketId(null);
      setView('emergency_success');
    }
    return () => clearTimeout(cancelTimerRef.current);
  }, [cancelCountdown]);

  const handleCancelDispatchedSos = () => {
    if (cancelTimerRef.current) clearTimeout(cancelTimerRef.current);
    stopEmergencyVoice();
    triggerHapticFeedback('warning');

    if (pendingQuickTicketId) {
      setMyActiveTicketId(null);
      localStorage.removeItem('karuna_device_active_ticket');
      localStorage.removeItem('karuna_device_safe_code');

      setEmergencyAlerts((prev) => {
        const updated = prev.filter((item) => item.id !== pendingQuickTicketId);
        localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
        return updated;
      });

      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({
          type: 'UPDATE_STATUS',
          payload: { id: pendingQuickTicketId, status: 'CANCELLED_BY_USER' }
        });
      }
    }

    setCancelCountdown(null);
    setPendingQuickTicketId(null);
    speakEmergencyVoice('SOS broadcast cancelled.');
    setToastMessage({ text: '✓ Accidental SOS revoked successfully.', type: 'auth' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (holdProgress / 100) * circumference;

  // --- COMMUNITY FEED HANDLERS (POST, CONFIRM, REPORT, REPLY) ---
  const handleAddNewFeedPost = (newPost) => {
    setFeedPosts((prev) => {
      const updated = [newPost, ...prev];
      localStorage.setItem('karuna_feed_posts', JSON.stringify(updated));
      return updated;
    });

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'NEW_FEED_POST', payload: newPost });
    }

    setToastMessage({ text: '✓ Ground Intelligence posted to grid!', type: 'auth' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyFeedPost = (postId) => {
    triggerHapticFeedback('success');
    setFeedPosts((prev) => {
      const updated = prev.map((p) => (p.id === postId ? { ...p, confirmedCount: p.confirmedCount + 1 } : p));
      localStorage.setItem('karuna_feed_posts', JSON.stringify(updated));
      return updated;
    });
  };

  const handleReportFeedPost = (postId) => {
    triggerHapticFeedback('warning');
    setFeedPosts((prev) => {
      const updated = prev.map((p) => (p.id === postId ? { ...p, reportedCount: (p.reportedCount || 0) + 1 } : p));
      localStorage.setItem('karuna_feed_posts', JSON.stringify(updated));
      return updated;
    });
    setToastMessage({ text: '⚠️ Report registered for moderation review.', type: 'auth' });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddNewFeedReply = (postId, replyObj) => {
    setFeedPosts((prev) => {
      const updated = prev.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), replyObj] }
          : post
      );
      localStorage.setItem('karuna_feed_posts', JSON.stringify(updated));
      return updated;
    });

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({
        type: 'NEW_FEED_REPLY',
        payload: { postId, reply: replyObj }
      });
    }

    setToastMessage({ text: '✓ Reply posted to ground grid!', type: 'auth' });
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Other Handlers
  const handleDispatchCrowdControl = (zone) => {
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: loggedInUser?.name || 'Authorized Officer',
      action: `Dispatched Crowd Dispersion & Public Alert for ${zone.name}.`
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    setIsSirenActive(true);
    setActiveSirenMessage(triggerEmergencySiren(zone.name, () => setIsSirenActive(false)));
  };

  const handleTriggerTacticalSos = (typeText) => {
    triggerHapticFeedback('danger');
    const targetZone = crowdZones.find((z) => z.id === selectedSosTargetZone) || crowdZones[0];
    const newEvt = { id: 'sos-' + Date.now(), type: typeText, target: targetZone.name, time: 'Just now', status: 'NDRF Unit Dispatched', eta: '4 Mins' };
    setTacticalSosQueue((prev) => [newEvt, ...prev]);
    setIsSirenActive(true);
    setActiveSirenMessage(triggerEmergencySiren(targetZone.name, () => setIsSirenActive(false)));
  };

  const handleConfirmEvacuationShift = () => {
    const hab = habitations.find((h) => h.id === selectedHabId);
    const site = candidateSites.find((s) => s.id === selectedSiteId);
    if (hab && site) {
      const populationToMove = hab.pop;
      setCandidateSites((prev) => prev.map((s) => (s.id === site.id ? { ...s, allocatedPop: s.allocatedPop + populationToMove } : s)));
      setHabitations((prev) =>
        prev.map((h) =>
          h.id === hab.id
            ? { ...h, pop: 0, status: 'EVACUATED', tier: 'Tier 3 (Safely Evacuated)', cvs: 0.12, name: `${h.name.replace(' (Red Hazard Zone)', '')} [EVACUATED]` }
            : h
        )
      );
      setToastMessage({ text: `✓ EMERGENCY EVACUATION EXECUTED! ${populationToMove} Residents Shifted`, type: 'auth' });
      setTimeout(() => setToastMessage(null), 4000);
    }
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
    setToastMessage({ text: `✓ Entry Granted for ${newRecord.name}`, type: 'auth' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCheckOutEntrant = (id) => {
    setEntryLogs((prev) => prev.map((log) => (log.id === id ? { ...log, status: 'CHECKED_OUT' } : log)));
    setToastMessage({ text: `✓ Entrant ${id} checked out.`, type: 'auth' });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleGateStatus = (gateKey) =>
    setGatesStatus((prev) => ({ ...prev, [gateKey]: prev[gateKey] === 'UNLOCKED' ? 'LOCKED' : 'UNLOCKED' }));

  const handleGeneratePass = (e) => {
    e.preventDefault();
    if (!passRecipientName.trim()) return;
    setGeneratedPass({
      passCode: 'PASS-' + Math.floor(100000 + Math.random() * 900000),
      name: passRecipientName.trim(),
      zone: passZone,
      validUntil: 'Today, 23:59 PM',
      issuer: loggedInUser?.name || 'Officer Alex Mercer'
    });
  };

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) try { recognitionRef.current.stop(); } catch (e) {}
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = selectedLang || 'en-US';
          recognitionRef.current.start();
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

  // Submit Emergency with Strict Device Lock
  const submitEmergencyForm = async (e) => {
    e.preventDefault();

    if (myActiveTicketId) {
      setToastMessage({ text: '⚠️ Device locked: You already have an active SOS dispatch!', type: 'auth' });
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSubmitting(true);
    triggerHapticFeedback('sos');

    const generatedId = 'EMG-' + Math.floor(100000 + Math.random() * 900000);
    const generatedSafeCode = String(Math.floor(1000 + Math.random() * 9000));
    setDispatchId(generatedId);
    setCitizenSafeCode(generatedSafeCode);
    setMyActiveTicketId(generatedId);
    localStorage.setItem('karuna_device_active_ticket', generatedId);
    localStorage.setItem('karuna_device_safe_code', generatedSafeCode);

    const langName = LANGUAGES.find((l) => l.code === selectedLang)?.name || 'English';
    const langFlag = LANGUAGES.find((l) => l.code === selectedLang)?.flag || '🇺🇸';

    const newRecord = {
      id: generatedId,
      dispatchId: generatedId,
      safeCode: generatedSafeCode,
      category: emergencyCategoryInput,
      text: emergencyText || 'Emergency distress signal triggered.',
      language: langName,
      langFlag: langFlag,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: 'Today',
      photo: attachedPhoto,
      location: currentLocation || { lat: 28.5355, lng: 77.3910, address: 'Command Sector Gate 01', city: 'Noida Regional Hub' },
      status: 'ACTIVE_DISPATCH',
      assignedOfficer: 'Unassigned',
      resolvedAt: null,
      proofData: null
    };

    if (!navigator.onLine) {
      await saveOfflineTicket(newRecord);
      const updatedOutbox = await getOfflineOutbox();
      setOutboxCount(updatedOutbox.length);
    }

    setEmergencyAlerts((prev) => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
      return updated;
    });

    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'NEW_EMERGENCY_ALERT', payload: newRecord });
    }

    speakEmergencyVoice(
      `Distress beacon broadcasted. Dispatch ID ${generatedId}. Your safe verification code is ${generatedSafeCode.split('').join(' ')}. Help is en route.`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      setView('emergency_success');
    }, 800);
  };

  const handlePostComment = (e, alertId) => {
    e.preventDefault();
    if (!communityCommentInput.trim()) return;
    setEmergencyAlerts((prev) => {
      const updated = prev.map((item) =>
        item.id === alertId
          ? {
              ...item,
              comments: [
                ...(item.comments || []),
                {
                  id: Date.now(),
                  user: loggedInUser?.name || 'Anonymous Officer',
                  text: communityCommentInput.trim(),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]
            }
          : item
      );
      localStorage.setItem('ndrf_shared_alerts', JSON.stringify(updated));
      return updated;
    });
    setCommunityCommentInput('');
    setToastMessage({ text: '✓ Comment posted to feed!', type: 'auth' });
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRunAiInspection = () => {
    setAiInspectLoading(true);
    setAiInspectResult(null);
    setTimeout(() => {
      const hab = habitations.find((h) => h.id === selectedInspectorHabId) || habitations[0];
      const s = hab.scores || { flood: 85, landslide: 92, seismic: 78, terrain: 88, structural: 84, demographic: 82, infrastructure: 80 };
      const hazardExposure = (s.flood + s.landslide + s.seismic + s.terrain) / 4;
      const structuralRisk = (s.structural + s.infrastructure) / 2;
      const demographicRisk = s.demographic;
      const rawCvs = 0.4 * hazardExposure + 0.35 * structuralRisk + 0.25 * demographicRisk;
      const normalizedCvs = parseFloat((rawCvs / 100).toFixed(2));

      setAiInspectResult({
        habitation: hab,
        scores: s,
        hazardExposure: parseFloat(hazardExposure.toFixed(1)),
        structuralRisk: parseFloat(structuralRisk.toFixed(1)),
        demographicRisk: parseFloat(demographicRisk.toFixed(1)),
        cvs: normalizedCvs,
        classification: normalizedCvs > 0.75 ? 'TIER 1 — IMMEDIATE RELOCATION' : normalizedCvs > 0.5 ? 'TIER 2 — SHORT-TERM RELOCATION' : 'TIER 3 — MONITORING',
        priority: normalizedCvs > 0.75 ? 'CRITICAL' : normalizedCvs > 0.5 ? 'HIGH' : 'MODERATE',
        recommendedAction: 'Immediate evacuation assessment and priority relocation-site allocation.',
        reasoning: `High hazard exposure (${hazardExposure.toFixed(1)}/100) and kucha structure vulnerability yielded CVS of ${normalizedCvs}.`,
        confidence: '95.8% Confidence • Multi-Spectral Satellite Data',
        actions: ['Immediate evacuation assessment', 'Allocate temporary transit shelter', 'Match with nearest Green Field']
      });
      setAiInspectLoading(false);
    }, 1200);
  };

  const confirmGoHome = () => {
    setShowConfirmHomeModal(false);
    setView('home');
    setSelectedRole(null);
    setIsModalOpen(false);
    setEmergencyText('');
    setAttachedPhoto(null);
    setPhotoName('');
  };

  const filteredLogs = entryLogs.filter(
    (log) => log.name.toLowerCase().includes(logSearchQuery.toLowerCase()) || log.idNumber.toLowerCase().includes(logSearchQuery.toLowerCase())
  );
  const activeEmergencies = emergencyAlerts.filter((e) => e.status !== 'RESOLVED');
  const resolvedEmergencies = emergencyAlerts.filter((e) => e.status === 'RESOLVED');
  const filteredHistory = resolvedEmergencies.filter(
    (item) =>
      (historyCategoryFilter === 'ALL' || item.category === historyCategoryFilter) &&
      item.dispatchId.toLowerCase().includes(historySearchQuery.toLowerCase())
  );
  const selectedHab = habitations.find((h) => h.id === selectedHabId) || habitations[0];
  const selectedSite = candidateSites.find((s) => s.id === selectedSiteId) || candidateSites[0];
  const remainingCap = selectedSite ? selectedSite.maxCapacity - selectedSite.allocatedPop : 0;
  const isAllocationFeasible = selectedHab && selectedHab.pop > 0 && remainingCap >= selectedHab.pop;
  const requiredBuses = selectedHab ? Math.ceil(selectedHab.pop / 40) : 0;
  const currentInspectorHab = habitations.find((h) => h.id === selectedInspectorHabId) || habitations[0];
  const shockMultiplier = 1 + simShockValue / 100;
  const displacedFamilies = Math.round(500 * shockMultiplier);
  const totalBudget = (displacedFamilies * 0.049).toFixed(2);

  return (
    <div
      className="min-h-screen flex flex-col justify-between transition-colors duration-300 font-sans relative overflow-x-hidden"
      style={{ backgroundColor: currentTheme.bgPage, color: currentTheme.textPrimary }}
    >
      <Header
        currentTheme={currentTheme}
        theme={theme}
        toggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        onRequestGoHome={() => (view === 'home' ? confirmGoHome() : setShowConfirmHomeModal(true))}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-center items-center text-center my-auto">
        <Toast toastMessage={toastMessage} />

        {/* Global Siren Alert Bar */}
        {isSirenActive && (
          <div className="fixed top-16 sm:top-20 z-50 w-[92%] max-w-3xl p-3.5 rounded-2xl bg-red-600 text-white shadow-2xl border-2 border-red-300 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-3 overflow-hidden text-left">
              <Volume2 className="w-6 h-6 shrink-0 animate-bounce" />
              <div>
                <p className="text-xs font-black uppercase tracking-wider">LOUD EMERGENCY SIREN ACTIVE</p>
                <p className="text-[11px] font-semibold truncate">{activeSirenMessage}</p>
              </div>
            </div>
            <button
              onClick={() => {
                stopEmergencySiren();
                setIsSirenActive(false);
              }}
              className="px-3 py-1.5 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow hover:bg-stone-100 shrink-0 ml-2 flex items-center space-x-1 cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>MUTE</span>
            </button>
          </div>
        )}

        {/* --- DIRECT ZERO-LATENCY ACTION HUB (HOME GATEWAY) --- */}
        {view === 'home' && (
          <div className="w-full max-w-3xl space-y-6 animate-fadeIn py-4">
            
            {/* 1. HERO INSTANT PANIC SOS TRIGGER */}
            <div
              className="p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden text-center flex flex-col items-center justify-center transition-all"
              style={{
                backgroundColor: currentTheme.bgCard,
                borderColor: Boolean(myActiveTicketId) ? currentTheme.border : 'rgba(239, 68, 68, 0.4)'
              }}
            >
              {cancelCountdown !== null ? (
                <div className="w-full p-4 rounded-2xl bg-red-600 text-white border-2 border-red-300 shadow-xl flex items-center justify-between animate-bounce">
                  <div className="flex items-center space-x-3 text-left">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-base">
                      {cancelCountdown}s
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase">SOS BROADCAST DISPATCHED!</p>
                      <p className="text-[11px] opacity-90">Auto-locking in {cancelCountdown}s. Mistake? Cancel now.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelDispatchedSos}
                    className="px-4 py-2 rounded-xl bg-white text-red-700 font-black text-xs flex items-center space-x-1 shadow cursor-pointer active:scale-95"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
                    <h2 className="text-sm font-black tracking-widest uppercase text-red-600 dark:text-red-400">
                      Tier-1 Life Threat Bypass
                    </h2>
                  </div>

                  {isHolding && (
                    <div className="mb-3 p-2 rounded-xl bg-black/90 text-white text-[10px] font-mono border border-red-500/40 shadow-lg animate-fadeIn max-w-xs text-center">
                      <span className="text-amber-400 font-bold block flex items-center justify-center space-x-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>LEGAL NOTICE (DM ACT SEC 54)</span>
                      </span>
                      Live GPS dispatch initiated. False alarms are legally punishable.
                    </div>
                  )}

                  {/* SVG Large Circular Progress Hold Button */}
                  <div className="relative flex items-center justify-center my-2">
                    <svg className="w-36 h-36 -rotate-90 pointer-events-none absolute z-10">
                      <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        className="text-stone-300 dark:text-stone-700"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r={radius}
                        className="text-red-500 transition-all duration-75"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>

                    <button
                      onMouseDown={startHoldingSos}
                      onMouseUp={cancelHoldingSos}
                      onMouseLeave={cancelHoldingSos}
                      onTouchStart={startHoldingSos}
                      onTouchEnd={cancelHoldingSos}
                      disabled={Boolean(myActiveTicketId)}
                      className={`w-28 h-28 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-transform active:scale-95 cursor-pointer relative z-20 ${
                        Boolean(myActiveTicketId)
                          ? 'bg-stone-600 opacity-80 cursor-not-allowed border-2 border-stone-400'
                          : isHolding
                          ? 'bg-red-700 scale-105'
                          : 'bg-red-600 hover:bg-red-500 animate-pulse'
                      }`}
                      style={{
                        boxShadow: isHolding
                          ? '0 0 45px rgba(239, 68, 68, 0.95)'
                          : Boolean(myActiveTicketId)
                          ? 'none'
                          : '0 10px 30px rgba(220, 38, 38, 0.55)'
                      }}
                      aria-label="Hold 3 seconds for Panic SOS"
                    >
                      {Boolean(myActiveTicketId) ? (
                        <Lock className="w-8 h-8 text-stone-300" />
                      ) : (
                        <ShieldAlert className={`w-9 h-9 ${isHolding ? 'animate-bounce text-amber-300' : ''}`} />
                      )}
                      <span className="text-[11px] font-black tracking-wider mt-1 uppercase">
                        {Boolean(myActiveTicketId) ? 'LOCKED' : isHolding ? `${Math.ceil((100 - holdProgress) / 33)}s` : 'HOLD SOS'}
                      </span>
                    </button>
                  </div>

                  <p className="text-xs font-bold mt-3" style={{ color: currentTheme.textMuted }}>
                    {Boolean(myActiveTicketId) ? (
                      <span className="text-amber-500 cursor-pointer underline" onClick={() => setView('emergency_success')}>
                        Device locked to active SOS. Click to view live status.
                      </span>
                    ) : (
                      'Press & Hold for 3 Seconds to dispatch instant GPS distress beacon'
                    )}
                  </p>
                </>
              )}
            </div>

            {/* 2. DIRECT ACTION GATEWAY TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              
              {/* Detailed Citizen Form Tile */}
              <div
                onClick={() => {
                  if (myActiveTicketId) {
                    setView('emergency_success');
                  } else {
                    setView('emergency_form');
                  }
                }}
                className="p-5 rounded-3xl border shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-600 flex items-center justify-center mb-3">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black mb-1" style={{ color: currentTheme.textPrimary }}>
                    Citizen Detailed SOS
                  </h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    Multilingual voice, photo attachment & headcount context reporting.
                  </p>
                </div>
                <div className="mt-4 flex items-center space-x-1 text-xs font-black text-red-600 group-hover:translate-x-1 transition-transform">
                  <span>{myActiveTicketId ? 'View Active Status' : 'Open Full Form'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Rescuer Cockpit Login Tile */}
              <div
                onClick={() => {
                  setSelectedRole('rescuer');
                  setModalStep('authorized_login');
                  setAuthError('');
                  setIsModalOpen(true);
                }}
                className="p-5 rounded-3xl border shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 flex items-center justify-center mb-3">
                    <Radio className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black mb-1" style={{ color: currentTheme.textPrimary }}>
                    NDRF Rescuer Cockpit
                  </h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    Live GPS radar dispatch, tactical routing & safe-code verification.
                  </p>
                </div>
                <div className="mt-4 flex items-center space-x-1 text-xs font-black text-amber-600 group-hover:translate-x-1 transition-transform">
                  <span>Field Unit Login</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Authority Command Login Tile */}
              <div
                onClick={() => {
                  setSelectedRole('authorized');
                  setModalStep('authorized_login');
                  setAuthError('');
                  setIsModalOpen(true);
                }}
                className="p-5 rounded-3xl border shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                style={{ backgroundColor: currentTheme.bgCard, borderColor: currentTheme.border }}
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-600 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black mb-1" style={{ color: currentTheme.textPrimary }}>
                    HQ Command Center
                  </h3>
                  <p className="text-[11px] leading-relaxed" style={{ color: currentTheme.textMuted }}>
                    Crowd heatmaps, AI relocation simulations, access control & logs.
                  </p>
                </div>
                <div className="mt-4 flex items-center space-x-1 text-xs font-black text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>Officer Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* View 2: Rescuer Cockpit */}
        {view === 'rescuer_portal' && (
          <RescuerCockpit
            currentTheme={currentTheme}
            currentLocation={currentLocation}
            emergencyAlerts={emergencyAlerts}
            updateEmergencyStatus={updateEmergencyStatus}
            onOpenMapModal={(m) => setSelectedEmergencyForMap(m)}
          />
        )}

        {/* View 3: Citizen Form */}
        {view === 'emergency_form' && (
          <EmergencyForm
            currentTheme={currentTheme}
            selectedLang={selectedLang}
            setSelectedLang={setSelectedLang}
            emergencyCategoryInput={emergencyCategoryInput}
            setEmergencyCategoryInput={setEmergencyCategoryInput}
            isListening={isListening}
            toggleListening={toggleListening}
            emergencyText={emergencyText}
            setEmergencyText={setEmergencyText}
            showVirtualKeyboard={showVirtualKeyboard}
            setShowVirtualKeyboard={setShowVirtualKeyboard}
            handleKeyPress={handleKeyPress}
            handleBackspace={handleBackspace}
            attachedPhoto={attachedPhoto}
            photoName={photoName}
            fileInputRef={fileInputRef}
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
            isSubmitting={isSubmitting}
            onSubmitEmergencyForm={submitEmergencyForm}
            hasActiveTicket={Boolean(myActiveTicketId)}
            onViewActiveTicket={() => setView('emergency_success')}
          />
        )}

        {/* View 4: Citizen Success & Tracking */}
        {view === 'emergency_success' && (
          <EmergencySuccess
            currentTheme={currentTheme}
            dispatchId={dispatchId}
            safeCode={citizenSafeCode}
            currentLocation={currentLocation}
            successMapRef={successMapRef}
            onOpenCommunityFeed={() => {
              setView('community_feed');
              setActivePortalTab('community_feed');
            }}
            onRequestGoHome={() => setShowConfirmHomeModal(true)}
          />
        )}

        {/* View 5: Upgraded Tactical Community Feed with Threaded Replies */}
        {view === 'community_feed' && (
          <CommunityFeed
            currentTheme={currentTheme}
            emergencyAlerts={emergencyAlerts}
            currentLocation={currentLocation}
            communityCommentInput={communityCommentInput}
            setCommunityCommentInput={setCommunityCommentInput}
            handlePostComment={handlePostComment}
            onBack={() => setView('emergency_success')}
            isOnline={isOnline}
            feedPosts={feedPosts}
            onAddNewFeedPost={handleAddNewFeedPost}
            onVerifyFeedPost={handleVerifyFeedPost}
            onReportFeedPost={handleReportFeedPost}
            onAddFeedReply={handleAddNewFeedReply}
          />
        )}

        {/* View 6: Authority Portal */}
        {view === 'authorized_portal' && (
          <AuthorityPortal
            currentTheme={currentTheme}
            loggedInUser={loggedInUser}
            sessionTime={sessionTime}
            onSignOutClick={() => setShowConfirmSignOutModal(true)}
            activePortalTab={activePortalTab}
            setActivePortalTab={setActivePortalTab}
            activeEmergenciesCount={activeEmergencies.length}
            resolvedEmergenciesCount={resolvedEmergencies.length}
            accessSubTab={accessSubTab}
            setAccessSubTab={setAccessSubTab}
            entryLogs={entryLogs}
            logSearchQuery={logSearchQuery}
            setLogSearchQuery={setLogSearchQuery}
            filteredLogs={filteredLogs}
            handleCheckOutEntrant={handleCheckOutEntrant}
            newEntrantName={newEntrantName}
            setNewEntrantName={setNewEntrantName}
            newEntrantType={newEntrantType}
            setNewEntrantType={setNewEntrantType}
            newEntrantId={newEntrantId}
            setNewEntrantId={setNewEntrantId}
            newEntrantZone={newEntrantZone}
            setNewEntrantZone={setNewEntrantZone}
            handleCreateCheckIn={handleCreateCheckIn}
            gatesStatus={gatesStatus}
            toggleGateStatus={toggleGateStatus}
            passRecipientName={passRecipientName}
            setPassRecipientName={setPassRecipientName}
            passZone={passZone}
            setPassZone={setPassZone}
            handleGeneratePass={handleGeneratePass}
            generatedPass={generatedPass}
            activeEmergencies={activeEmergencies}
            onSelectEmergencyForMap={(emg) => setSelectedEmergencyForMap(emg)}
            historySearchQuery={historySearchQuery}
            setHistorySearchQuery={setHistorySearchQuery}
            historyCategoryFilter={historyCategoryFilter}
            setHistoryCategoryFilter={setHistoryCategoryFilter}
            filteredHistory={filteredHistory}
            analyticsSubTab={analyticsSubTab}
            setAnalyticsSubTab={setAnalyticsSubTab}
            habitations={habitations}
            selectedInspectorHabId={selectedInspectorHabId}
            setSelectedInspectorHabId={setSelectedInspectorHabId}
            setAiInspectResult={setAiInspectResult}
            currentInspectorHab={currentInspectorHab}
            handleRunAiInspection={handleRunAiInspection}
            aiInspectLoading={aiInspectLoading}
            aiInspectResult={aiInspectResult}
            selectedHabId={selectedHabId}
            setSelectedHabId={setSelectedHabId}
            selectedHab={selectedHab}
            candidateSites={candidateSites}
            selectedSiteId={selectedSiteId}
            setSelectedSiteId={setSelectedSiteId}
            selectedSite={selectedSite}
            isAllocationFeasible={isAllocationFeasible}
            remainingCap={remainingCap}
            requiredBuses={requiredBuses}
            handleConfirmEvacuationShift={handleConfirmEvacuationShift}
            crowdZones={crowdZones}
            selectedSosTargetZone={selectedSosTargetZone}
            setSelectedSosTargetZone={setSelectedSosTargetZone}
            handleTriggerTacticalSos={handleTriggerTacticalSos}
            tacticalSosQueue={tacticalSosQueue}
            crowdFilter={crowdFilter}
            setCrowdFilter={setCrowdFilter}
            gisTileStyle={gisTileStyle}
            setGisTileStyle={setGisTileStyle}
            analyticsMapRef={analyticsMapRef}
            handleDispatchCrowdControl={handleDispatchCrowdControl}
            auditLogs={auditLogs}
            setIsBlueprintModalOpen={setIsBlueprintModalOpen}
            updateEmergencyStatus={updateEmergencyStatus}
          />
        )}
      </main>

      {/* Auth Login Modal */}
      <AuthLoginModal
        isOpen={isModalOpen && modalStep === 'authorized_login'}
        loginType={selectedRole}
        currentTheme={currentTheme}
        badgeIdInput={badgeIdInput}
        setBadgeIdInput={setBadgeIdInput}
        pinInput={pinInput}
        setPinInput={setPinInput}
        showPin={showPin}
        setShowPin={setShowPin}
        authError={authError}
        setAuthError={setAuthError}
        isVerifying={isVerifying}
        onLoginSubmit={handleLoginSubmit}
        onBackToRole={() => {
          setIsModalOpen(false);
          setAuthError('');
        }}
      />

      <ConfirmHomeModal isOpen={showConfirmHomeModal} currentTheme={currentTheme} onCancel={() => setShowConfirmHomeModal(false)} onConfirm={confirmGoHome} />
      
      <ConfirmSignOutModal isOpen={showConfirmSignOutModal} currentTheme={currentTheme} onCancel={() => setShowConfirmSignOutModal(false)} onConfirm={confirmLogOut} />
      
      <GoogleMapsModal
        selectedEmergencyForMap={selectedEmergencyForMap}
        onClose={() => setSelectedEmergencyForMap(null)}
        currentTheme={currentTheme}
        mapContainerRef={mapContainerRef}
        leafletMapRef={leafletMapRef}
        updateEmergencyStatus={updateEmergencyStatus}
      />
      
      <BlueprintModal isOpen={isBlueprintModalOpen} onClose={() => setIsBlueprintModalOpen(false)} currentTheme={currentTheme} totalBudget={totalBudget} habitationsCount={habitations.length} />

      <PwaInstallBanner currentTheme={currentTheme} />

      <TelemetryBar
        isOnline={isOnline}
        outboxCount={outboxCount}
        powerState={powerState}
        currentTheme={currentTheme}
      />

      <Footer currentTheme={currentTheme} />
    </div>
  );
}