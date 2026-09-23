const path = require('path');
const dns = require('dns');

// Force DNS resolution
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {}

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const FeedPost = require('./models/FeedPost');
const User = require('./models/User');
const AccessLog = require('./models/AccessLog');

console.log('⚡ Starting Database Seeder Script...');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    console.log('Target URI:', mongoUri ? 'URI Found' : 'URI Missing');

    if (!mongoUri) {
      throw new Error('MONGO_URI is missing. Make sure .env is in backend folder.');
    }

    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB! Clearing old documents...');

    // Clear old data
    await Ticket.deleteMany({});
    await FeedPost.deleteMany({});
    await User.deleteMany({});
    await AccessLog.deleteMany({});

    console.log('⏳ Inserting fresh mock records...');

    // 1. Seed Users
    await User.create([
      {
        name: 'Officer Rajesh Kumar',
        badgeId: 'RESCUE-01',
        pin: '1234',
        role: 'Lead Field Rescuer',
        userType: 'rescuer',
        status: 'AVAILABLE',
        currentLocation: { type: 'Point', coordinates: [77.3910, 28.5355] }
      },
      {
        name: 'Commander Priya Sharma',
        badgeId: 'AUTH-01',
        pin: '9999',
        role: 'Incident Commander',
        userType: 'authority',
        status: 'AVAILABLE',
        currentLocation: { type: 'Point', coordinates: [77.3950, 28.5400] }
      }
    ]);

    // 2. Seed Initial SOS Tickets
    await Ticket.create([
      {
        dispatchId: 'SOS-882190',
        safeCode: '4821',
        category: 'Flood Evacuation',
        text: 'Water levels reaching first floor. 4 family members including 1 infant trapped on roof.',
        language: 'Hindi',
        langFlag: '🇮🇳',
        location: {
          coordinates: [77.3820, 28.5300],
          address: 'Sector 62 Near Metro Pillar 140',
          city: 'Noida'
        },
        status: 'ACTIVE_DISPATCH'
      },
      {
        dispatchId: 'SOS-554210',
        safeCode: '9102',
        category: 'Medical Emergency',
        text: 'Severe fracture from fallen debris, urgent first aid & stretcher needed.',
        language: 'English',
        langFlag: '🇺🇸',
        location: {
          coordinates: [77.3990, 28.5450],
          address: 'Block B Community Park',
          city: 'Noida'
        },
        status: 'ACTIVE_DISPATCH'
      }
    ]);

    // 3. Seed Feed Posts
    await FeedPost.create([
      {
        postId: 'POST-101',
        type: 'OFFICIAL_HQ_BROADCAST',
        category: 'Official Evacuation Alert',
        title: 'Mandatory Evacuation Order - Low-Lying Riverbeds',
        desc: 'All residents near Hindon flood plains must shift to Sector 62 Relief Camp immediately.',
        location: { address: 'Hindon Flood Basin Area', coordinates: [77.4000, 28.5500] },
        distanceKm: 1.2,
        author: 'Disaster Management HQ',
        isOfficial: true,
        confirmedCount: 45,
        reportedCount: 0,
        comments: []
      },
      {
        postId: 'POST-102',
        type: 'OFFER_AID',
        category: 'Clean Drinking Water',
        title: '1000L Potable Water Tanker Available',
        desc: 'Clean RO water available for distribution at Community Hall.',
        location: { address: 'Sector 55 Community Center', coordinates: [77.3750, 28.5200] },
        distanceKm: 0.8,
        author: 'Local Citizen Volunteer Mesh',
        isOfficial: false,
        confirmedCount: 12,
        reportedCount: 0,
        comments: []
      }
    ]);

    console.log('✅ All Collections Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Seeder Failed:', error);
    process.exit(1);
  }
};

seedData();