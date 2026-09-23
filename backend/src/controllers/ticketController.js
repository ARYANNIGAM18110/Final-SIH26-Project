const Ticket = require('../models/Ticket');

// @desc    Get all emergency tickets
// @route   GET /api/tickets
exports.getTickets = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new Panic SOS Ticket
// @route   POST /api/tickets
exports.createTicket = async (req, res, next) => {
  try {
    const { category, text, language, langFlag, location, photo } = req.body;

    const dispatchId = `SOS-${Math.floor(100000 + Math.random() * 900000)}`;
    const safeCode = Math.floor(1000 + Math.random() * 9000).toString();

    const newTicket = await Ticket.create({
      dispatchId,
      safeCode,
      category: category || 'Critical Panic SOS',
      text,
      language: language || 'English',
      langFlag: langFlag || '🇺🇸',
      photo: photo || null,
      location: {
        type: 'Point',
        coordinates: location?.coordinates || [77.3910, 28.5355],
        address: location?.address || 'GPS Live Coordinates Acquired',
        city: location?.city || 'Noida Regional Hub'
      },
      status: 'ACTIVE_DISPATCH'
    });

    // Real-time broadcast to rescuer mesh
    const io = req.app.get('io');
    if (io) {
      io.emit('NEW_SOS_ALERT', newTicket);
    }

    res.status(201).json({
      success: true,
      data: newTicket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve SOS Ticket with Rescuer Proof & SafeCode
// @route   PATCH /api/tickets/:id/resolve
exports.resolveTicket = async (req, res, next) => {
  try {
    const { safeCodeInput, notes, officerName } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // SafeCode validation
    if (ticket.safeCode !== safeCodeInput) {
      return res.status(400).json({
        success: false,
        message: 'Invalid 4-Digit Citizen SafeCode! Mission verification failed.'
      });
    }

    ticket.status = 'RESOLVED';
    ticket.assignedOfficer = officerName || ticket.assignedOfficer;
    ticket.proofData = {
      notes: notes || 'Mission safely completed on ground.',
      verifiedSafeCode: safeCodeInput,
      submittedAt: new Date()
    };
    ticket.resolvedAt = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      timestamp: new Date()
    };

    await ticket.save();

    // Broadcast resolution event
    const io = req.app.get('io');
    if (io) {
      io.emit('TICKET_STATUS_UPDATED', ticket);
    }

    res.status(200).json({
      success: true,
      message: 'SOS Mission Successfully Verified & Resolved',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel SOS Ticket by Citizen
// @route   PATCH /api/tickets/:id/cancel
exports.cancelTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = 'CANCELLED_BY_USER';
    await ticket.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('TICKET_STATUS_UPDATED', ticket);
    }

    res.status(200).json({
      success: true,
      message: 'SOS Cancelled by User',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};