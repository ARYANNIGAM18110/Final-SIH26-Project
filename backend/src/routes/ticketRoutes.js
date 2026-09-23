const express = require('express');
const router = express.Router();
const {
  getTickets,
  createTicket,
  resolveTicket,
  cancelTicket
} = require('../controllers/ticketController');

router.route('/')
  .get(getTickets)
  .post(createTicket);

router.patch('/:id/resolve', resolveTicket);
router.patch('/:id/cancel', cancelTicket);

module.exports = router;